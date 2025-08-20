import { DataTypes, Model, Optional } from 'sequelize';

import { sequelize } from './sequelize';

interface RoomAttributes {
  id: number;
  name: string;
  description: string;
  isPublic: boolean;
  createdBy: number;
  inviteCode?: string;
}

interface RoomCreationAttributes extends Optional<RoomAttributes, 'id'> {}

export class Room extends Model<RoomAttributes, RoomCreationAttributes> implements RoomAttributes {
  declare id: number;
  declare name: string;
  declare description: string;
  declare isPublic: boolean;
  declare createdBy: number;
  declare inviteCode?: string;

  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

Room.init({
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.TEXT },
  isPublic: { type: DataTypes.BOOLEAN, defaultValue: true },
  createdBy: { type: DataTypes.INTEGER, allowNull: false },
  inviteCode: { type: DataTypes.STRING, unique: true }
}, { sequelize });
