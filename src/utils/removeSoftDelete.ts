import { Op } from 'sequelize';
import Product from '../models/product';

export async function deleteSoftDelete() {
  const oneYearAgo = new Date();
  oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

  try {
    const deletedProducts = await Product.destroy({
      where: {
        deletedAt: {
          [Op.lte]: oneYearAgo,
        }
      },
      force: true,
    });

    console.log(`${deletedProducts} products permanently deleted`);
  } catch (error) {
    console.error('Error cleaning up soft-deleted products:', error);
  }
}
