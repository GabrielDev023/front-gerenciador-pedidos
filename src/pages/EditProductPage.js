import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Form, Button, Alert, Row, Col, Card, Carousel } from 'react-bootstrap';
import api from '../services/api';

function EditProductPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [productData, setProductData] = useState({
        name: '',
        description: '',
        price: '',
        stock: ''
    });
    const [productImages, setProductImages] = useState([]);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await api.get(`/products/${id}`);
                if (response.data && response.data.data) {
                    const { name, description, price, stock, images } = response.data.data;
                    setProductData({ name, description, price, stock });
                    setProductImages(images || []);
                } else {
                    setErrorMessage('Erro ao carregar o produto');
                }
            } catch (error) {
                console.error('Erro ao carregar o produto:', error);
                setErrorMessage('Erro ao carregar o produto');
            }
        };
        fetchProduct();
    }, [id]);
    const handleFormSubmit = async (event) => {
        event.preventDefault();
    
        const formData = new FormData();
        formData.append('name', productData.name);
        formData.append('description', productData.description);
        formData.append('price', productData.price);
        formData.append('stock', productData.stock);
    
        productImages.forEach((image) => {
            formData.append('images[]', image.image);
        });
    
        try {
            const response = await api.put(`/products/${id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
    
            const updatedProduct = response.data.product;
            console.log('Produto atualizado com sucesso!', updatedProduct);
            setSuccessMessage(`Produto ${updatedProduct.name} atualizado com sucesso!`);
            setTimeout(() => {
                navigate('/products'); // Redireciona para a lista de produtos após 2 segundos
            }, 2000);
        } catch (error) {
            console.error('Erro ao atualizar o produto:', error);
            setErrorMessage('Erro ao atualizar o produto');
        }
    };
    

    const handleChange = (event) => {
        const { name, value } = event.target;
        setProductData({ ...productData, [name]: value });
    };

    return (
        <Container>
            <h1>Editar Produto</h1>
            {successMessage && <Alert variant="success">{successMessage}</Alert>}
            {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
            <Form onSubmit={handleFormSubmit}>
                <Form.Group controlId="formName">
                    <Form.Label>Nome</Form.Label>
                    <Form.Control type="text" name="name" value={productData.name} onChange={handleChange} />
                </Form.Group>
                <Form.Group controlId="formDescription">
                    <Form.Label>Descrição</Form.Label>
                    <Form.Control type="text" name="description" value={productData.description} onChange={handleChange} />
                </Form.Group>
                <Form.Group controlId="formPrice">
                    <Form.Label>Preço</Form.Label>
                    <Form.Control type="text" name="price" value={productData.price} onChange={handleChange} />
                </Form.Group>
                <Form.Group controlId="formStock">
                    <Form.Label>Estoque</Form.Label>
                    <Form.Control type="number" name="stock" value={productData.stock} onChange={handleChange} />
                </Form.Group>
                <Form.Group controlId="formImages">
                    <Form.Label>Imagens</Form.Label>
                    <Row>
                        {productImages && productImages.length > 0 ? (
                            productImages.map(image => (
                                <Col key={image.id} md={4} className="mb-3">
                                    <Card>
                                        <Carousel>
                                            <Carousel.Item>
                                                <img
                                                    style={{ height: '200px' }}
                                                    className="d-block w-100"
                                                    src={`http://localhost:8000/storage/${image.image}`}
                                                    alt={`Imagem ${productData.name}`}
                                                />
                                            </Carousel.Item>
                                        </Carousel>
                                    </Card>
                                </Col>
                            ))
                        ) : (
                            <Col>
                                <p>Nenhuma imagem disponível.</p>
                            </Col>
                        )}
                    </Row>
                </Form.Group>
                <Button variant="primary" type="submit">Salvar Alterações</Button>
            </Form>
        </Container>
    );
}

export default EditProductPage;
