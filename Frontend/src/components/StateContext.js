import React, { createContext, useState } from "react";

// Crear el contexto
export const StateContext = createContext();

// Proveedor del contexto
export const StateProvider = ({ children }) => {
  const [view3Dataset, setView3Dataset] = useState(false);
  const [data, setData] = useState({
    rawData: null, // Datos originales
    normalizedData: null, // Datos normalizados
    min: null, // Mínimo valor (para denormalizar después)
    max: null, // Máximo valor (para denormalizar después)
  });
  const [chartData, setChartData] = useState(null);
  const [modelParams, setModelParams] = useState({
    size: 70,
    epochs: 100,
    learningRate: 0.01,
    hiddenLayers: 3,
    windowSize: 3,
  });
  const [trainingProgress, setTrainingProgress] = useState(0);
  const [epochLogs, setEpochLogs] = useState([]);
  const [trainedModel, setTrainedModel] = useState(null);
  const [predictions, setPredictions] = useState([]);
  const [realValues, setRealValues] = useState([]);
  const [chartDataP, setChartDataP] = useState(null);
  const [futurePredictions, setFuturePredictions] = useState([]);
  const [futureChartData, setFutureChartData] = useState(null);

  return (
    <StateContext.Provider value={{ view3Dataset, setView3Dataset, data, setData, chartData, setChartData, modelParams, setModelParams, trainingProgress, setTrainingProgress, epochLogs, setEpochLogs, trainedModel, setTrainedModel, predictions, setPredictions, realValues, setRealValues, chartDataP, setChartDataP, futurePredictions, setFuturePredictions, futureChartData, setFutureChartData }}>
      {children}
    </StateContext.Provider>
  );
};