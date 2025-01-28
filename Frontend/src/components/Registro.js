import React, { useState } from "react";
import { Form, Button, Container } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import axios from "axios";

const Registro = () => {
    const [nombre, setNombre] = useState("");
    const [precios, setPrecios] = useState([{ fecha: "", precio: "" }]);
    const history = useHistory();

    const manejarCambioPrecio = (index, campo, valor) => {
        const nuevosPrecios = [...precios];
        nuevosPrecios[index][campo] = valor;
        setPrecios(nuevosPrecios);
    }

    const agregarFilaPrecio = () => {
        setPrecios([...precios, { fecha: "", precio: "" }]);
    }

    const eliminarFilaPrecio = (index) => {
        setPrecios(precios.filter((_, i) => i != index));
    }

    const manejarRegistro = async () => {
        try {
            const nuevaEmpresa = {
                NOMBRE: nombre,
            };
            const response = await axios.post("http://localhost:9999/empresa", nuevaEmpresa);
            const idEMPRESA = response.data.idEMPRESA;

            // Agregar precios a la empresa
            await Promise.all(
                precios.map((precio) => {
                    axios.post(`http://localhost:9999/empresa/${idEMPRESA}/precio`, {
                        FECHA: precio.fecha,
                        PRECIO: parseFloat(precio.precio),
                    })
                })
            )

            alert("Empresa registrada exitosamente");
            history.push("/Proyecto/administrador");
        } catch (error) {
            console.error("Error al registrar empresa:", error);
        }
    };

    return (
        <div className="registro-container full-page-center">
            <h1 className="registro-titulo">Registrar Nueva Empresa</h1>
            <Container className="registro-formulario">
                <Form>
                    <Form.Group controlId="nombre">
                        <Form.Label>Nombre de la Empresa</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Ingrese el nombre de la empresa"
                            value={nombre}
                            onChange={(e) => setNombre(e.target.value)}
                        />
                    </Form.Group>
                    <Form.Group controlId="precios">
                        <Form.Label>Precios de Acciones</Form.Label>
                        {precios.map((precio, index) => (
                            <div key={index} className="d-flex align-items-center mt-2">
                                <Form.Control
                                    type="date"
                                    value={precio.fecha}
                                    onChange={(e) => manejarCambioPrecio(index, "fecha", e.target.value)}
                                    className="mr-2"
                                />
                                <Form.Control
                                    type="number"
                                    placeholder="Precio"
                                    value={precio.precio}
                                    onChange={(e) => manejarCambioPrecio(index, "precio", e.target.value)}
                                    className="mr-2"
                                />
                                <Button
                                    variant="danger"
                                    onClick={() => eliminarFilaPrecio(index)}
                                    disabled={precios.length === 1}
                                >
                                    Eliminar
                                </Button>
                            </div>
                        ))}
                        <Button variant="primary" className="mt-3" onClick={agregarFilaPrecio}>
                            Agregar Precio
                        </Button>
                    </Form.Group>
                    <div className="registro-botones">
                        <Button variant="success" onClick={manejarRegistro}>
                            Registrar
                        </Button>
                        <Button
                            variant="secondary"
                            className="ml-2"
                            onClick={() => history.push("/Proyecto/administrador")}
                            >
                            Regresar
                        </Button>
                    </div>
                </Form>
            </Container>
        </div>
    );
};

export default Registro;
