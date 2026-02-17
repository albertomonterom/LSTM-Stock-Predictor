# Stock Price Prediction using LSTM Neural Networks

This project implements a **Long Short-Term Memory (LSTM)** neural network to forecast stock prices for companies such as Apple and Microsoft. The model is built using **TensorFlow.js**, enabling real-time inference directly in the browser.

---

## 📌 Project Overview

The system models financial time-series data using deep learning techniques.  
It captures temporal dependencies in historical stock price sequences to generate short-term predictions.

---

## 🚀 Key Features

- **LSTM Neural Network**  
  Designed specifically for time-series forecasting tasks.

- **Performance Metrics**
  - **Mean Absolute Error (MAE):** 5.4 USD  
  - **Coefficient of Determination (R²):** 0.7  

- **Real-Time Prediction**  
  Interactive client-side inference powered by TensorFlow.js.

---

## 🛠 Tech Stack

- **TensorFlow.js** – LSTM model implementation  
- **Node.js** – Backend server  
- **JavaScript / React** – Frontend interface  
- **SQL Database** – Data storage and management  

---

## 📦 Installation

### 1️⃣ Database Setup

Before starting the application, import the provided SQL file into your preferred database management system (e.g., MySQL, PostgreSQL) to create the required tables.

---

### 2️⃣ Backend Setup

```bash
cd backend
npm install
npm start
```

The backend server will run at:
```bash
http://localhost:9999
```
