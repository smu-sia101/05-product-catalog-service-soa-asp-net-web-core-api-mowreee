import Product from '../models/productModel.js';

// @desc    Get all products
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res) => {
  try {
    const products = await Product.find({});
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a product
// @route   POST /api/products
// @access  Public
const createProduct = async (req, res) => {
  try {
    const { name, price, description, category, stock, imageUrl } = req.body;
    
    const product = new Product({
      name,
      price,
      description,
      category,
      stock,
      imageUrl,
    });
    
    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Public
const updateProduct = async (req, res) => {
  try {
    const { name, price, description, category, stock, imageUrl } = req.body;
    
    const product = await Product.findById(req.params.id);
    
    if (product) {
      product.name = name || product.name;
      product.price = price || product.price;
      product.description = description || product.description;
      product.category = category || product.category;
      product.stock = stock || product.stock;
      product.imageUrl = imageUrl || product.imageUrl;
      
      const updatedProduct = await product.save();
      res.json(updatedProduct);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Public
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (product) {
      await Product.deleteOne({ _id: product._id });
      res.json({ message: 'Product removed' });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export { getProducts, getProductById, createProduct, updateProduct, deleteProduct }; 