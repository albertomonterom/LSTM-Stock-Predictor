import React, { useState, useContext } from "react";
import { Container, Row, Col, Button, Table } from "react-bootstrap";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
} from "chart.js";
import Header from "./Header";
import { createWindowedDataset, splitDataset } from "./dataUtils";
import { StateContext } from "./StateContext";

// Registrar los componentes necesarios para Chart.js
ChartJS.register(Title, Tooltip, Legend, LineElement, CategoryScale, LinearScale, PointElement);

const Prediction = () => {
  const { trainedModel, data, modelParams } = useContext(StateContext);
  const { predictions, setPredictions } = useContext(StateContext);
  const { realValues, setRealValues } = useContext(StateContext);
  const { chartDataP, setChartDataP } = useContext(StateContext);

  const denormalize = (normalizedValue, min, max) => {
    return normalizedValue * (max - min) + min;
  };

  const predict = async () => {
    if (!trainedModel) {
      alert("No hay un modelo entrenado disponible.");
      return;
    }
    console.log("Trained Model:", trainedModel);
  
    if (!data.normalizedData) {
      alert("No hay datos normalizados disponibles.");
      return;
    }
    console.log("Normalized Data:", data.normalizedData);
  
    // Preparar los datos de prueba
    const { X, y } = createWindowedDataset(data.normalizedData, modelParams.windowSize);
    const { X_test, y_test } = splitDataset(X, y, modelParams.size);
    console.log("X_test:", X_test);
    console.log("y_test:", y_test);
  
    // Realizar predicciones con el modelo
    const pred = trainedModel.predict(X_test);
    const predValues = Array.from(pred.dataSync());
    console.log("Predicciones:", predValues);

    // Denormalizar las predicciones
    const denormalizedPredictions = predValues.map(pred => denormalize(pred, data.min, data.max));
    console.log("Predicciones Denormalizadas:", denormalizedPredictions);

    // Denormalizar los valores reales
    const denormalizedRealValues = Array.from(y_test.dataSync()).map(value =>
      denormalize(value, data.min, data.max)
    );
    console.log("Valores Reales Denormalizados:", denormalizedRealValues);
  
    const startIndex = data.rawData.length - denormalizedRealValues.length;
    const predictionDates = data.rawData
      .slice(startIndex, startIndex + denormalizedRealValues.length)
      .map((d) => d.date.toISOString().split("T")[0]);

    console.log("Start Index:", startIndex);
    console.log("Fechas desde rawData:", data.rawData.slice(startIndex, startIndex + denormalizedRealValues.length).map(d => d.date));
    console.log("Cantidad de predicciones:", denormalizedRealValues.length);

    // Actualizar estados
    setPredictions(denormalizedPredictions);
    setRealValues(denormalizedRealValues);
  
    const chartDataLocal = {
      labels: predictionDates,
      datasets: [
        {
          label: "Valores Reales Denormalizados",
          data: denormalizedRealValues,
          borderColor: "rgb(1, 109, 109)",
          borderWidth: 1,
        },
        {
          label: "Predicciones Denormalizadas",
          data: denormalizedPredictions,
          borderColor: "rgb(255, 0, 55)",
          borderWidth: 1,
        },
      ],
    };
    setChartDataP(chartDataLocal);
    console.log("Predictions length:", denormalizedPredictions.length);
    console.log("Real values length:", denormalizedRealValues.length);
  };

  return (
    <Container fluid>
      <Header />
      <Container className="mt-5">
        <Row className="mb-4">
          <Col>
            <h2 className="text-center">Predicciones del Modelo</h2>
          </Col>
        </Row>
        <Row className="mb-4">
          <Col>
            <Button variant="primary" onClick={predict}>
              Realizar Predicción
            </Button>
          </Col>
        </Row>
        {realValues.length > 0 && predictions.length > 0 && (
          <>
            <Row className="mb-5">
              <Col style={{ maxHeight: "400px", overflowY: "scroll" }}>
                <Table striped bordered hover responsive>
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Valor Real Denormalizado</th>
                      <th>Valor Predicho Denormalizado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {realValues.map((value, index) => (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{value.toFixed(4)}</td>
                        <td>{predictions[index]?.toFixed(4)}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Col>
            </Row>
            <div style={{ height: "400px", width: "100%" }}>
              <Line
                data={chartDataP}
                options={{
                  maintainAspectRatio: false,
                  plugins: {
                    legend: { position: "top" },
                    title: { display: true, text: "Comparación: Valores Reales vs Predicciones" },
                  },
                  scales: {
                    x: { title: { display: true, text: "Fechas" } },
                    y: { title: { display: true, text: "Valores Denormalizados" } },
                  },
                }}
              />
            </div>
          </>
        )}
      </Container>
    </Container>
  );
};

export default Prediction;