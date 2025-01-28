import React, { useContext, useState } from "react";
import { Button, Form, Container, Row, Col } from "react-bootstrap";
import Header from "./Header";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import Plot from "react-plotly.js";
import Papa from "papaparse";
import { StateContext } from "./StateContext";
import { useLocation } from "react-router-dom/cjs/react-router-dom";

// Registrar los componentes necesarios para Chart.js
ChartJS.register(CategoryScale, LinearScale, LineElement, PointElement, Title, Tooltip, Legend);

const Dataset = () => {
  const { data, setData, chartData, setChartData } = useContext(StateContext);
  const location = useLocation();
  const showUploadOption = location.state?.showUploadOption ?? true;
  const { view3Dataset, setView3Dataset } = useContext(StateContext); // Estado para alternar entre vistas 2D y 3D

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (result) => {
          const parsedData = result.data
            .map((row) => ({
              date: new Date(row.Date),
              price: parseFloat(row.Price),
            }))
            .sort((a, b) => a.date - b.date);

          const prices = parsedData.map((d) => d.price);
          const min = Math.min(...prices);
          const max = Math.max(...prices);
          const normalizedData = parsedData.map((d) => ({
            ...d,
            normalizedPrice: (d.price - min) / (max - min),
          }));

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
        },
      });
    }
  };

  return (
    <Container fluid>
      <Header />

      <Container className="mt-5">
        <Row className="mb-4">
          <Col>
            <h2 className="text-center">Predicción de Series Temporales Mediante RNN con LSTM con TensorFlow.js</h2>
          </Col>
        </Row>

        {showUploadOption && (
          <Row className="mb-3">
            <Col md={6} className="d-flex justify-content-center">
              <Form.Group controlId="formFile" className="text-center">
                <Form.Label>Sube tu archivo CSV</Form.Label>
                <Form.Control type="file" accept=".csv" onChange={handleFileUpload} />
              </Form.Group>
            </Col>
          </Row>
        )}

        {/* Alternar entre vistas 2D y 3D */}
        <Row className="mb-3">
          <Col className="text-center">
            <Button variant="primary" onClick={() => setView3Dataset(!view3Dataset)}>
              {view3Dataset ? "Ver Gráfica 2D" : "Ver Gráfica 3D"}
            </Button>
          </Col>
        </Row>

        {chartData ? (
          view3Dataset ? (
            // Gráfica scatter 3D con Plotly.js
            <Plot
              data={[
                {
                  x: data.rawData.map((d) => d.date.toISOString().split("T")[0]), // Fechas en el eje X
                  y: data.rawData.map((d, index) => index), // Índices en el eje Y
                  z: data.rawData.map((d) => d.price), // Precios en el eje Z
                  mode: "markers",
                  marker: {
                    size: 12,
                    line: {
                      color: "rgba(217, 217, 217, 0.14)",
                      width: 0.5,
                    },
                    color: data.rawData.map((d) => d.price), // Colores según los precios
                    colorscale: "Viridis",
                    opacity: 0.8,
                  },
                  type: "scatter3d",
                },
              ]}
              layout={{
                title: "Gráfica Scatter 3D",
                autosize: true,
                scene: {
                  xaxis: { title: "Fecha" },
                  yaxis: { title: "Índice" },
                  zaxis: { title: "Precio" },
                },
                margin: { l: 0, r: 0, b: 0, t: 40 },
              }}
              style={{ width: "100%", height: "500px" }}
            />
          ) : (
            // Gráfica en 2D con Chart.js
            <div style={{ height: "400px", width: "100%" }}>
              <Line
                data={chartData}
                options={{
                  maintainAspectRatio: false,
                  plugins: {
                    legend: { position: "top" },
                    title: { display: true, text: "Histórico de Precios (2D)" },
                  },
                }}
              />
            </div>
          )
        ) : (
          <p className="text-center">Por favor sube un archivo CSV o selecciona una empresa en el CRUD.</p>
        )}
      </Container>
    </Container>
  );
};

export default Dataset;