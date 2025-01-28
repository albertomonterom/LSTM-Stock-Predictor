import React, { useEffect, useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import axios from "axios";

const InfoEmpresa = () => {
    const { id } = useParams();
    const [empresa, setEmpresa] = useState(null);
    const [precios, setPrecios] = useState([]);
    const history = useHistory();

    useEffect(() => {
        const obtenerEmpresa = async () => {
            try {
                // Obtener datos de la empresa
                const response = await axios.get(`http://localhost:9999/empresa/${id}`);
                setEmpresa(response.data);

                // Obtener precios de acciones asociados a la empresa
                const preciosResponse = await axios.get(`http://localhost:9999/empresa/${id}/precios`);
                setPrecios(preciosResponse.data);
            } catch (error) {
                console.error("Error al obtener la empresa: ", error);
            }
        };

        obtenerEmpresa();
    }, [id]);

    if (!empresa) {
        return <p>Cargando información de la empresa...</p>;
    }

    return (
        <div className="info-container">
            <div className="info-card">
                <h1 className="info-title">Información de la Empresa</h1>
                <div className="info-details">
                    <p><strong>ID:</strong> {empresa.idEMPRESA}</p>
                    <p><strong>Nombre:</strong> {empresa.NOMBRE}</p>
                </div>
                <div className="info-prices">
                    <h2>Precios de Acciones</h2>
                    {precios.length > 0 ? (
                        <ul>
                            {precios.map((precio) => (
                                <li key={precio.idPRECIO}>
                                    <strong>Fecha:</strong> {precio.FECHA} - <strong>Precio:</strong> {precio.PRECIO}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>No hay precios registrados para esta empresa.</p>
                    )}
                </div>
                <button
                    className="info-button"
                    onClick={() => history.push("/Proyecto/administrador")}
                >
                    Regresar
                </button>
            </div>
        </div>
    );
};

export default InfoEmpresa;