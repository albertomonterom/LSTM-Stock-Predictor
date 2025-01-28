import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import App from "./src";
import { Provider as AlertProvider } from "react-alert";
import { StateProvider } from "./src/components/StateContext";
import AlertTemplate from "react-alert-template-basic";

const alertOptions = {
    timeout: 3000,
    positions: "top center",
}

ReactDOM.render(
    <BrowserRouter>
        <AlertProvider template={AlertTemplate} {...alertOptions}>
            <StateProvider>
                <App />
            </StateProvider>
        </AlertProvider>
    </BrowserRouter>,
    document.getElementById("app")
);
