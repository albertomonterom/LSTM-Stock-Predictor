import React, { useState, useContext, useEffect } from "react";
import { Container, Row, Col, Button, Form } from "react-bootstrap";
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
import { StateContext } from "./StateContext";
import * as tf from "@tensorflow/tfjs";

// Registrar los componentes necesarios para Chart.js
ChartJS.register(Title, Tooltip, Legend, LineElement, CategoryScale, LinearScale, PointElement);

const FuturePrediction = () => {
  const { trainedModel, data, modelParams } = useContext(StateContext);
  const { futurePredictions, setFuturePredictions } = useContext(StateContext);
  const { futureChartData, setFutureChartData } = useContext(StateContext);

  const [futureSteps, setFutureSteps] = useState(2); // Pasos futuros

  const denormalize = (normalizedValue, min, max) => {
    return normalizedValue * (max - min) + min;
  };

  const predictFuture = async () => {
    if (!trainedModel) {
      alert("No hay un modelo entrenado disponible.");
      return;
    }
    if (!data.normalizedData) {
      alert("No hay datos normalizados disponibles.");
      return;
    }

    const { normalizedData, min, max } = data;

    const windowSize = modelParams.windowSize;
    if (normalizedData.length < windowSize) {
      alert(`No hay suficientes datos para la ventana de tamaño ${windowSize}`);
      return;
    }

    let inputSequence = normalizedData.slice(-modelParams.windowSize).map((d) => d.normalizedPrice); // Última ventana

    console.log("Input sequence:", inputSequence);
    console.log("Input sequence shape:", inputSequence.length);

    // Renombré la variable local para evitar el conflicto
    const newFuturePredictions = [];
    for (let i = 0; i < futureSteps; i++) {
      const inputTensor = tf.tensor3d(inputSequence, [1, modelParams.windowSize, 1]);
      const prediction = trainedModel.predict(inputTensor);
      const predictedValue = prediction.dataSync()[0]; // Valor normalizado
      newFuturePredictions.push(predictedValue);

      // Actualizar la secuencia de entrada
      inputSequence = [...inputSequence.slice(1), predictedValue];
    }

    // Denormalizar las predicciones
    const denormalizedPredictions = newFuturePredictions.map((pred) => denormalize(pred, min, max));

    // Generar fechas futuras
    const lastDate = new Date(data.rawData[data.rawData.length - 1].date);
    const futureDates = Array.from({ length: futureSteps }, (_, i) => {
      const date = new Date(lastDate);
      date.setDate(date.getDate() + i + 1); // Incrementar días
      return date.toISOString().split("T")[0];
    });

    // Actualizar gráfica
    const chartDataLocal = {
      labels: futureDates,
      datasets: [
        {
          label: "Predicciones Futuras",
          data: denormalizedPredictions,
          borderColor: "rgb(255, 99, 132)",
          borderWidth: 1,
        },
      ],
    };

    // Actualizar el estado global con las predicciones denormalizadas
    setFuturePredictions(denormalizedPredictions);
    setFutureChartData(chartDataLocal);
  };

  return (
    <Container fluid>
      <Header />
      <Container className="mt-5">
        <Row className="mb-4">
          <Col>
            <h2 className="text-center">Predicción Futura</h2>
          </Col>
        </Row>
        <Row className="mb-4">
          <Col md={6}>
            <Form.Group>
              <Form.Label>Pasos Futuros</Form.Label>
              <Form.Control
                type="number"
                value={futureSteps}
                onChange={(e) => setFutureSteps(Number(e.target.value))}
              />
            </Form.Group>
          </Col>
          <Col md={6} className="d-flex align-items-center">
            <Button variant="primary future-prediction-button" onClick={predictFuture}>
              Predecir
            </Button>
          </Col>
        </Row>
        {futurePredictions.length > 0 && futureChartData && (
          <div style={{ height: "400px", width: "100%" }}>
            <Line
              data={futureChartData}
              options={{
                maintainAspectRatio: false,
                plugins: {
                  legend: { position: "top" },
                  title: { display: true, text: "Predicciones Futuras" },
                },
                scales: {
                  x: { title: { display: true, text: "Fechas" } },
                  y: { title: { display: true, text: "Valores Denormalizados" } },
                },
              }}
            />
          </div>
        )}
      </Container>
    </Container>
  );
};

export default FuturePrediction;