import { Request, Response, Router } from 'express';
import Cart from '../models/Cart';
import Product from '../models/product';

const router = Router();
const MAX_CART_ITEMS = 30;

router.post('/', async(req: Request, res: Response) => {
  const userId = req.user.id;
  const { productId, quantity } = req.body;

  const product = await Product.findByPk(productId);
  if (!product) {
    return res.status(404).json({ message: 'Product not found' });
  }

  const currentCartItems = await Cart.count({ where: { userId } });
  if (currentCartItems >= MAX_CART_ITEMS) {
    return res.status(400).json({ message: `Cannot add more than ${MAX_CART_ITEMS} items to the cart` });
  }

  const existingCartItem = await Cart.findOne({ where: { userId, productId } });
  if (existingCartItem) {
    existingCartItem.quantity += quantity;
    await existingCartItem.save();
    return res.status(200).json(existingCartItem);
  } else {
    const cartItem = await Cart.create({ userId, productId, quantity });
    return res.status(201).json(cartItem);
  }
});

router.get('/', async(req: Request, res: Response) => {
  const userId = req.user.id;
  const cartItems = await Cart.findAll({
    where: { userId },
    include: [{ model: Product }],
  });
  return res.status(200).json(cartItems);
});

router.put('/', async(req: Request, res: Response) => {
  const userId = req.user.id;
  const { productId, quantity } = req.body;

  const cartItem = await Cart.findOne({ where: { userId, productId } });
  if (!cartItem) {
    return res.status(404).json({ message: 'Cart item not found' });
  }

  cartItem.quantity = quantity;
  await cartItem.save();
  return res.status(200).json(cartItem);
});

router.delete('/', async(req: Request, res: Response) => {
  const userId = req.user.id;
  const { productId } = req.body;

  const deletedItem = await Cart.destroy({ where: { userId, productId } });
  if (!deletedItem) {
    return res.status(404).json({ message: 'Cart item not found' });
  }

  return res.status(204).send();
});

router.delete('/cart/clear', async(req: Request, res: Response) => {
  const userId = req.user.id;
  await Cart.destroy({ where: { userId } });
  return res.status(204).send();
});

export default router;
