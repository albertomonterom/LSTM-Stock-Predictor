# Predicción de Precios de Acciones utilizando Redes Neuronales LSTM

Este proyecto utiliza una **red neuronal de memoria a corto y largo plazo (LSTM)** para predecir los precios de acciones de empresas como Apple y Microsoft. La implementación se realiza utilizando **TensorFlow.js**, lo que permite ejecutar el modelo directamente en el navegador.

## Características
- **Red Neuronal LSTM**: Diseñada para la predicción de series temporales.
- **Métricas de Desempeño**:
  - **Error Absoluto Medio (MAE)**: 5.4 USD
  - **Coeficiente de Determinación (R²)**: 0.7
- **Predicción en Tiempo Real**: El modelo se puede utilizar de manera interactiva en el cliente.

## Requisitos
- Node.js (si se ejecuta fuera del navegador)
- Un navegador web moderno (compatible con TensorFlow.js)

### Librerías Utilizadas
- **TensorFlow.js**: Para implementar la red neuronal.

## Instalación

1. Clonar este repositorio:
   ```bash
   git clone https://github.com/your-username/stock-price-prediction.git
   cd stock-price-prediction
2. Instalar dependencias:
   ```bash
   npm install
2. Iniciar el servidor local:
   ```bash
   npm start

## Arquitectura del modelo
- **Capa de Entrada**: Datos de series temporales con las características fecha y precio.
- **Capas LSTM**: Capas LSTM apiladas para capturar dependencias temporales.
- **Capas LSTM**: Capas completamente conectadas para mapear las salidas de la LSTM a predicciones de precios.
- **Optimizador**: Optimizador de Adam
- **Capas LSTM**: Error Cuadrático Medio (MSE).
