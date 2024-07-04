import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import api from '../../services/api'; // Certifique-se de que este caminho está correto

function DeleteProductModal({ show, onHide, productId, onDelete }) {
    const handleDelete = async () => {
        try {
            const response = await api.delete(`/products/${productId}`);
            console.log('Produto excluído com sucesso!', response.data);
            onDelete(productId); // Remove o produto da lista após a exclusão
            onHide(); // Fecha o modal após a exclusão
        } catch (error) {
            console.error('Erro ao excluir o produto:', error);
            // Exibir mensagem de erro ao usuário
        }
    };

    return (
        <Modal show={show} onHide={onHide}>
            <Modal.Header closeButton>
                <Modal.Title>Confirmar Exclusão</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p>Tem certeza que deseja excluir este produto?</p>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onHide}>Cancelar</Button>
                <Button variant="danger" onClick={handleDelete}>Confirmar Exclusão</Button>
            </Modal.Footer>
        </Modal>
    );
}

export default DeleteProductModal;
