import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Table, Button, Space, Popconfirm, message, Image, Tag } from 'antd';
import { getProducts, deleteProduct } from '../services/api';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState(null);
  const navigate = useNavigate();

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await getProducts();
      setProducts(data);
    } catch (error) {
      message.error('Failed to fetch products');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id, index) => {
    try {
      setDeleteLoading(index);
      
      if (!id) {
        message.error('Cannot delete: Invalid product ID');
        return;
      }
      
      await deleteProduct(id);
      message.success('Product deleted successfully');
      fetchProducts();
    } catch (error) {
      message.error(`Failed to delete product: ${error.message}`);
      console.error('Delete error:', error);
    } finally {
      setDeleteLoading(null);
    }
  };

  const handleEdit = (id) => {
    if (!id) {
      message.error('Cannot edit: Invalid product ID');
      return;
    }
    navigate(`/products/edit/${id}`);
  };

  const columns = [
    {
      title: 'Image',
      dataIndex: 'imageUrl',
      key: 'imageUrl',
      render: (imageUrl) => (
        <Image 
          src={imageUrl || 'https://cdn.vectorstock.com/i/1000v/35/89/invalid-rubber-stamp-vector-12763589.jpg'} 
          alt="Product"
          width={50}
          height={50}
          style={{ objectFit: 'cover' }}
          fallback="https://via.placeholder.com/50x50?text=Error"
        />
      ),
      width: 80,
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => {
        // Only make it a link if id is valid
        const validId = record._id && record._id !== 'undefined' && record._id !== '';
        return validId ? (
          <Link to={`/products/${record._id}`}>{text}</Link>
        ) : (
          text
        );
      }
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      render: (price) => `$${price?.toFixed(2) || '0.00'}`,
      width: 100,
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      render: (category) => <Tag color="blue">{category}</Tag>,
      width: 120,
    },
    {
      title: 'Stock',
      dataIndex: 'stock',
      key: 'stock',
      render: (stock) => {
        let color = 'green';
        if (stock <= 0) {
          color = 'red';
        } else if (stock < 10) {
          color = 'orange';
        }
        return <Tag color={color}>{stock}</Tag>;
      },
      width: 80,
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record, index) => (
        <Space size="middle">
          <Button 
            type="primary" 
            onClick={() => handleEdit(record._id)}
          >
            Edit
          </Button>
          <Popconfirm
            title="Are you sure you want to delete this product?"
            onConfirm={() => handleDelete(record._id, index)}
            okText="Yes"
            cancelText="No"
          >
            <Button danger loading={deleteLoading === index}>Delete</Button>
          </Popconfirm>
        </Space>
      ),
      width: 150,
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
        <h1>Products</h1>
        <Link to="/products/add">
          <Button type="primary">Add New Product</Button>
        </Link>
      </div>
      <Table 
        columns={columns} 
        dataSource={products} 
        rowKey={(record) => record._id || Math.random().toString()} 
        loading={loading}
        pagination={{ pageSize: 10 }}
      />
    </div>
  );
};

export default ProductList; 