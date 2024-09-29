import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';

interface CartAttributes {
  id?: number;
  userId: number;
  productId: number;
  quantity: number;
}

class Cart extends Model<CartAttributes> implements CartAttributes {
  public id!: number;
  public userId!: number;
  public productId!: number;
  public quantity!: number;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Cart.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id',
    },
  },
  productId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Products',
      key: 'id',
    },
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
  },
}, {
  sequelize,
  modelName: 'Cart',
});

export default Cart;
