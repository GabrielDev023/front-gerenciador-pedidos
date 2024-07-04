import React, { useState } from 'react';
import { Container, Form, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

function CreateProductPage() {
    const navigate = useNavigate();
    const [productData, setProductData] = useState({
        name: '',
        description: '',
        price: '',
        stock: '',
        images: [] 
    });
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const handleFormSubmit = async (event) => {
        event.preventDefault();
        try {
            const formData = new FormData();
            formData.append('name', productData.name);
            formData.append('description', productData.description);
            formData.append('price', productData.price);
            formData.append('stock', productData.stock);
            
            for (let i = 0; i < productData.images.length; i++) {
                formData.append('images[]', productData.images[i]);
            }

            const response = await api.post('/products', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            const createdProduct = response.data.product;
            console.log('Produto criado com sucesso:', createdProduct);
            setSuccessMessage(`Produto "${createdProduct.name}" foi cadastrado com sucesso!`);
            setTimeout(() => {
                navigate('/products');
            }, 2000);
        } catch (error) {
            console.error('Erro ao criar o produto:', error);
            setErrorMessage('Erro ao criar o produto');
        }
    };

    const handleChange = (event) => {
        const { name, value } = event.target;
        setProductData({ ...productData, [name]: value });
    };

    const handleImageChange = (event) => {
        const images = Array.from(event.target.files);
        setProductData({ ...productData, images });
    };

    return (
        <Container>
            <h1>Cadastrar Produto</h1>
            {successMessage && (
                <Alert variant="success" onClose={() => setSuccessMessage('')} dismissible>
                    {successMessage}
                </Alert>
            )}
            {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
            <Form onSubmit={handleFormSubmit}>
                <Form.Group controlId="formName">
                    <Form.Label>Nome</Form.Label>
                    <Form.Control type="text" name="name" value={productData.name} onChange={handleChange} required />
                </Form.Group>
                <Form.Group controlId="formDescription">
                    <Form.Label>Descrição</Form.Label>
                    <Form.Control type="text" name="description" value={productData.description} onChange={handleChange} required />
                </Form.Group>
                <Form.Group controlId="formPrice">
                    <Form.Label>Preço</Form.Label>
                    <Form.Control type="text" name="price" value={productData.price} onChange={handleChange} required />
                </Form.Group>
                <Form.Group controlId="formStock">
                    <Form.Label>Estoque</Form.Label>
                    <Form.Control type="number" name="stock" value={productData.stock} onChange={handleChange} required />
                </Form.Group>
                <Form.Group controlId="formImages">
                    <Form.Label>Imagens</Form.Label>
                    <Form.Control type="file" name="images" onChange={handleImageChange} multiple accept="image/*" />
                </Form.Group>
                <Button variant="primary" type="submit">Cadastrar</Button>
            </Form>
        </Container>
    );
}

export default CreateProductPage;
