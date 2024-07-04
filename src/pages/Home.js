import React from 'react';
import { Container, Row, Col, Button, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <Container className="d-flex justify-content-center align-items-center min-vh-100">
      <Row>
        <Col md={{ span: 12}}>
          <Card className="shadow-lg">
            <Card.Body className="text-center">
              <h2 className="mb-4">Bem-vindo à Loja</h2>
              <p>Vamos começar com o seu cadastro!</p>
              <div className="d-grid gap-2">
                <Link to="/register">
                  <Button variant="primary" size="lg">
                    Cadastrar-se
                  </Button>
                </Link>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Home;
