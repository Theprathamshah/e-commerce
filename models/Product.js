const { Model, DataTypes } = require('sequelize');

class Product extends Model {
  static associate(models) {
    this.belongsTo(models.User, { foreignKey: 'seller_id' });
    this.hasMany(models.ProductImage, { foreignKey: 'product_id' });
    this.hasMany(models.OrderItem, { foreignKey: 'product_id' });
  }
}

module.exports = (sequelize) => {
  Product.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    discount: DataTypes.FLOAT,
    stock: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    description: DataTypes.TEXT,
    is_deleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  }, {
    sequelize,
    modelName: 'Product',
  });
  return Product;
};
