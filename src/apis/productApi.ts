import express, { Request, Response } from 'express';
import Product from '../models/product.js';
import { deleteImageFromS3, uploadToS3 } from '../utils/s3Utils.js';
import fs from 'fs';
import path from 'path';

const router = express.Router();

// Create a new product
router.post('/', async (req: Request, res: Response) => {
    const { name, description, price, discount, stock, images } = req.body;

    try {
        // Upload images to S3 and get URLs
        const imageUrls = await Promise.all(
            images.map((imagePath: string) => {
                const fileBuffer = fs.readFileSync(imagePath);
                const fileName = path.basename(imagePath);
                const fileType = 'image/jpeg'; // Adjust as needed

                return uploadToS3(fileBuffer, fileName, fileType);
            })
        );

        const newProduct = await Product.create({
            name,
            description,
            price,
            discount,
            stock,
            images: imageUrls,
        });

        res.status(201).json(newProduct);
    } catch (error) {
        console.error('Error creating product:', error);
        res.status(500).json({ error: 'Failed to create product' });
    }
});

// Get all products
router.get('/', async (req: Request, res: Response) => {
    try {
        const products = await Product.findAll();
        res.status(200).json(products);
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ error: 'Failed to fetch products' });
    }
});

// Get a product by ID
router.get('/:id', async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const product = await Product.findByPk(id);

        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        res.status(200).json(product);
    } catch (error) {
        console.error('Error fetching product:', error);
        res.status(500).json({ error: 'Failed to fetch product' });
    }
});

// Update a product by ID
router.put('/:id', async (req: Request, res: Response) => {
    const { id } = req.params;
    const { name, description, price, discount, stock, images } = req.body;

    try {
        const product = await Product.findByPk(id);

        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        if (images) {
            // Delete old images from S3
            await Promise.all(product.images.map((image: string) => deleteImageFromS3(image)));

            // Upload new images to S3 and get URLs
            const imageUrls = await Promise.all(
                images.map((imagePath: string) => {
                    const fileBuffer = fs.readFileSync(imagePath);
                    const fileName = path.basename(imagePath);
                    const fileType = 'image/jpeg'; // Adjust as needed

                    return uploadToS3(fileBuffer, fileName, fileType);
                })
            );
            product.images = imageUrls;
        }

        product.name = name || product.name;
        product.description = description || product.description;
        product.price = price || product.price;
        product.discount = discount || product.discount;
        product.stock = stock || product.stock;

        await product.save();

        res.status(200).json(product);
    } catch (error) {
        console.error('Error updating product:', error);
        res.status(500).json({ error: 'Failed to update product' });
    }
});

// Delete a product by ID
router.delete('/:id', async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const product = await Product.findByPk(id);

        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        // Delete images from S3
        await Promise.all(product.images.map((image: string) => deleteImageFromS3(image)));

        await product.destroy();

        res.status(204).send();
    } catch (error) {
        console.error('Error deleting product:', error);
        res.status(500).json({ error: 'Failed to delete product' });
    }
});

export default router;
