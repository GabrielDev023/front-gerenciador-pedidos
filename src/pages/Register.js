import React, { useState } from 'react';
import { Form, Button, Container, Alert, Row, Col, Card, Modal } from 'react-bootstrap';
import api from '../services/api';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [cnpjCpf, setCnpjCpf] = useState('');
    const [message, setMessage] = useState('');
    const [variant, setVariant] = useState('');
    const [showModal, setShowModal] = useState(false);

    const handleCnpjChange = (event) => {
        let formattedCnpj = event.target.value.replace(/\D/g, '');
        formattedCnpj = formattedCnpj.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
        setCnpjCpf(formattedCnpj);
    };

    const handleCloseModal = () => setShowModal(false);

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const response = await api.post('/users', {
                name,
                email,
                password,
                cnpj_cpf: cnpjCpf
            });

            if (response.status === 201) {
                setMessage('User registered successfully!');
                setVariant('success');
                setShowModal(true);
            } else {
                setMessage('Failed to register user.');
                setVariant('danger');
            }
        } catch (error) {
            setMessage('An error occurred. Please try again.');
            setVariant('danger');
        }
    };

    const handleModalRedirect = () => {
        handleCloseModal();
        window.location.href = '/products';
    };

    return (
        <Container className="d-flex justify-content-center align-items-center min-vh-100">
            <Row className="w-100">
                <Col md={{ span: 6, offset: 3 }}>
                    <Card className="shadow-lg">
                        <Card.Body>
                            <h2 className="text-center mb-4">Cadastrar Cliente</h2>
                            {message && <Alert variant={variant}>{message}</Alert>}
                            <Form onSubmit={handleSubmit}>
                                <Form.Group controlId="formName" className="mb-3">
                                    <Form.Label>Nome</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Seu nome"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                    />
                                </Form.Group>

                                <Form.Group controlId="formEmail" className="mb-3">
                                    <Form.Label>Email</Form.Label>
                                    <Form.Control
                                        type="email"
                                        placeholder="Seu e-mail"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </Form.Group>

                                <Form.Group controlId="formPassword" className="mb-3">
                                    <Form.Label>Senha</Form.Label>
                                    <Form.Control
                                        type="password"
                                        placeholder="Digite sua senha"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                </Form.Group>

                                <Form.Group controlId="formCnpjCpf" className="mb-4">
                                    <Form.Label>CNPJ</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Digite seu CNPJ"
                                        value={cnpjCpf}
                                        onChange={handleCnpjChange}
                                        maxLength="18"
                                    />
                                </Form.Group>

                                <Button variant="primary" type="submit" className="w-100">
                                    Cadastrar
                                </Button>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header>
                    <Modal.Title>Conta criada com sucesso!</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Sua conta foi criada com sucesso. Agora você será redirecionado para a página de produtos.
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={handleModalRedirect}>
                        Continue
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default Register;
