import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database.js';

interface ProductAttributes {
  id?: number;
  name: string;
  price: number;
  discount?: number;
  imageUrl: string;
  stock: number;
  sellerId: number;
}

class Product extends Model<ProductAttributes> implements ProductAttributes {
  public id!: number;
  public name!: string;
  public price!: number;
  public discount?: number;
  public imageUrl!: string;
  public stock!: number;
  public sellerId!: number;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Product.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  price: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  discount: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
  imageUrl: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  stock: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  sellerId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id',
    }
  },
}, {
  sequelize,
  modelName: 'Product',
});

export default Product;
