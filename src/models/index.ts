import User from './user';
import Product from './product';
import Order from './order';
import OrderItem from './orderItem';
import sequelize from '../config/database';

User.hasMany(Product, { foreignKey: 'sellerId',onDelete:'CASCADE' });
Order.belongsTo(User);
Product.belongsTo(User, { foreignKey: 'sellerId' });

Product.hasMany(OrderItem, { foreignKey: 'productId' });
OrderItem.belongsTo(Product, { foreignKey: 'productId' });

Order.belongsTo(User, { foreignKey: 'buyerId' });
User.hasMany(Order, { foreignKey: 'buyerId',onDelete:'CASCADE' });

Order.hasMany(OrderItem, { foreignKey: 'orderId' });
OrderItem.belongsTo(Order, { foreignKey: 'orderId' });

export default {
  sequelize,
  User,
  Product,
  Order,
  OrderItem
};
