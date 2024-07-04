import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import api from '../../services/api';

function DeleteUserModal({ show, onHide, userId, onDelete }) {

    const handleDeleteUser = async () => {
        try {
            const response = await api.delete(`/users/${userId}`);
            console.log('Usuario excluído com sucesso!', response.data);
            onDelete(userId); 
            onHide(); 
        } catch (error) {
            console.error('Erro ao excluir o Usuario:', error);
        }
    };

    return (
        <Modal show={show} onHide={onHide}>
            <Modal.Header closeButton>
                <Modal.Title>Confirmar Exclusão</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                Tem certeza que deseja excluir este usuário?
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onHide}>
                    Cancelar
                </Button>
                <Button variant="danger" onClick={handleDeleteUser}>
                    Excluir
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

export default DeleteUserModal;
