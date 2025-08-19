import { DataTypes, Model } from 'sequelize';

import { sequelize } from './sequelize';

interface RoomAttributes {
  id: number;
  name: string;
  description: string;
  isPublic: boolean;
  createdBy: number;
  inviteCode?: string;
}

export class Room extends Model<RoomAttributes> implements RoomAttributes {
  public id!: number;
  public name!: string;
  public description!: string;
  public isPublic!: boolean;
  public createdBy!: number;
  public inviteCode?: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Room.init({
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.TEXT },
  isPublic: { type: DataTypes.BOOLEAN, defaultValue: true },
  createdBy: { type: DataTypes.INTEGER, allowNull: false },
  inviteCode: { type: DataTypes.STRING, unique: true }
}, { sequelize });
