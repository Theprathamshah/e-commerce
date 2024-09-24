import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database.js';

interface ProductAttributes {
    id: number;
    name: string;
    description: string;
    price: number;
    stock: number;
    discount: number; // Discount percentage
    images: string[]; // Array of image URLs stored in S3
    sellerId: number;
    createdAt?: Date;
    updatedAt?: Date;
}

interface ProductCreationAttributes extends Optional<ProductAttributes, 'id'> {}

class Product extends Model {
    public id!: number;
    public name!: string;
    public description!: string;
    public price!: number;
    public stock!: number;
    public discount!: number; // Discount percentage
    public images!: string[]; // Array of image URLs stored in S3
    public sellerId!: number;
    public createdAt!: Date;
    public updatedAt!: Date;
}


Product.init(
    {
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
            defaultValue: 0, // Default discount is 0%
        },
        images: {
            type: DataTypes.ARRAY(DataTypes.STRING), // Storing array of image URLs
            allowNull: true,
        },
        sellerId:{
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false
        }
    },
    {
        sequelize,
        tableName: 'products',
        timestamps: true,
    }
);

export default Product;
