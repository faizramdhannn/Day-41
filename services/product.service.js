const { Product, ProductMedia } = require('../models');
const { Op } = require('sequelize');

class ProductService {
  async getAllProducts(filters = {}) {
    const { page = 1, limit = 10, search, category, brand, min_price, max_price } = filters;
    const offset = (page - 1) * limit;
    
    const where = {};
    
    // Filter search
    if (search) {
      where.name = { [Op.iLike]: `%${search}%` };
    }
    
    if (category) {
      where.category = { [Op.iLike]: `%${category}%` };
    }
    
    if (brand) {
      where.brand = { [Op.iLike]: `%${brand}%` };
    }
    
    // Filter price range
    if (min_price || max_price) {
      where.price = {};
      if (min_price) where.price[Op.gte] = min_price;
      if (max_price) where.price[Op.lte] = max_price;
    }
    
    const { count, rows } = await Product.findAndCountAll({
      where,
      include: [
        { model: ProductMedia, as: 'media' }
      ],
      limit,
      offset,
      order: [['created_at', 'DESC']]
    });
    
    return {
      products: rows,
      total: count,
      page: parseInt(page),
      limit: parseInt(limit)
    };
  }

  async getProductById(productId) {
    const product = await Product.findByPk(productId, {
      include: [
        { model: ProductMedia, as: 'media' }
      ]
    });
    
    if (!product) {
      throw new Error('Product not found');
    }
    
    return product;
  }

  async createProduct(productData) {
    const product = await Product.create(productData);
    return await this.getProductById(product.id);
  }

  async updateProduct(productId, productData) {
    const product = await Product.findByPk(productId);
    
    if (!product) {
      throw new Error('Product not found');
    }
    
    await product.update(productData);
    return await this.getProductById(productId);
  }

  async deleteProduct(productId) {
    const product = await Product.findByPk(productId);
    
    if (!product) {
      throw new Error('Product not found');
    }
    
    await product.destroy();
    return true;
  }
  
}

module.exports = new ProductService();