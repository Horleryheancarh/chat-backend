import { DataTypes, Model, Optional } from 'sequelize';

import { sequelize } from './sequelize';

interface RoomMemberAttributes {
  id: number;
  userId: number;
  roomId: number;
  joinedAt: Date;
}

interface RoomMemberCreationAttributes extends Optional<RoomMemberAttributes, 'id' | 'joinedAt'> {}

export class RoomMember extends Model<RoomMemberAttributes, RoomMemberCreationAttributes> implements RoomMemberAttributes {
  declare id: number;
  declare userId: number;
  declare roomId: number;
  declare joinedAt: Date;

  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

RoomMember.init({
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  userId: { type: DataTypes.INTEGER, allowNull: false },
  roomId: { type: DataTypes.INTEGER, allowNull: false },
  joinedAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, { sequelize });
