import { DataTypes, Model } from 'sequelize';

import { sequelize } from './sequelize';

interface RoomMemberAttributes {
  id: number;
  userId: number;
  roomId: number;
  joinedAt: Date;
}

export class RoomMember extends Model<RoomMemberAttributes> implements RoomMemberAttributes {
  public id!: number;
  public userId!: number;
  public roomId!: number;
  public joinedAt!: Date;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

RoomMember.init({
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  userId: { type: DataTypes.INTEGER, allowNull: false },
  roomId: { type: DataTypes.INTEGER, allowNull: false },
  joinedAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, { sequelize });
