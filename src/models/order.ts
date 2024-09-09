import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database.js';

interface OrderAttributes {
  id?: number;
  buyerId: number;
  totalAmount: number;
  status: 'Pending' | 'Shipped' | 'Delivered' | 'Cancelled';
}

class Order extends Model<OrderAttributes> implements OrderAttributes {
  public id!: number;
  public buyerId!: number;
  public totalAmount!: number;
  public status!: 'Pending' | 'Shipped' | 'Delivered' | 'Cancelled';

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Order.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  buyerId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id',
    }
  },
  totalAmount: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM('Pending', 'Shipped', 'Delivered', 'Cancelled'),
    allowNull: false,
  },
}, {
  sequelize,
  modelName: 'Order',
});

export default Order;
