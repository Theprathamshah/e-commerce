import express, { Request, Response } from 'express';
import Product from '../models/product.js';
import { deleteImageFromS3, uploadToS3 } from '../utils/s3Utils.js';
import multer from 'multer';
import { authenticateUser } from '../middlewares/authenticateUser.js';
import authorizeSeller from '../middlewares/authorizeSeller.js';
import { body, validationResult } from 'express-validator';
import { Op } from 'sequelize';
import sequelize from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();
const router = express.Router();
const upload = multer();

async function uploadImages(files: Express.Multer.File[]): Promise<string[]> {
  return await Promise.all(
    files.map(async(file: Express.Multer.File) => {
      const fileBuffer = file.buffer;
      const fileName = file.originalname;
      const fileType = file.mimetype;
      return uploadToS3(fileBuffer, fileName, fileType);
    })
  );
}

router.post(
  '/',
  authenticateUser,
  upload.array('images'),
  [
    body('name').notEmpty().withMessage('Product name is required'),
    body('description').notEmpty().withMessage('Product description is required'),
    body('price').isFloat({ gt: 0 }).withMessage('Price must be a positive number'),
  ],
  async(req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { name, description, price, discount, stock } = req.body;
    const files = req.files as Express.Multer.File[];
    try {
      console.log(req.user);
      const sellerId = req.user?.id;
      const imageUrls = await uploadImages(files);
      const newProduct = await Product.create({
        name,
        description,
        price,
        discount,
        stock,
        images: imageUrls,
        sellerId,
      });
      res.status(201).json(newProduct);
    } catch (error) {
      console.error('Error creating product:', error);
      res.status(500).json({ error: 'Failed to create product' });
    }
  }
);

router.get('/search', async(req: Request, res: Response) => {
  try {
    console.log('Request query:', req.query);
    console.log('Query parameter "q":', req.query.q);
    const searchQuery = req.query.q as string

    if (!searchQuery) {
      return res.status(400).json({ message: 'Search query is required' });
    }

    const products = await Product.findAll({
      where: {
        [Op.or]: [
          { name: { [Op.iLike]: `%${searchQuery}%` } },
          { description: { [Op.iLike]: `%${searchQuery}%` } }
        ]
      }
    });

    if (!products.length) {
      return res.status(404).json({ message: 'No products found' });
    }

    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Error fetching products', error });
  }

});

router.get('/seller-count', async(req: Request, res: Response) => {
  try {
    const productCounts = await Product.findAll({
      attributes: [
        'sellerId',
        [sequelize.fn('COUNT', sequelize.col('id')), 'productCount']
      ],
      group: 'sellerId',
      order: [[sequelize.fn('COUNT', sequelize.col('id')), 'DESC']]
    });

    res.status(200).json(productCounts);
  } catch (error) {
    console.error('Error fetching product counts by seller:', error);
    res.status(500).json({ error: 'Failed to fetch product counts by seller' });
  }
});

router.get('/', async(req: Request, res: Response) => {
  try {
    const products = await Product.findAll();
    const newProducts: any[] = [];
    products.map((product)=>{
      const imageUrls = product.images.map((imageKey: string) => {
        return `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${imageKey}`;
      });
      const productWithImageUrls = {
        ...product.toJSON(),
        images: imageUrls,
      };
      newProducts.push(productWithImageUrls);
    })
    res.status(200).json(newProducts);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

router.get('/:id', async(req: Request, res: Response) => {
  const { id } = req.params;
  console.log('get product by id called');

  try {
    const product = await Product.findByPk(id);

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    const imageUrls = product.images.map((imageKey: string) => {
      return `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${imageKey}`;
    });

    const productWithImageUrls = {
      ...product.toJSON(),
      images: imageUrls,
    };

    res.status(200).json(productWithImageUrls);
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ error: 'Failed to fetch product' });
  }
});

router.put(
  '/:id',
  authenticateUser,
  authorizeSeller,
  async(req: Request, res: Response) => {
    const { id } = req.params;
    const { name, description, price, discount, stock, images } = req.body;

    try {
      const product = await Product.findByPk(id);

      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }

      if (images) {
        await Promise.all(product.images.map((image: string) => deleteImageFromS3(image)));
        product.images = await uploadImages(images);
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
  }
);

router.delete(
  '/:id',
  authenticateUser,
  authorizeSeller,
  async(req: Request, res: Response) => {
    const { id } = req.params;

    try {
      const product = await Product.findByPk(id);

      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }

      await Promise.all(product.images.map((image: string) => deleteImageFromS3(image)));

      await product.destroy();
      res.status(204).send();
    } catch (error) {
      console.error('Error deleting product:', error);
      res.status(500).json({ error: 'Failed to delete product' });
    }
  }
);

export default router;
