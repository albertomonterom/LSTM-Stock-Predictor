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

1. **Ejecutar el archivo SQL**:
   - Antes de iniciar cualquier otro servicio, asegúrate de tener la base de datos configurada. Importa el archivo SQL en tu base de datos para crear las tablas necesarias.
   - Puedes hacerlo ejecutando el archivo en tu sistema de gestión de bases de datos preferido (por ejemplo, MySQL, PostgreSQL, etc.).

2. **Configurar el Backend**:
   - Navega a la carpeta del backend:
     ```bash
     cd backend
     ```
   - Instala las dependencias necesarias:
     ```bash
     npm install
     ```
   - Inicia el servidor backend:
     ```bash
     npm start
     ```

3. **Configurar el Frontend**:
   - Navega a la carpeta del frontend:
     ```bash
     cd frontend
     ```
   - Instala las dependencias necesarias:
     ```bash
     npm install
     ```
   - Inicia el servidor frontend:
     ```bash
     npm start
     ```

4. **Acceder a la Aplicación**:
   - Una vez que tanto el backend como el frontend estén en funcionamiento, abre tu navegador y ve a la URL correspondiente `http://localhost:5500`.
   - El backend debería estar disponible en `http://localhost:9999`.

## Arquitectura del modelo
- **Capa de Entrada**: Datos de series temporales con las características fecha y precio.
- **Capas LSTM**: Capas LSTM apiladas para capturar dependencias temporales.
- **Capas LSTM**: Capas completamente conectadas para mapear las salidas de la LSTM a predicciones de precios.
- **Optimizador**: Optimizador de Adam
- **Capas LSTM**: Error Cuadrático Medio (MSE).
