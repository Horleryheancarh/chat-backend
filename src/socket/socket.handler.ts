import { Server, Socket } from 'socket.io';
import jwt from 'jsonwebtoken';
import { Op } from 'sequelize';

import { Message, RoomMember, User } from '../models';
import { JWT_SECRET } from '../config';


interface AuthenticatedSocket extends Socket {
  user?: User;
  userId?: number;
}

export const initializeSocket = (io: Server) => {
  io.use(async (socket: AuthenticatedSocket, next) => {
    try {
      const token = socket.handshake.auth.token;
      if (!token) throw new Error('Unauthorized');

      const payload = jwt.verify(token, JWT_SECRET!) as { id: number };
      const user = await User.findByPk(payload.id);

      if (!user) return next(new Error('Unauthorized'));

      socket.user = user;
      socket.userId = user.id;

      await user.update({ online: true, lastSeen: new Date() });

      next();
    } catch (error) {
      // console.error('Socket authentication error:', error);
      next(new Error('Unauthorized'));
    }
  });

  io.on('connection', (socket: AuthenticatedSocket) => {
    console.log(`User ${socket.userId} connected`);

    // Join Room
    socket.on('join_room', async (roomId: number) => {
      try {
        const isMember = await RoomMember.findOne({
          where: { userId: socket.userId, roomId }
        });

        if (!isMember) {
          socket.emit('error', { message: 'You are not a member of this room' });
          return;
        }

        socket.join(`room_${roomId}`);
        socket.emit('joined_room', { roomId });

        // Notify Room
        socket.to(`room_${roomId}`).emit('user_joined', {
          userId: socket.userId,
          username: socket.user?.username
        });
      } catch (error) {
        socket.emit('error', { message: 'Failed to join room' });
      }
    });

    // Send message
    socket.on('send_message', async (data: { roomId: number; content: string }) => {
      try {
        const { roomId, content } = data;

        if(!content.trim()) {
          socket.emit('error', { message: 'Message content cannot be empty' });
          return;
        }

        // Rate limiting
        const recentMessages = await Message.count({
          where: {
            userId: socket.userId,
            createdAt: {
              [Op.gte]: new Date(Date.now() - 10000), // 10 seconds ago
            },
          },
        });

        if (recentMessages >= 5) {
          socket.emit('error', { message: 'You are sending messages too quickly. Please wait a moment.' });
          return;
        }

        // Save message to database
        const message = await Message.create({
          roomId,
          userId: socket.userId!,
          content,
          delivered: true,
        });

        const messageWithDetails = await Message.findByPk(message.id, {
          include: [{ model: User, attributes: ['id', 'username'] }]
        });

        // Send message to room
        socket.to(`room_${roomId}`).emit('receive_message', messageWithDetails);
      } catch (error) {
        socket.emit('error', { message: 'Failed to send message' });
      }
    });

    // Typing
    socket.on('typing', (data: { roomId: number, isTyping: boolean }) => {
      socket.to(`room_${data.roomId}`).emit('user_typing', {
        userId: socket.userId,
        username: socket.user?.username,
        isTyping: data.isTyping
      });
    });

    // Status
    socket.on('user_status', async (status: 'online' | 'offline') => {
      try {
        const lastSeen = new Date();
        await User.update(
          { online: status === 'online', lastSeen },
          { where: { id: socket.userId } }
        );

        const rooms = await RoomMember.findAll({
          where: { userId: socket.userId }
        });

        rooms.forEach((roomMember) => {
          socket.to(`room_${roomMember.roomId}`).emit('user_status', {
            userId: socket.userId,
            username: socket.user?.username,
            status,
            lastSeen,
          });
        });
      } catch (error) {
        console.error('Error updating user status:', error);
      }
    });

    // disconnection
    socket.on('disconnect', async () => {
      console.log(`User ${socket.userId} disconnected`);

      const lastSeen = new Date();

      // Update user status
      await User.update(
        { online: false, lastSeen },
        { where: { id: socket.userId } }
      );

      const rooms = await RoomMember.findAll({
        where: { userId: socket.userId }
      });

      rooms.forEach((roomMember) => {
        socket.to(`room_${roomMember.roomId}`).emit('user_status_change', {
          userId: socket.userId,
          username: socket.user?.username,
          status: 'offline',
          lastSeen
        });
      });
    });
  });
}
  