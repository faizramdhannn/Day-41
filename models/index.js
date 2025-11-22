const sequelize = require('../db');

// ✅ Import 6 model inti
const User = require('./User');
const UserAddress = require('./UserAddress');
const Product = require('./Product');
const ProductMedia = require('./ProductMedia');
const Order = require('./Order');
const OrderItem = require('./OrderItem');

// ✅ Import relasi tambahan (one-to-one)
const Payment = require('./Payment');
const Shipment = require('./Shipment');


// ========== RELASI ==========

// User 1 --- n UserAddress
User.hasMany(UserAddress, { foreignKey: 'user_id', as: 'addresses' });
UserAddress.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

// User 1 --- n Order
User.hasMany(Order, { foreignKey: 'user_id', as: 'orders' });
Order.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

// Product 1 --- n ProductMedia
Product.hasMany(ProductMedia, { foreignKey: 'product_id', as: 'media' });
ProductMedia.belongsTo(Product, { foreignKey: 'product_id', as: 'product' });

// Order 1 --- n OrderItem
Order.hasMany(OrderItem, { foreignKey: 'order_id', as: 'items' });
OrderItem.belongsTo(Order, { foreignKey: 'order_id', as: 'order' });

// Product 1 --- n OrderItem (Many-to-Many via OrderItem)
Product.hasMany(OrderItem, { foreignKey: 'product_id', as: 'orderItems' });
OrderItem.belongsTo(Product, { foreignKey: 'product_id', as: 'product' });

// Order 1 --- 1 Payment
Order.hasOne(Payment, { foreignKey: 'order_id', as: 'payment' });
Payment.belongsTo(Order, { foreignKey: 'order_id', as: 'order' });

// Order 1 --- 1 Shipment
Order.hasOne(Shipment, { foreignKey: 'order_id', as: 'shipment' });
Shipment.belongsTo(Order, { foreignKey: 'order_id', as: 'order' });

module.exports = {
  sequelize,
  User,
  UserAddress,
  Product,
  ProductMedia,
  Order,
  OrderItem,
  Payment,
  Shipment
};