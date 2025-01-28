import React, { useEffect, useState } from "react";
import { Table, Button } from "react-bootstrap";
import axios from "axios";
import { useHistory } from "react-router-dom";

const Home = () => {
    const [empresas, setEmpresas] = useState([]);
    const history = useHistory();

    useEffect(() => {
        const obtenerEmpresas = async () => {
            try {
                // Obtener todas las empresas
                const response = await axios.get("http://localhost:9999/empresas");
                const empresasData = response.data;

                // Obtener los precios de cada empresa y asociarlos
                const empresasConPrecios = await Promise.all(
                    empresasData.map(async (empresa) => {
                        const preciosResponse = await axios.get(
                            `http://localhost:9999/empresa/${empresa.idEMPRESA}/precios`
                        );
                        return {
                            ...empresa,
                            precios: preciosResponse.data, // Agregar los precios al objeto de empresa
                        }
                    })
                )
                setEmpresas(empresasConPrecios);
            } catch (error) {
                console.error("Error al obtener empresas:", error);
            }
        };

        obtenerEmpresas();
    }, []);

    const eliminarEmpresa = async (id) => {
        try {
            await axios.delete(`http://localhost:9999/empresa/${id}`);
            alert("Empresa eliminada exitosamente");
            setEmpresas((prevEmpresas) => prevEmpresas.filter((e) => e.idEMPRESA !== id));
        } catch (error) {
            console.error("Error al eliminar empresa:", error);
        }
    };

    return (
        <div className="crud-container full-page-center">
            <h1>CRUD de Empresas</h1>
            <Button
                variant="success"
                className="M-6"
                onClick={() => history.push("/Proyecto/registro")}
            >
                Registrar Nueva Empresa
            </Button>
            <div className="home-table-container">
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nombre</th>
                            <th>Año</th>
                            <th>Precios de Acciones (Fecha:Precio)</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {empresas.length > 0 ? (
                            empresas.map((empresa) => (
                                <tr key={empresa.idEMPRESA}>
                                    <td>{empresa.idEMPRESA}</td>
                                    <td>{empresa.NOMBRE}</td>
                                    <td>{empresa.AÑO}</td>
                                    <td>
                                        {empresa.precios && empresa.precios.length > 0 ? (
                                            empresa.precios
                                                .map((precio) => `${precio.FECHA}: ${precio.PRECIO}`)
                                                .join(", ")
                                        ) : (
                                            "Sin precios registrados"
                                        )}
                                    </td>
                                    <td>
                                        <Button
                                            variant="info"
                                            className="M-6"
                                            onClick={() => history.push(`/info/${empresa.idEMPRESA}`)}
                                        >
                                            Ver
                                        </Button>
                                        <Button
                                            variant="warning"
                                            className="M-6"
                                            onClick={() => history.push(`/editar/${empresa.idEMPRESA}`)}
                                        >
                                            Editar
                                        </Button>
                                        <Button
                                            variant="danger"
                                            className="M-6"
                                            onClick={() => eliminarEmpresa(empresa.idEMPRESA)}
                                        >
                                            Eliminar
                                        </Button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" className="text-center">
                                    No hay empresas registradas
                                </td>
                            </tr>
                        )}
                    </tbody>
                </Table>
            </div>
        </div>
    );
};

export default Home;