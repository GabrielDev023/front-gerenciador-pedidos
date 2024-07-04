import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Alert, Carousel } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import DeleteProductModal from '../components/products/DeleteProductModal';
import api from '../services/api';

function Products() {
    const [products, setProducts] = useState([]);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [productId, setProductId] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');
    const navigate = useNavigate();
    const defaultImage = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ8lRbS7eKYzDq-Ftxc1p8G_TTw2unWBMEYUw&s';

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await api.get('/products');
                setProducts(response.data.data);
            } catch (error) {
                console.error('Erro ao carregar produtos:', error);
            }
        };
        fetchProducts();
    }, []);

    const handleEditProduct = (id) => {
        navigate(`/products/edit/${id}`);
    };

    const handleDeleteModalShow = (id) => {
        setProductId(id);
        setShowDeleteModal(true);
    };

    const handleDeleteModalHide = () => {
        setShowDeleteModal(false);
        setProductId(null);
    };

    const handleDeleteProduct = async (deletedProductId) => {
        try {
            await api.delete(`/products/${deletedProductId}`);
            const updatedProducts = products.filter(product => product.id !== deletedProductId);
            setProducts(updatedProducts);
            setSuccessMessage('Produto excluído com sucesso!');
        } catch (error) {
            console.error('Erro ao excluir produto:', error);
        }
    };

    const handleNavigateToCreateProduct = () => {
        navigate('/products/create');
    };

    return (
        <Container>
            <Row className="mb-3">
                <Col>
                    <h1>Produtos</h1>
                </Col>
                <Col className="text-right">
                    <Button variant="success" onClick={handleNavigateToCreateProduct}>Cadastrar Produto</Button>
                </Col>
            </Row> 

            {successMessage && (
                <Alert variant="success" onClose={() => setSuccessMessage('')} dismissible>
                    {successMessage}
                </Alert>
            )}

            <Row>
                {products.map(product => (
                    <Col key={product.id} md={4}>
                        <Card className="mb-3">
                            <Carousel>
                                {product.images && product.images.length > 0 ? (
                                    product.images.map(image => (
                                        <Carousel.Item key={image.id}>
                                            <img
                                                style={{ height: '200px' }}
                                                className="d-block w-100"
                                                src={`http://localhost:8000/storage/${image.image}`}
                                                alt={`Imagem ${product.name}`}
                                            />
                                        </Carousel.Item>
                                    ))
                                ) : (
                                    <Carousel.Item>
                                        <img
                                            style={{ height: '200px' }}
                                            className="d-block w-100"
                                            src={defaultImage}
                                            alt={`Imagem padrão ${product.name}`}
                                        />
                                    </Carousel.Item>
                                )}
                            </Carousel>
                            <Card.Body>
                                <Card.Title>{product.name}</Card.Title>
                                <Card.Text>{product.description}</Card.Text>
                                <Card.Text>Preço: R$ {product.price}</Card.Text>
                                <Card.Text>Estoque: {product.stock}</Card.Text>
                                <Button variant="primary" onClick={() => handleEditProduct(product.id)}>Editar</Button>
                                <Button variant="danger" onClick={() => handleDeleteModalShow(product.id)}>Excluir</Button>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>

            <DeleteProductModal
                show={showDeleteModal}
                onHide={handleDeleteModalHide}
                productId={productId}
                onDelete={handleDeleteProduct}
            />
        </Container>
    );
}

export default Products;
