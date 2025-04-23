import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Form, Input, InputNumber, Button, Select, message, Card, Spin } from 'antd';
import { getProductById, createProduct, updateProduct } from '../services/api';

const { TextArea } = Input;
const { Option } = Select;

const ProductForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [initializing, setInitializing] = useState(false);
  const [notFound, setNotFound] = useState(false);
  
  // Check if we're in edit mode - only if id exists and is not empty/undefined/'undefined'
  const isEditMode = id && id !== 'undefined' && id !== '';

  // Log the id parameter to help with debugging
  console.log('ProductForm params:', { id, isEditMode });

  // Categories for dropdown
  const categories = [
    'Electronics',
    'Clothing',
    'Books',
    'Home & Garden',
    'Toys',
    'Sports',
    'Other'
  ];

  useEffect(() => {
    if (isEditMode) {
      const fetchProduct = async () => {
        try {
          setInitializing(true);
          setNotFound(false);
          
          console.log('Fetching product with ID:', id);
          const data = await getProductById(id);
          console.log('Product data received:', data);
          
          if (!data) {
            setNotFound(true);
            message.error('Product not found');
            return;
          }
          
          // Use optional chaining to avoid errors if properties are missing
          form.setFieldsValue({
            name: data.name || '',
            description: data.description || '',
            price: data.price || 0,
            category: data.category || '',
            stock: data.stock || 0,
            imageUrl: data.imageUrl || ''
          });
        } catch (error) {
          setNotFound(true);
          message.error(`Failed to fetch product: ${error.message}`);
          console.error('Product fetch error:', error);
        } finally {
          setInitializing(false);
        }
      };

      fetchProduct();
    } else {
      // Clear form when in create mode
      form.resetFields();
    }
  }, [id, form, isEditMode]);

  const onFinish = async (values) => {
    try {
      setLoading(true);
      
      if (isEditMode) {
        console.log('Updating product with ID:', id);
        await updateProduct(id, values);
        message.success('Product updated successfully');
      } else {
        console.log('Creating new product');
        await createProduct(values);
        message.success('Product created successfully');
      }
      navigate('/');
    } catch (error) {
      message.error(`Failed to ${isEditMode ? 'update' : 'create'} product: ${error.message}`);
      console.error('Submission error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (initializing) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '50px' }}>
        <Spin size="large" />
      </div>
    );
  }

  if (notFound && isEditMode) {
    return (
      <Card>
        <h2>Product not found</h2>
        <p>The product you're trying to edit could not be found.</p>
        <Button type="primary" onClick={() => navigate('/')}>
          Back to Products
        </Button>
      </Card>
    );
  }

  return (
    <Card title={isEditMode ? 'Edit Product' : 'Add New Product'}>
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={{
          name: '',
          description: '',
          price: 0,
          category: '',
          stock: 0,
          imageUrl: 'https://via.placeholder.com/200x200?text=Product+Image'
        }}
      >
        <Form.Item
          name="name"
          label="Product Name"
          rules={[{ required: true, message: 'Please enter product name' }]}
        >
          <Input placeholder="Enter product name" />
        </Form.Item>

        <Form.Item
          name="description"
          label="Description"
          rules={[{ required: true, message: 'Please enter product description' }]}
        >
          <TextArea rows={4} placeholder="Enter product description" />
        </Form.Item>

        <Form.Item
          name="price"
          label="Price"
          rules={[{ required: true, message: 'Please enter product price' }]}
        >
          <InputNumber
            style={{ width: '100%' }}
            formatter={(value) => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
            min={0}
            step={0.01}
            precision={2}
            placeholder="0.00"
          />
        </Form.Item>

        <Form.Item
          name="category"
          label="Category"
          rules={[{ required: true, message: 'Please select a category' }]}
        >
          <Select placeholder="Select a category">
            {categories.map(category => (
              <Option key={category} value={category}>{category}</Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="stock"
          label="Stock Quantity"
          rules={[{ required: true, message: 'Please enter stock quantity' }]}
        >
          <InputNumber
            style={{ width: '100%' }}
            min={0}
            step={1}
            placeholder="0"
          />
        </Form.Item>

        <Form.Item
          name="imageUrl"
          label="Image URL"
        >
          <Input placeholder="Enter image URL" />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} style={{ marginRight: 8 }}>
            {isEditMode ? 'Update' : 'Create'} Product
          </Button>
          <Button onClick={() => navigate('/')}>Cancel</Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default ProductForm; 