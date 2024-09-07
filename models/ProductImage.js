const { Model, DataTypes } = require('sequelize');

class ProductImage extends Model {
  static associate(models) {
    this.belongsTo(models.Product, { foreignKey: 'product_id' });
  }
}

module.exports = (sequelize) => {
  ProductImage.init({
    image_url: {
      type: DataTypes.STRING,
      allowNull: false
    },
    product_id: {
      type: DataTypes.INTEGER,
      references: { model: 'Products', key: 'id' },
      onDelete: 'CASCADE'
    }
  }, {
    sequelize,
    modelName: 'ProductImage',
  });
  return ProductImage;
};
