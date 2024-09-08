import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database.js';

interface UserAttributes {
  id?: number;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
  birthday: Date;
  role: 'Buyer' | 'Seller' | 'Admin';
}

class User extends Model<UserAttributes> implements UserAttributes {
  public id!: number;
  public firstName!: string;
  public lastName!: string;
  public username!: string;
  public email!: string;
  public password!: string;
  public birthday!: Date;
  public role!: 'Buyer' | 'Seller' | 'Admin';

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

User.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  firstName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  birthday: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  role: {
    type: DataTypes.ENUM('Buyer', 'Seller', 'Admin'),
    allowNull: false,
  },
}, {
  sequelize,
  modelName: 'User',
  tableName: 'Users'
});

export default User;
