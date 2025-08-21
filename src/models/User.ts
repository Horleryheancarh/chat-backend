import { DataTypes, Model, Optional } from 'sequelize';
import * as bcrypt from 'bcrypt';
import { sequelize } from './sequelize';

// User Model
interface UserAttributes {
  id: number;
  username: string;
  email: string;
  password: string;
  online: boolean;
  lastSeen: Date;
}

interface UserCreationAttributes extends Optional<UserAttributes, 'id' | 'online' | 'lastSeen'> {}

export class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  declare id: number;
  declare username: string;
  declare email: string;
  declare password: string;
  declare online: boolean;
  declare lastSeen: Date;
  
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;

  public async validatePassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
  }
}

User.init({
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  username: { type: DataTypes.STRING, unique: true, allowNull: false },
  email: { type: DataTypes.STRING, unique: true, allowNull: false },
  password: { type: DataTypes.STRING, allowNull: false },
  online: { type: DataTypes.BOOLEAN, defaultValue: false },
  lastSeen: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, {
  sequelize,
  hooks: {
    beforeCreate: async (user: User) => {
      user.password = await bcrypt.hash(user.password, 12);
    }
  }
});
