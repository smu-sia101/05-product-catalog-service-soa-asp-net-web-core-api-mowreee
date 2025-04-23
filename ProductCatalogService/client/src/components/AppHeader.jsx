import { Link, useLocation } from 'react-router-dom';
import { Layout, Menu } from 'antd';

const { Header } = Layout;

const AppHeader = () => {
  const location = useLocation();
  
  const menuItems = [
    {
      key: '/',
      label: <Link to="/">Products</Link>,
    },
    {
      key: '/products/add',
      label: <Link to="/products/add">Add Product</Link>,
    }
  ];

  const selectedKey = menuItems.find(item => 
    location.pathname === item.key || 
    (item.key !== '/' && location.pathname.startsWith(item.key))
  )?.key || '/';

  return (
    <Header style={{ position: 'fixed', zIndex: 1, width: '100%' }}>
      <div className="logo" />
      <Menu
        theme="dark"
        mode="horizontal"
        selectedKeys={[selectedKey]}
        items={menuItems}
      />
    </Header>
  );
};

export default AppHeader; 