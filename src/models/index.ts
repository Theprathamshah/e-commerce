import User from './user';
import Product from './product';
import Order from './order';
import OrderItem from './orderItem';
import sequelize from '../config/database';
import Cart from './Cart';

User.hasMany(Product, { foreignKey: 'sellerId',onDelete:'CASCADE' });
Order.belongsTo(User, { foreignKey: 'buyerId' });

Product.belongsTo(User, { foreignKey: 'sellerId' });

Product.hasMany(OrderItem, { foreignKey: 'productId' });
OrderItem.belongsTo(Product, { foreignKey: 'productId' });

Order.belongsTo(User, { foreignKey: 'buyerId' });
User.hasMany(Order, { foreignKey: 'buyerId',onDelete:'CASCADE' });

Order.hasMany(OrderItem, { foreignKey: 'orderId' });
OrderItem.belongsTo(Order, { foreignKey: 'orderId' });

Cart.belongsTo(User, { foreignKey:'userId' , onDelete:'CASCADE' });
Cart.belongsTo(Product, { foreignKey:'productId' });

export default {
  sequelize,
  User,
  Product,
  Order,
  OrderItem
};
