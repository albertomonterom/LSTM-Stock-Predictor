import * as tf from "@tensorflow/tfjs";

export const createWindowedDataset = (data, windowSize) => {
  const X = [];
  const y = [];
  for (let i = windowSize; i < data.length; i++) {
    const window = data.slice(i - windowSize, i).map((d) => d.normalizedPrice);
    X.push(window);
    y.push(data[i].normalizedPrice);
  }

  const formattedX = X.map((window) => window.map((value) => [value]));

  return {
    X: tf.tensor3d(formattedX, [formattedX.length, windowSize, 1]),
    y: tf.tensor2d(y, [y.length, 1]),
  };
};

// Dividir los datos en entrenamiento, validación y prueba
export const splitDataset = (X, y, size) => {
  const trainSize = Math.floor((size / 100) * X.shape[0]);
  const valSize = Math.floor((X.shape[0] - trainSize) / 2);
  const X_train = X.slice([0, 0, 0], [trainSize, X.shape[1], X.shape[2]]);
  const y_train = y.slice([0, 0], [trainSize, y.shape[1]]);
  const X_val = X.slice([trainSize, 0, 0], [valSize, X.shape[1], X.shape[2]]);
  const y_val = y.slice([trainSize, 0], [valSize, y.shape[1]]);
  const X_test = X.slice([trainSize + valSize, 0, 0], [
    X.shape[0] - trainSize - valSize,
    X.shape[1],
    X.shape[2],
  ]);
  const y_test = y.slice([trainSize + valSize, 0], [
    y.shape[0] - trainSize - valSize,
    y.shape[1],
  ]);
  return { X_train, y_train, X_val, y_val, X_test, y_test };
};
