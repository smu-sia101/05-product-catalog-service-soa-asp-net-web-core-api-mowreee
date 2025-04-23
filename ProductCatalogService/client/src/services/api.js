import axios from 'axios';

// Configuration - use environment variable if available, fallback to default
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for logging
api.interceptors.request.use(request => {
  if (import.meta.env.DEV) {
    console.log('Starting API Request:', {
      url: request.url,
      method: request.method,
      data: request.data,
      headers: request.headers
    });
  }
  return request;
});

// Add response interceptor for logging
api.interceptors.response.use(
  response => {
    if (import.meta.env.DEV) {
      console.log('API Response:', {
        url: response.config.url,
        status: response.status,
        data: response.data
      });
    }
    return response;
  },
  error => {
    console.error('API Error:', {
      url: error.config?.url,
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    });
    return Promise.reject(error);
  }
);

// Format product data for API
const formatProductData = (data) => {
  return {
    name: data.name,
    description: data.description,
    price: parseFloat(data.price),
    category: data.category,
    stock: parseInt(data.stock) || 0,
    imageUrl: data.imageUrl || ''
  };
};

// Check if ID is valid
const isValidId = (id) => {
  if (id === undefined || id === null) return false;
  
  // Convert to string to handle numeric IDs
  const idStr = String(id);
  
  // Check if ID is empty, 'undefined', or 'null'
  return idStr !== '' && 
         idStr !== 'undefined' && 
         idStr !== 'null';
};

// Products API
export const getProducts = async () => {
  try {
    const response = await api.get('/products');
    return response.data;
  } catch (error) {
    console.error('Failed to fetch products:', error);
    throw error;
  }
};

export const getProductById = async (id) => {
  try {
    if (!isValidId(id)) {
      throw new Error(`Invalid ID: ${id}`);
    }
    const response = await api.get(`/products/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Failed to fetch product with ID ${id}:`, error);
    throw error;
  }
};

export const createProduct = async (productData) => {
  try {
    const formattedData = formatProductData(productData);
    const response = await api.post('/products', formattedData);
    return response.data;
  } catch (error) {
    console.error('Failed to create product:', error);
    console.error('Error details:', error.response?.data);
    throw error;
  }
};

export const updateProduct = async (id, productData) => {
  try {
    if (!isValidId(id)) {
      throw new Error(`Invalid ID for update: ${id}`);
    }
    const formattedData = formatProductData(productData);
    const response = await api.put(`/products/${id}`, formattedData);
    return response.data;
  } catch (error) {
    console.error(`Failed to update product with ID ${id}:`, error);
    console.error('Error details:', error.response?.data);
    throw error;
  }
};

export const deleteProduct = async (id) => {
  try {
    if (!isValidId(id)) {
      throw new Error(`Invalid ID for deletion: ${id}`);
    }
    const response = await api.delete(`/products/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Failed to delete product with ID ${id}:`, error);
    console.error('Error details:', error.response?.data);
    throw error;
  }
}; 