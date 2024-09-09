import User from './user.js'; // Use .js for compiled files
import Product from './product.js'; // Use .js for compiled files
import Order from './order.js'; // Use .js for compiled files
import OrderItem from './orderItem.js'; // Use .js for compiled files
import sequelize from '../config/database.js'; // Use .js for compiled files

// Define relationships
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
