
import Product from '../models/product';
import { Request,Response, NextFunction } from 'express';

const authorizeSeller = async(req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const userId = req.user.id;
  const userRole = req.user.role;

  try {
    const product = await Product.findByPk(id);

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Check if the user is the product's seller or has admin rights
    if (userRole === 'admin' || product.sellerId === userId) {
      next(); // User is authorized
    } else {
      return res.status(403).json({ error: 'You are not authorized to edit or delete this product' });
    }
  } catch (error) {
    console.error('Error authorizing seller:', error);
    return res.status(500).json({ error: 'Failed to authorize' });
  }
};

export default authorizeSeller;