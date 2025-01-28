import React, { useEffect, useState, useContext } from "react";
import { Table, Button } from "react-bootstrap";
import axios from "axios";
import { useHistory } from "react-router-dom";
import { StateContext } from "./StateContext";

const Administrador = () => {
    const [empresas, setEmpresas] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);
    const [preciosVistos, setPreciosVistos] = useState({});
    const { setData, setChartData } = useContext(StateContext);
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
                        };
                    })
                );

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

    const handleVerMasPrecios = (empresaId) => {
        setPreciosVistos((prev) => ({
            ...prev,
            [empresaId]: (prev[empresaId] || 5) + 5, // Aumentamos la cantidad de precios mostrados
        }));
    };

    const handleProbar = async (empresaId) => {
        try {
            const response = await axios.get(`http://localhost:9999/empresa/${empresaId}/precios`);
            const precios = response.data;
    
            const parsedData = precios
                .map((row) => ({
                    date: new Date(row.FECHA),
                    price: parseFloat(row.PRECIO),
                }))
                .sort((a, b) => a.date - b.date);
            
            // Normalizar los datos
            const prices = parsedData.map((d) => d.price);
            const min = Math.min(...prices);
            const max = Math.max(...prices);
            const normalizedData = parsedData.map((d) => ({
              ...d,
              normalizedPrice: (d.price - min) / (max - min),
            }));
    
            // Actualizar el contexto con los datos procesados
            setData({ rawData: parsedData, normalizedData, min, max });
            setChartData({
                labels: parsedData.map((d) => d.date.toISOString().split("T")[0]),
                datasets: [
                  {
                    label: "Price",
                    data: parsedData.map((d) => d.price),
                    borderColor: "blue",
                    borderWidth: 1,
                  },
                ],
            });
            history.push({
                pathname: "/Proyecto/dataset",
                state: { showUploadOption: false },
            });
        } catch (error) {

        }
    }

    return (
        <div className="crud-container">
            <h1 className="AlignCenterCRUD">CRUD de Empresas</h1>
            <div className="button-group">
                <Button
                    variant="success"
                    className="M-6"
                    onClick={() => history.push("/Proyecto/registro")}
                >
                    Registrar Nueva Empresa
                </Button>
                <Button
                    variant="primary"
                    className="M-6"
                    onClick={() => history.push("/Proyecto/dataset")}
                >
                    Cargar CSV
                </Button>
            </div>
            <div className="table-container">
                <Table striped bordered hover className="table-crud">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nombre</th>
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
                                    <td>
                                        {empresa.precios.slice(0, preciosVistos[empresa.idEMPRESA] || 5).map((precio) => (
                                            <div key={precio.idPRECIO}>
                                                {precio.FECHA}: {precio.PRECIO}
                                            </div>
                                        ))}
                                        {empresa.precios.length > (preciosVistos[empresa.idEMPRESA] || 5) && (
                                            <span
                                                onClick={() => handleVerMasPrecios(empresa.idEMPRESA)}
                                                className="ver-mas-precios"
                                            >
                                                Ver más precios...
                                            </span>
                                        )}
                                    </td>
                                    <td className="actions-column">
                                        <Button
                                            variant="info"
                                            className="btn-crud-ver"
                                            onClick={() => history.push(`/info/${empresa.idEMPRESA}`)}
                                        >
                                            Ver
                                        </Button>
                                        <Button
                                            variant="warning"
                                            className="btn-crud-editar"
                                            onClick={() => history.push(`/editar/${empresa.idEMPRESA}`)}
                                        >
                                            Editar
                                        </Button>
                                        <Button
                                            variant="danger"
                                            className="btn-crud-eliminar"
                                            onClick={() => eliminarEmpresa(empresa.idEMPRESA)}
                                        >
                                            Eliminar
                                        </Button>
                                        <Button
                                            variant="success"
                                            className="btn-crud-probar"
                                            onClick={() => handleProbar(empresa.idEMPRESA)}
                                        >
                                            Probar
                                        </Button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" className="text-center">
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

export default Administrador;
