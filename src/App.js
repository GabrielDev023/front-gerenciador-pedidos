import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Register from './pages/Register';
import Products from './pages/Products';
import EditProductPage from './pages/EditProductPage'; // Importe a nova página de edição
import CreateProductPage from './pages/CreateProductPage'; // Importe o componente
import UsersPage from './pages/UsersPage';
import EditUserPage from './pages/EditUserPage'; // Importe a nova página de edição
import OrdersPage from './pages/OrdersPage';
import CreateOrderPage from './pages/CreateOrderPage';


function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/edit/:id" element={<EditProductPage />} /> {/* Nova rota de edição */}
        <Route path="/products/create" element={<CreateProductPage />} /> {/* Adicione esta linha */}
        <Route path="/users" element={<UsersPage />} />
        <Route path="/users/edit/:id" element={<EditUserPage />} /> {/* Nova rota de edição */}
        <Route path="/orders" element={<OrdersPage />} />
        <Route path="/orders/create" element={<CreateOrderPage />} />
        </Routes>
      <Footer />
    </Router>
  );
}

export default App;
