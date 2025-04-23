import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Card, Descriptions, Button, Spin, message, Image, Tag } from 'antd';
import { getProductById } from '../services/api';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        
        // Check for invalid ID
        if (!id) {
          message.error('Invalid product ID');
          return;
        }
        
        const data = await getProductById(id);
        setProduct(data);
      } catch (error) {
        message.error('Failed to fetch product details');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '50px' }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!product) {
    return (
      <Card>
        <h2>Product not found</h2>
        <p>The product you're looking for could not be found.</p>
        <Link to="/">
          <Button type="primary">Back to Products</Button>
        </Link>
      </Card>
    );
  }

  return (
    <div>
      <Card
        title={<h2>{product.name}</h2>}
        extra={
          product._id && (
            <Link to={`/products/edit/${product._id}`}>
              <Button type="primary">Edit</Button>
            </Link>
          )
        }
        style={{ marginBottom: 20 }}
      >
        <div style={{ display: 'flex', marginBottom: 20 }}>
          <div style={{ marginRight: 20 }}>
            <Image
              src={product.imageUrl || 'https://via.placeholder.com/200x200?text=No+Image'}
              alt={product.name}
              width={200}
              height={200}
              style={{ objectFit: 'cover' }}
              fallback="https://via.placeholder.com/200x200?text=Error"
            />
          </div>
          <Descriptions bordered column={1} style={{ flex: 1 }}>
            <Descriptions.Item label="ID">{product._id}</Descriptions.Item>
            <Descriptions.Item label="Name">{product.name}</Descriptions.Item>
            <Descriptions.Item label="Description">{product.description}</Descriptions.Item>
            <Descriptions.Item label="Price">${product.price?.toFixed(2)}</Descriptions.Item>
            <Descriptions.Item label="Category">
              <Tag color="blue">{product.category}</Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Stock">
              {product.stock > 0 ? (
                <Tag color={product.stock < 10 ? 'orange' : 'green'}>
                  {product.stock}
                </Tag>
              ) : (
                <Tag color="red">Out of stock</Tag>
              )}
            </Descriptions.Item>
          </Descriptions>
        </div>
      </Card>
      <Link to="/">
        <Button>Back to Products</Button>
      </Link>
    </div>
  );
};

export default ProductDetail; 