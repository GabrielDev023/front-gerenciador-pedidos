import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Alert, Card, Col, Row, Carousel } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

function CreateOrderPage() {
    const [orderData, setOrderData] = useState({
        customer_id: '',
        products: [],
    });
    const [customers, setCustomers] = useState([]);
    const [products, setProducts] = useState([]);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        // Fetch customers and products for the dropdowns
        const fetchCustomersAndProducts = async () => {
            try {
                const customersResponse = await api.get('/users');
                const productsResponse = await api.get('/products');
                setCustomers(customersResponse.data.data);
                setProducts(productsResponse.data.data.map(product => ({
                    ...product,
                    imageUrl: product.images.length > 0 ? `http://localhost:8000/storage/${product.images[0].image}` : null
                })));
            } catch (error) {
                console.error('Erro ao carregar clientes ou produtos:', error);
                setErrorMessage('Erro ao carregar clientes ou produtos.');
            }
        };
        fetchCustomersAndProducts();
    }, []);

    const handleFormSubmit = async (event) => {
        event.preventDefault();
        try {
            const payload = {
                customer_id: orderData.customer_id,
                products: orderData.products.map(product => ({
                    product_id: product.id,
                    quantity: parseInt(product.quantity),
                    price: parseFloat(product.price),
                })),
                total: calculateTotal(),
            };
    
            const response = await api.post('/orders', payload);
            setSuccessMessage('Pedido criado com sucesso!');
            setTimeout(() => {
                navigate('/orders');
            }, 2000);
        } catch (error) {
            console.error('Erro ao criar pedido:', error);
            if (error.response && error.response.data && error.response.data.errors) {
                const { errors } = error.response.data;
                const errorMessage = Object.values(errors).flat().join(' ');
                setErrorMessage(errorMessage);
            } else {
                setErrorMessage('Erro ao criar pedido.');
            }
        }
    };
    

    const handleChange = (event) => {
        const { name, value } = event.target;
        setOrderData({ ...orderData, [name]: value });
    };

    const handleProductSelect = (productId) => {
        const selectedProduct = products.find(product => product.id === parseInt(productId));
        const isProductInOrder = orderData.products.find(product => product.id === parseInt(productId));
        if (!isProductInOrder && selectedProduct) {
            const updatedProducts = [...orderData.products, {
                id: selectedProduct.id,
                name: selectedProduct.name,
                price: selectedProduct.price,
                quantity: 1, // quantidade inicial
                imageUrl: selectedProduct.imageUrl,
            }];
            setOrderData({ ...orderData, products: updatedProducts });
        }
    };

    const handleRemoveProduct = (productId) => {
        const updatedProducts = orderData.products.filter(product => product.id !== productId);
        setOrderData({ ...orderData, products: updatedProducts });
    };

    const calculateTotal = () => {
        let total = 0;
        orderData.products.forEach(product => {
            const quantity = parseInt(product.quantity);
            const price = parseFloat(product.price);
            total += quantity * price;
        });
        return total.toFixed(2);
    };

    const handleQuantityChange = (productId, quantity) => {
        const updatedProducts = orderData.products.map(product => {
            if (product.id === productId) {
                return { ...product, quantity };
            }
            return product;
        });
        setOrderData({ ...orderData, products: updatedProducts });
    };

    return (
        <Container>
            <h1>Criar Pedido</h1>
            {successMessage && <Alert variant="success">{successMessage}</Alert>}
            {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
            <Form onSubmit={handleFormSubmit}>
                <Row>
                    <Col md={6}>
                        <Form.Group controlId="formProducts">
                            <Form.Label>Produtos</Form.Label>
                            <Form.Control as="select" name="product_id" onChange={(e) => handleProductSelect(e.target.value)} required>
                                <option value="">Selecione um produto</option>
                                {products.map(product => (
                                    <option key={product.id} value={product.id}>{product.name}</option>
                                ))}
                            </Form.Control>
                            {orderData.products.map(product => (
                                <Card key={product.id} className="mb-2">
                                    <Card.Body>
                                        <Row>
                                            <Col xs={12} md={4}>
                                                {product.imageUrl && (
                                                    <Carousel>
                                                        <Carousel.Item>
                                                            <img
                                                                className="d-block w-100"
                                                                src={product.imageUrl}
                                                                alt={product.name}
                                                            />
                                                        </Carousel.Item>
                                                    </Carousel>
                                                )}
                                            </Col>
                                            <Col xs={12} md={8}>
                                                <Card.Title>{product.name}</Card.Title>
                                                <Card.Text>
                                                    <strong>Preço:</strong> R$ {product.price} <br />
                                                    <strong>Quantidade:</strong>
                                                    <Form.Control type="number" value={product.quantity} onChange={(e) => handleQuantityChange(product.id, e.target.value)} />
                                                </Card.Text>
                                            </Col>
                                            <Col xs={2} className="d-flex align-items-center justify-content-end">
                                                <Button variant="danger" onClick={() => handleRemoveProduct(product.id)}>Remover</Button>
                                            </Col>
                                        </Row>
                                    </Card.Body>
                                </Card>
                            ))}
                        </Form.Group>
                    </Col>

                    <Col md={6}>
                        <Form.Group controlId="formCustomerId">
                            <Form.Label>Cliente</Form.Label>
                            <Form.Control as="select" name="customer_id" value={orderData.customer_id} onChange={handleChange} required>
                                <option value="">Selecione um cliente</option>
                                {customers.map(customer => (
                                    <option key={customer.id} value={customer.id}>{customer.name}</option>
                                ))}
                            </Form.Control>
                        </Form.Group>

                        <Form.Group controlId="formTotal">
                            <Form.Label>Total</Form.Label>
                            <Form.Control type="number" step="0.01" name="total" value={calculateTotal()} readOnly />
                        </Form.Group>

                        <Button variant="primary" type="submit">Criar Pedido</Button>
                    </Col>
                </Row>
            </Form>
        </Container>
    );
}

export default CreateOrderPage;
