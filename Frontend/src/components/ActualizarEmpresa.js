import React, { useEffect, useState } from "react";
import { Form, Button } from "react-bootstrap";
import { useParams, useHistory } from "react-router-dom";
import axios from "axios";

const ActualizarEmpresa = () => {
    const { id } = useParams();
    const [nombre, setNombre] = useState("");
    const [precios, setPrecios] = useState([]);
    const history = useHistory();

    useEffect(() => {
        const obtenerDatosEmpresa = async () => {
            try {
                // Obtener la información básica de la empresa
                const response = await axios.get(`http://localhost:9999/empresa/${id}`);
                const empresa = response.data;
                setNombre(empresa.NOMBRE);

                // Obtener los precios de acciones asociados
                const preciosResponse = await axios.get(`http://localhost:9999/empresa/${id}/precios`);
                setPrecios(preciosResponse.data);
            } catch (error) {
                console.error("Error al obtener la empresa:", error);
            }
        };

        obtenerDatosEmpresa();
    }, [id]);

    const manejarCambioPrecio = (index, campo, valor) => {
        const nuevosPrecios = [...precios];
        nuevosPrecios[index][campo] = valor;
        setPrecios(nuevosPrecios);
    };

    const agregarFilaPrecio = () => {
        setPrecios([...precios, { FECHA: "", PRECIO: "" }]);
    };

    const eliminarFilaPrecio = async (index) => {
        const precio = precios[index];
    
        if (precio.idPRECIO) {
            // Si el precio tiene un idPRECIO, eliminarlo de la base de datos
            try {
                await axios.delete(`http://localhost:9999/precio/${precio.idPRECIO}`);
            } catch (error) {
                console.error("Error al eliminar el precio de la base de datos:", error);
                alert("No se pudo eliminar el precio. Por favor, intenta de nuevo.");
                return;
            }
        }
    
        // Actualizar el estado local eliminando la fila
        setPrecios(precios.filter((_, i) => i !== index));
    };
    

    const manejarActualizacion = async () => {
        try {
            // Actualizar la información básica de la empresa
            const empresaActualizada = {
                NOMBRE: nombre,
            };
            await axios.put(`http://localhost:9999/empresa/${id}`, empresaActualizada);

            // Actualizar precios de acciones
            await Promise.all(
                precios.map((precio) =>
                    precio.idPRECIO
                        ? axios.put(`http://localhost:9999/precio/${precio.idPRECIO}`, {
                              FECHA: precio.FECHA,
                              PRECIO: parseFloat(precio.PRECIO),
                          })
                        : axios.post(`http://localhost:9999/empresa/${id}/precio`, {
                              FECHA: precio.FECHA,
                              PRECIO: parseFloat(precio.PRECIO),
                          })
                )
            );

            alert("Empresa actualizada exitosamente");
            history.push("/Proyecto/administrador");
        } catch (error) {
            console.error("Error al actualizar la empresa:", error);
        }
    };

    if (!precios.length) {
        return <p>Cargando información de la empresa...</p>;
    }

    return (
        <div className="actualizar-container">
            <div className="update-card">
                <h1 className="update-title">Actualizar Empresa</h1>
                <Form>
                    <Form.Group controlId="nombre">
                        <Form.Label>Nombre de la Empresa</Form.Label>
                        <Form.Control
                            type="text"
                            value={nombre}
                            onChange={(e) => setNombre(e.target.value)}
                            placeholder="Ingrese el nombre de la empresa"
                        />
                    </Form.Group>
                    <Form.Group controlId="precios">
                        <Form.Label>Precios de Acciones</Form.Label>
                        <p className="update-info-text">Ingrese los precios de las acciones.</p>
                        {precios.map((precio, index) => (
                            <div key={index} className="d-flex align-items-center mt-2">
                                <Form.Control
                                    type="date"
                                    value={precio.FECHA}
                                    onChange={(e) => manejarCambioPrecio(index, "FECHA", e.target.value)}
                                    className="mr-2"
                                />
                                <Form.Control
                                    type="number"
                                    placeholder="Precio"
                                    value={precio.PRECIO}
                                    onChange={(e) => manejarCambioPrecio(index, "PRECIO", e.target.value)}
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
                    <div className="button-group">
                        <Button variant="primary" className="update-button" onClick={manejarActualizacion}>
                            Actualizar
                        </Button>
                        <Button
                            variant="secondary"
                            className="cancel-button"
                            onClick={() => history.push("/Proyecto/administrador")}
                        >
                            Regresar
                        </Button>
                    </div>
                </Form>
            </div>
        </div>
    );
};

export default ActualizarEmpresa;