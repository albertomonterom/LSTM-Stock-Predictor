import React from "react";
import { Nav, Button } from "react-bootstrap";
import { useHistory, useLocation } from "react-router-dom";
import "../styles/Header.css";

const Header = () => {
  const history = useHistory();
  const location = useLocation();

  // Determinar la pestaña activa en función de la ruta actual
  const currentPath = location.pathname.split("/").pop(); // Obtiene el último segmento de la ruta

  const handleSelect = (selectedKey) => {
    history.push(`/Proyecto/${selectedKey}`);
  };

  const handleBack = () => {
    history.push("/Proyecto/administrador");
  };

  return (
    <div className="custom-header-container">
      <Button variant="secondary" onClick={handleBack} className="back-button">
        Regresar
      </Button>
      <Nav
        variant="tabs"
        activeKey={currentPath}
        onSelect={handleSelect}
        className="custom-header"
      >
        <Nav.Item>
          <Nav.Link eventKey="dataset">Dataset</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="neural-network">Neural Network</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="prediction">Test Prediction</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="future-prediction">Future Prediction</Nav.Link>
        </Nav.Item>
      </Nav>
    </div>
  );
};

export default Header;