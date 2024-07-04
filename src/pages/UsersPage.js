import React, { useState, useEffect } from 'react';
import { Container, ListGroup, Button, Alert, Row, Col, } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import DeleteUserModal from '../components/users/DeleteUserModal';
import api from '../services/api';

function UsersPage() {
    const [users, setUsers] = useState([]);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteUserId, setDeleteUserId] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await api.get('/users');
                setUsers(response.data.data);
            } catch (error) {
                console.error('Erro ao carregar usuários:', error);
                setErrorMessage('Erro ao carregar usuários.');
            }
        };
        fetchUsers();
    }, []);

    const handleEditUser = (id) => {
        navigate(`/users/edit/${id}`);
    };

    const handleDeleteModalShow = (id) => {
        setDeleteUserId(id);
        setShowDeleteModal(true);
    };

    const handleDeleteModalHide = () => {
        setShowDeleteModal(false);
        setDeleteUserId(null);
    };


    const handleDeleteUser = (deletedUserId) => {
        const updatedUsers = users.filter(users => users.id !== deletedUserId);
        setUsers(updatedUsers);
        setSuccessMessage('Produto excluído com sucesso!');
    };


    return (
        <Container>
            <Row className="mb-3">
                <Col>
                    <h1>Clientes</h1>
                </Col>
                <Col className="text-right">
                <Link to="/register">
                  <Button variant="primary" size="lg">
                    Cadastrar-se
                  </Button>
                  </Link>                </Col>
            </Row>            {successMessage && <Alert variant="success">{successMessage}</Alert>}
            {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
            <ListGroup>
                {users.map(user => (
                    <ListGroup.Item key={user.id}>
                        <strong>Nome:</strong> {user.name} <br />
                        <strong>E-mail:</strong> {user.email} <br />
                        <strong>CPF/CNPJ:</strong> {user.cnpj_cpf} <br />
                        <Button variant="primary" onClick={() => handleEditUser(user.id)}>Editar</Button>{' '}
                        <Button variant="danger" onClick={() => handleDeleteModalShow(user.id)}>Excluir</Button>
                    </ListGroup.Item>
                ))}
            </ListGroup>

            <DeleteUserModal
                show={showDeleteModal}
                onHide={handleDeleteModalHide}
                userId={deleteUserId}
                onDelete={handleDeleteUser}
            />
        </Container>
    );
}

export default UsersPage;
