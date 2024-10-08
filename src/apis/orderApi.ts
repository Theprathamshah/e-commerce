import express, { NextFunction, Request, Response } from 'express';
import Order from '../models/order';
import OrderItem from '../models/orderItem';
import Product from '../models/product';
import sequelize from 'sequelize';
import { NotFoundError, ValidationError } from '../errors/CustomError';
import User from '../models/user';

const router = express.Router();

router.post('/', async(req: Request, res: Response, next: NextFunction) => {
  try {
    const { buyerId, totalAmount, status, items } = req.body;

    if (!buyerId || !totalAmount || !items || !items.length) {
      throw new ValidationError('Please send all required fields, including items');
    }

    const newOrder = await Order.create({
      buyerId,
      totalAmount,
      status
    });

    const orderItems = await Promise.all(
      items.map((item:any) => {
        return OrderItem.create({
          orderId: newOrder.id,
          productId: item.productId,
          quantity: item.quantity,
          price: item.price
        });
      })
    );

    res.status(201).json({ newOrder, orderItems });
  } catch (error) {
    console.error('Error creating order:', error);
    next(error);
  }
});

router.get('/', async(req: Request, res: Response) => {
  try {
    const orders = await Order.findAll({
      include: [
        {
          model: User,
          attributes: ['id', 'firstName', 'lastName', 'email'],
        },
        {
          model: OrderItem,
          include: [{ model: Product, attributes: ['id', 'name', 'price'] }],
        },
      ],
    });

    return res.status(200).json(orders);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'An error occurred while fetching orders.' });
  }
});

router.get('/:id', async(req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;

  try {
    const order = await Order.findByPk(id, {
      include: [
        {
          model: User,
          attributes: ['id', 'firstName', 'lastName', 'email'],
        },
        {
          model: OrderItem,
          include: [{ model: Product, attributes: ['id', 'name', 'price'] }]
        }
      ]
    });

    if (!order) {
      throw new NotFoundError(`Order with id ${id} not found`);
    }

    res.status(200).json(order);
  } catch (error) {
    console.error('Error fetching order:', error);
    next(error);
  }
});

router.put('/:id', async(req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const { totalAmount, status } = req.body;

  try {
    const order = await Order.findByPk(id);

    if (!order) {
      throw new NotFoundError(`Order with id ${id} not found!`);
    }

    if (totalAmount !== undefined) {
      order.totalAmount = totalAmount;
    }

    if (status) {
      order.status = status;
    }

    await order.save();
    res.status(200).json(order);
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', async(req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;

  try {
    const order = await Order.findByPk(id);

    if (!order) {
      throw new NotFoundError(`Order with id ${id} not found!`);
    }

    await order.destroy();
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting order:', error);
    next(error);
  }
});

router.post('/order-items', async(req: Request, res: Response, next: NextFunction) => {
  try {
    const { orderId, productId, quantity, price } = req.body;
    if (!orderId || !productId || !quantity || !price) {
      throw new ValidationError('Please enter all required details');
    }
    const newOrderItem = await OrderItem.create({
      orderId,
      productId,
      quantity,
      price
    });

    res.status(201).json(newOrderItem);
  } catch (error) {
    console.error('Error adding order item:', error);
    next(error);
  }
});

router.get('/:id/items', async(req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    if (!id) {
      throw new ValidationError(`Please enter the id`);
    }
    const orderItems = await OrderItem.findAll({
      where: { orderId: id },
      include: [{ model: Product, attributes: ['id', 'name', 'price'] }]
    });

    if (!orderItems.length) {
      throw new NotFoundError('No items found for this order');
    }

    res.status(200).json(orderItems);
  } catch (error) {
    console.error('Error fetching order items:', error);
    next(error);
  }
});

router.put('/order-items/:id', async(req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const { quantity, price } = req.body;

  try {
    const orderItem = await OrderItem.findByPk(id);

    if (!orderItem) {
      throw new NotFoundError('Order item not found');
    }

    if (quantity !== undefined) {
      orderItem.quantity = quantity;
    }

    if (price !== undefined) {
      orderItem.price = price;
    }

    await orderItem.save();
    res.status(200).json(orderItem);
  } catch (error) {
    console.error('Error updating order item:', error);
    next(error);
  }
});

router.delete('/order-items/:id', async(req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;

  try {
    const orderItem = await OrderItem.findByPk(id);

    if (!orderItem) {
      throw new NotFoundError('Order item not found');
    }

    await orderItem.destroy();
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting order item:', error);
    next(error);
  }
});

router.get('/products-per-seller', async(req: Request, res: Response) => {
  try {
    const productsPerSeller = await Product.findAll({
      attributes: [
        'sellerId',
        [sequelize.fn('COUNT', sequelize.col('id')), 'productCount']
      ],
      group: 'sellerId'
    });

    res.status(200).json(productsPerSeller);
  } catch (error) {
    console.error('Error fetching products per seller:', error);
    res.status(500).json({ error: 'Failed to fetch products per seller' });
  }
});

export default router;
