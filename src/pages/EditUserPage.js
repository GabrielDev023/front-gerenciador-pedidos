import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Alert } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';

function EditUserPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [userData, setUserData] = useState({
        name: '',
        email: '',
        cnpj_cpf: '',
        razao_social: '',
        endereco: '',
        bairro: '',
        complemento: '',
        cidade: '',
        uf: '',
        cep: '',
        telefone: ''
    });

    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await api.get(`/users/${id}`);
                if (response.data && response.data.data) {
                    setUserData(response.data.data);
                } else {
                    setErrorMessage('Usuário não encontrado.');
                }
            } catch (error) {
                console.error('Erro ao carregar usuário:', error);
                setErrorMessage('Erro ao carregar usuário.');
            }
        };
        fetchUser();
    }, [id]);

    const handleFormSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await api.put(`/users/${id}`, userData);
            console.log('Usuário atualizado com sucesso!', response.data);
            setSuccessMessage('Usuário atualizado com sucesso!');
            setTimeout(() => {
                navigate('/users'); // Redireciona para a lista de usuários após 2 segundos
            }, 2000);
        } catch (error) {
            if (error.response && error.response.data && error.response.data.errors) {
                const errors = error.response.data.errors;
                if (errors.email) {
                    setErrorMessage('O e-mail já está em uso.');
                } else if (errors.cnpj_cpf) {
                    setErrorMessage('O CNPJ/CPF já está em uso.');
                } else {
                    setErrorMessage('Erro ao atualizar usuário.');
                }
            } else {
                setErrorMessage('Erro ao atualizar usuário.');
            }
        }
    };

    const handleChange = (event) => {
        const { name, value } = event.target;
        setUserData({ ...userData, [name]: value });
    };

    return (
        <Container>
            <h1>Editar Usuário</h1>
            {successMessage && <Alert variant="success">{successMessage}</Alert>}
            {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
            <Form onSubmit={handleFormSubmit}>
                <Form.Group controlId="formName">
                    <Form.Label>Nome</Form.Label>
                    <Form.Control type="text" name="name" value={userData.name} onChange={handleChange} />
                </Form.Group>
                <Form.Group controlId="formEmail">
                    <Form.Label>Email</Form.Label>
                    <Form.Control type="email" name="email" value={userData.email} onChange={handleChange}  />
                </Form.Group>
                <Form.Group controlId="formCnpjCpf">
                    <Form.Label>CNPJ/CPF</Form.Label>
                    <Form.Control type="text" name="cnpj_cpf" value={userData.cnpj_cpf} onChange={handleChange} disabled />
                    {/* Desabilita edição do campo de CNPJ/CPF */}
                </Form.Group>
                <Form.Group controlId="formRazaoSocial">
                    <Form.Label>Razão Social</Form.Label>
                    <Form.Control type="text" name="razao_social" value={userData.razao_social} onChange={handleChange} />
                </Form.Group>
                <Form.Group controlId="formEndereco">
                    <Form.Label>Endereço</Form.Label>
                    <Form.Control type="text" name="endereco" value={userData.endereco} onChange={handleChange} />
                </Form.Group>
                <Form.Group controlId="formBairro">
                    <Form.Label>Bairro</Form.Label>
                    <Form.Control type="text" name="bairro" value={userData.bairro} onChange={handleChange} />
                </Form.Group>
                <Form.Group controlId="formComplemento">
                    <Form.Label>Complemento</Form.Label>
                    <Form.Control type="text" name="complemento" value={userData.complemento} onChange={handleChange} />
                </Form.Group>
                <Form.Group controlId="formCidade">
                    <Form.Label>Cidade</Form.Label>
                    <Form.Control type="text" name="cidade" value={userData.cidade} onChange={handleChange} />
                </Form.Group>
                <Form.Group controlId="formUF">
                    <Form.Label>UF</Form.Label>
                    <Form.Control type="text" name="uf" value={userData.uf} onChange={handleChange} />
                </Form.Group>
                <Form.Group controlId="formCep">
                    <Form.Label>CEP</Form.Label>
                    <Form.Control type="text" name="cep" value={userData.cep} onChange={handleChange} />
                </Form.Group>
                <Form.Group controlId="formTelefone">
                    <Form.Label>Telefone</Form.Label>
                    <Form.Control type="text" name="telefone" value={userData.telefone} onChange={handleChange} />
                </Form.Group>
                <Button variant="primary" type="submit">Salvar Alterações</Button>
            </Form>
        </Container>
    );
}

export default EditUserPage;
