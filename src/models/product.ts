import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

interface ProductAttributes {
    id: number;
    name: string;
    description: string;
    price: number;
    stock: number;
    discount: number;
    images: string[];
    sellerId: number;
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date;
}

type ProductCreationAttributes = Optional<ProductAttributes, 'id'>;

export class Product extends Model<ProductAttributes, ProductCreationAttributes> {
  public id!: number;
  public name!: string;
  public description!: string;
  public price!: number;
  public stock!: number;
  public discount!: number;
  public images!: string[];
  public sellerId!: number;
  public createdAt!: Date;
  public updatedAt!: Date;
  public deletedAt? : Date;
}

Product.init({
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING(1000),
    allowNull: false,
  },
  price: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  stock: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
  },
  discount: {
    type: DataTypes.FLOAT,
    defaultValue: 0,
  },
  images: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    allowNull: true,
  },
  sellerId: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
  },
  deletedAt: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  sequelize,
  tableName: 'Products',
  timestamps: true,
  paranoid: true,
});

export default Product;
