import User from './user.js';
import Product from './product.js';
import Order from './order.js';
import OrderItem from './orderItem.js';
import sequelize from '../config/database.js';
User.hasMany(Product, { foreignKey: 'sellerId',onDelete:'CASCADE' });
Order.belongsTo(User);
Product.belongsTo(User, { foreignKey: 'sellerId' });

Order.belongsTo(User, { foreignKey: 'buyerId' });
User.hasMany(Order, { foreignKey: 'buyerId',onDelete:'CASCADE' });

Order.hasMany(OrderItem, { foreignKey: 'orderId' });
OrderItem.belongsTo(Order, { foreignKey: 'orderId' });

Product.hasMany(OrderItem, { foreignKey: 'productId' });
OrderItem.belongsTo(Product, { foreignKey: 'productId' });

export default {
  sequelize,
  User,
  Product,
  Order,
  OrderItem
};
