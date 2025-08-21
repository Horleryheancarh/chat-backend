import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth';
import { Message, Room, RoomMember, User } from '../models';

export const createRoom = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { name, description, isPublic } = req.body;
    const userId = req.user!.id;

    if (!name) {
      return res.status(400).json({ error: 'Room name is required' });
    }

    const inviteCode = generateInviteCode();
    const room = await Room.create({
      name,
      description,
      isPublic,
      createdBy: userId,
      inviteCode
    });

    // Auto-join the creator to the room
    await RoomMember.create({ userId, roomId: room.id });

    res.status(201).json({
      message: 'Room created successfully',
      room: {
        id: room.id,
        name: room.name,
        description: room.description,
        isPublic: room.isPublic,
        inviteCode: room.inviteCode
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const joinRoom = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { roomId, inviteCode } = req.body;
    const userId = req.user!.id;

    const room = await Room.findByPk(roomId);
    if (!room) {
      return res.status(404).json({ error: 'Room not found' });
    }

    if (!room.isPublic && room.inviteCode !== inviteCode) {
      return res.status(403).json({ error: 'Invalid invite code' });
    }

    const existingMember = await RoomMember.findOne({
      where: { userId, roomId }
    });

    if (existingMember) {
      return res.status(400).json({ error: 'Already a member of this room' });
    }

    await RoomMember.create({ userId, roomId });

    res.json({ message: 'Joined room successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getUserRooms = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user!.id;

    const rooms = await RoomMember.findAll({
      where: { userId },
      include: [{
        model: Room,
        attributes: ['id', 'name', 'description', 'isPublic']
      }]
    });

    res.json({ rooms });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getRoomMessages = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { roomId } = req.params;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 50;
    const offset = (page - 1) * limit;

    // Check if user is member of the room
    const isMember = await RoomMember.findOne({
      where: { userId: req.user!.id, roomId }
    });

    if (!isMember) {
      return res.status(403).json({ error: 'Not a member of this room' });
    }

    const messages = await Message.findAll({
      where: { roomId },
      include: [{
        model: User,
        attributes: ['id', 'username']
      }],
      order: [['createdAt', 'DESC']],
      limit,
      offset
    });

    res.json({ messages: messages.reverse() });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

function generateInviteCode(): string {
  return Math.random().toString(36).substring(2, 10).toUpperCase();
}
