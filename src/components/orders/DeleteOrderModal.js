import React from 'react';
import { Modal, Button } from 'react-bootstrap';

function DeleteOrderModal({ show, onHide, orderId, onDelete }) {
    const handleDelete = () => {
        onDelete(orderId);
        onHide();
    };

    return (
        <Modal show={show} onHide={onHide}>
            <Modal.Header closeButton>
                <Modal.Title>Confirmar Exclusão</Modal.Title>
            </Modal.Header>
            <Modal.Body>Você tem certeza que deseja excluir este pedido?</Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onHide}>
                    Cancelar
                </Button>
                <Button variant="danger" onClick={handleDelete}>
                    Excluir
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

export default DeleteOrderModal;
