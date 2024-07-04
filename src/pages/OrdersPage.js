import React, { useState, useEffect } from 'react';
import { Container, ListGroup, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import DeleteOrderModal from '../components/orders/DeleteOrderModal';

function OrdersPage() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [orderIdToDelete, setOrderIdToDelete] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await api.get('/orders');
                const ordersData = response.data;

               
                const normalizedOrders = ordersData.map(order => ({
                    ...order,
                    product_id: parseProductIds(order.product_id),
                }));

                const ordersWithProducts = await Promise.all(
                    normalizedOrders.map(async order => {
                        const customerResponse = await api.get(`/users/${order.customer_id}`);
                        const customerData = customerResponse.data.data;
                        const productResponse = await Promise.all(order.product_id.map(id => api.get(`/products/${id}`)));
                        const productsData = productResponse.map(res => res.data.data);

                        return { ...order, customer: customerData, products: productsData };
                    })
                );

                setOrders(ordersWithProducts);
            } catch (error) {
                console.error('Erro ao carregar pedidos:', error);
                setError('Erro ao carregar pedidos.');
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    const parseProductIds = productIds => {
        try {
           
            return Array.isArray(productIds) ? productIds : JSON.parse(productIds.replace(/'/g, '"'));
        } catch (error) {
            console.error('Erro ao converter product_id:', error);
            return [];
        }
    };

    const handleCreateOrder = () => {
        navigate('/orders/create');
    };

    const handleShowDeleteModal = (id) => {
        setOrderIdToDelete(id);
        setShowDeleteModal(true);
    };

    const handleHideDeleteModal = () => {
        setShowDeleteModal(false);
        setOrderIdToDelete(null);
    };

    const handleDeleteOrder = async (id) => {
        try {
            await api.delete(`/orders/${id}`);
            const updatedOrders = orders.filter(order => order.id !== id);
            setOrders(updatedOrders);
            setSuccessMessage('Pedido excluído com sucesso!');
        } catch (error) {
            console.error('Erro ao excluir pedido:', error);
            setError('Erro ao excluir pedido.');
        }
    };

    return (
        <Container>
            <h1>Pedidos</h1>
            <Button variant="primary" className="mb-3" onClick={handleCreateOrder}>
                Adicionar Novo Pedido
            </Button>
            {successMessage && <Alert variant="success">{successMessage}</Alert>}
            {error && <Alert variant="danger">{error}</Alert>}
            <ListGroup>
                {orders && orders.length > 0 ? (
                    orders.map(order => (
                        <ListGroup.Item key={order.id}>
                            <strong>ID do Pedido:</strong> {order.id} <br />
                            <strong>Cliente:</strong> {order.customer ? order.customer.name : 'Nome do cliente não encontrado'} <br />
                            <strong>Produtos:</strong> {order.products.map(product => product.name).join(', ')} <br />
                            <strong>Total:</strong> R$ {order.total} <br />
                            <Button variant="danger" onClick={() => handleShowDeleteModal(order.id)}>Excluir</Button>
                        </ListGroup.Item>
                    ))
                ) : (
                    <ListGroup.Item>Nenhum pedido encontrado.</ListGroup.Item>
                )}
            </ListGroup>

            <DeleteOrderModal
                show={showDeleteModal}
                onHide={handleHideDeleteModal}
                orderId={orderIdToDelete}
                onDelete={handleDeleteOrder}
            />
        </Container>
    );
}

export default OrdersPage;
