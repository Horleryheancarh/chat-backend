import { DataTypes, Model } from 'sequelize';

import { sequelize } from './sequelize';

interface MessageAttributes {
  id: number;
  content: string;
  userId: number;
  roomId: number;
  delivered: boolean;
  read: boolean;
}

export class Message extends Model<MessageAttributes> implements MessageAttributes {
  public id!: number;
  public content!: string;
  public userId!: number;
  public roomId!: number;
  public delivered!: boolean;
  public read!: boolean;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Message.init({
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  content: { type: DataTypes.TEXT, allowNull: false },
  userId: { type: DataTypes.INTEGER, allowNull: false },
  roomId: { type: DataTypes.INTEGER, allowNull: false },
  delivered: { type: DataTypes.BOOLEAN, defaultValue: false },
  read: { type: DataTypes.BOOLEAN, defaultValue: false }
}, { sequelize });
