import React, { useState, useContext } from "react";
import { Form, Button, Row, Col, Container } from "react-bootstrap";
import { ProgressBar } from "react-bootstrap";
import Header from "./Header";
import { StateContext } from "./StateContext";
import { createWindowedDataset, splitDataset } from "./dataUtils"; // Funciones para manipulación de datos
import * as tf from "@tensorflow/tfjs";

const NeuralNetwork = () => {
  // **Acceder al contexto global para manejar datos y parámetros del modelo**
  const { data } = useContext(StateContext); // Datos normalizados para entrenamiento
  const { modelParams, setModelParams } = useContext(StateContext); // Parámetros configurables del modelo
  const { trainingProgress, setTrainingProgress } = useContext(StateContext); // Progreso del entrenamiento
  const { epochLogs, setEpochLogs } = useContext(StateContext); // Logs de cada epoch durante el entrenamiento
  const { trainedModel, setTrainedModel } = useContext(StateContext); // Modelo entrenado

  // **Manejador para actualizar los parámetros del modelo al cambiarlos en el formulario**
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setModelParams({ ...modelParams, [name]: parseFloat(value) || 0 }); // Actualiza el estado con el nuevo valor
  };

  // **Función para entrenar el modelo**
  const trainModel = async () => {
    // Verificar si los datos están disponibles
    if (!data || !data.normalizedData) {
      alert("No hay datos normalizados disponibles para entrenar. Por favor, sube un archivo válido.");
      return;
    }

    // Reiniciar progreso y logs
    setTrainingProgress(0);
    setEpochLogs([]);

    // **Crear ventanas de datos para series temporales según el tamaño de ventana seleccionado**
    const { X, y } = createWindowedDataset(data.normalizedData, modelParams.windowSize);

    // **Dividir el dataset en entrenamiento y validación**
    const { X_train, y_train, X_val, y_val } = splitDataset(X, y, modelParams.size);

    // **Definir la arquitectura del modelo LSTM**
    const model = tf.sequential();
    model.add(
      tf.layers.lstm({
        units: 64, // Unidades en la capa LSTM
        inputShape: [modelParams.windowSize, 1], // Tamaño de ventana y número de características
        kernelRegularizer: tf.regularizers.l1l2({ l1: 0.01, l2: 0.01 }), // Regularización L1 y L2
      })
    );

    // **Añadir capas ocultas densas según lo configurado**
    for (let i = 0; i < modelParams.hiddenLayers; i++) {
      model.add(tf.layers.dense({ units: 32, activation: "relu" })); // Capas densas con activación ReLU
    }

    // **Capa de salida**
    model.add(tf.layers.dense({ units: 1, activation: "linear" })); // Salida con un solo valor (predicción)

    // **Compilar el modelo**
    model.compile({
      optimizer: tf.train.adam(modelParams.learningRate), // Optimizador Adam con tasa de aprendizaje ajustable
      loss: "meanSquaredError", // Función de pérdida (error cuadrático medio)
    });

    // **Entrenar el modelo**
    await model.fit(X_train, y_train, {
      epochs: modelParams.epochs, // Número de épocas
      validationData: [X_val, y_val], // Datos de validación
      callbacks: {
        // **Callback para actualizar el progreso y logs**
        onEpochEnd: (epoch, logs) => {
          setTrainingProgress(((epoch + 1) / modelParams.epochs) * 100); // Actualiza el progreso
          setEpochLogs((prevLogs) => [
            ...prevLogs,
            { epoch: epoch + 1, loss: logs.loss.toFixed(4) }, // Guarda el log de la época
          ]);
        },
      },
    });

    // Guardar el modelo entrenado en el estado global
    setTrainedModel(model);

    alert("Entrenamiento completado.");
  };

  return (
    <Container fluid>
      {/* **Encabezado del sistema** */}
      <Header />

      <Container className="mt-5">
        <Row className="mb-4">
          <Col>
            <h2 className="text-center">Configuración del Modelo</h2>
          </Col>
        </Row>

        {/* **Formulario para configuración del modelo** */}
        <Form>
          <Row>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Size (%)</Form.Label>
                <Form.Control
                  type="number"
                  name="size"
                  value={modelParams.size}
                  onChange={handleInputChange} // Cambiar el tamaño del conjunto de entrenamiento
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Epochs</Form.Label>
                <Form.Control
                  type="number"
                  name="epochs"
                  value={modelParams.epochs}
                  onChange={handleInputChange} // Cambiar el número de épocas
                />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Learning Rate</Form.Label>
                <Form.Control
                  type="number"
                  step="0.01"
                  name="learningRate"
                  value={modelParams.learningRate}
                  onChange={handleInputChange} // Cambiar la tasa de aprendizaje
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Hidden Layers</Form.Label>
                <Form.Control
                  type="number"
                  name="hiddenLayers"
                  value={modelParams.hiddenLayers}
                  onChange={handleInputChange} // Cambiar el número de capas ocultas
                />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Window Size</Form.Label>
                <Form.Control
                  type="number"
                  name="windowSize"
                  value={modelParams.windowSize}
                  onChange={handleInputChange} // Cambiar el tamaño de ventana
                />
              </Form.Group>
            </Col>
          </Row>

          {/* **Botón para iniciar el entrenamiento** */}
          <Button variant="primary" className="mt-3" onClick={trainModel}>
            Entrenar Modelo
          </Button>
        </Form>

        {/* **Mostrar progreso y logs del entrenamiento** */}
        {trainingProgress >= 0 && (
          <div className="mt-4">
            <h5>Progreso del entrenamiento:</h5>
            <ProgressBar now={trainingProgress} label={`${trainingProgress.toFixed(2)}%`} />
            <div className="mt-3">
              {epochLogs.map((log) => (
                <p key={log.epoch}>
                  Epoch {log.epoch}: Loss = {log.loss} {/* Log de pérdida por época */}
                </p>
              ))}
            </div>
          </div>
        )}
      </Container>
    </Container>
  );
};

export default NeuralNetwork;