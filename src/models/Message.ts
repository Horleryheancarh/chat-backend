import { DataTypes, Model } from 'sequelize';

import { sequelize } from './sequelize';

interface MessageAttributes {
  id: number;
  content: string;
  userId: number;
  roomId: number;
  delivered: boolean;
  read: boolean;
  createdAt: Date;
}

interface MessageCreationAttributes extends Omit<MessageAttributes, 'id' | 'read' | 'createdAt'> {}

export class Message extends Model<MessageAttributes, MessageCreationAttributes> implements MessageAttributes {
  declare id: number;
  declare content: string;
  declare userId: number;
  declare roomId: number;
  declare delivered: boolean;
  declare read: boolean;

  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

Message.init({
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  content: { type: DataTypes.TEXT, allowNull: false },
  userId: { type: DataTypes.INTEGER, allowNull: false },
  roomId: { type: DataTypes.INTEGER, allowNull: false },
  delivered: { type: DataTypes.BOOLEAN, defaultValue: false },
  read: { type: DataTypes.BOOLEAN, defaultValue: false },
  createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, { sequelize });
