import express, { Request, Response, NextFunction } from 'express';
import Product from '../models/product';
import { deleteImageFromS3, uploadToS3 } from '../utils/s3Utils';
import multer from 'multer';
import { authenticateUser } from '../middlewares/authenticateUser';
import authorizeSeller from '../middlewares/authorizeSeller';
import { body, validationResult } from 'express-validator';
import { Op } from 'sequelize';
import sequelize from 'sequelize';
import dotenv from 'dotenv';
import { NotFoundError, ValidationError } from '../errors/CustomError'

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
  async(req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new ValidationError('Invalid input data');
    }

    const { name, description, price, discount, stock } = req.body;
    const files = req.files as Express.Multer.File[];

    try {
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
      next(error);
    }
  }
);

router.get('/search', async(req: Request, res: Response, next: NextFunction) => {
  try {
    const searchQuery = req.query.q as string;

    if (!searchQuery) {
      throw new ValidationError('Search query is required');
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
      throw new NotFoundError('No products found');
    }

    res.json(products);
  } catch (error) {
    next(error);
  }
});

router.get('/seller-count', async(req: Request, res: Response, next: NextFunction) => {
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
    next(error);
  }
});

router.get('/', async(req: Request, res: Response, next: NextFunction) => {
  try {
    const products = await Product.findAll();
    const newProducts: any[] = products.map((product) => ({
      ...product.toJSON(),
      images: product.images.map((imageKey: string) => (
        `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${imageKey}`
      )),
    }));

    res.status(200).json(newProducts);
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async(req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;

  try {
    const product = await Product.findByPk(id);

    if (!product) {
      throw new NotFoundError('Product not found');
    }

    const productWithImageUrls = {
      ...product.toJSON(),
      images: product.images.map((imageKey: string) => (
        `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${imageKey}`
      )),
    };

    res.status(200).json(productWithImageUrls);
  } catch (error) {
    next(error);
  }
});

router.put(
  '/:id',
  authenticateUser,
  authorizeSeller,
  async(req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const { name, description, price, discount, stock, images } = req.body;

    try {
      const product = await Product.findByPk(id);

      if (!product) {
        throw new NotFoundError('Product not found');
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
      next(error);
    }
  }
);

router.delete(
  '/:id',
  authenticateUser,
  authorizeSeller,
  async(req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    try {
      const product = await Product.findByPk(id);

      if (!product) {
        throw new NotFoundError('Product not found');
      }

      await Promise.all(product.images.map((image: string) => deleteImageFromS3(image)));
      await product.destroy();
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
);

export default router;
