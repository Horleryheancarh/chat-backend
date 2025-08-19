import { Message } from "./Message";
import { Room } from "./Room";
import { RoomMember } from "./RoomMember";
import { sequelize } from "./sequelize";
import { User } from "./User";

// Associations
User.hasMany(Room, { foreignKey: 'createdBy' });
Room.belongsTo(User, { foreignKey: 'createdBy' });

User.belongsToMany(Room, { through: RoomMember, foreignKey: 'userId' });
Room.belongsToMany(User, { through: RoomMember, foreignKey: 'roomId' });

User.hasMany(Message, { foreignKey: 'userId' });
Message.belongsTo(User, { foreignKey: 'userId' });

Room.hasMany(Message, { foreignKey: 'roomId' });
Message.belongsTo(Room, { foreignKey: 'roomId' });

export {
  sequelize,
  User,
  Room,
  RoomMember,
  Message
};