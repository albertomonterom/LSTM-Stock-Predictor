import React, { Suspense } from "react";
import { Switch, Route } from "react-router-dom";
import Login from "./components/Login";
import 'bootstrap/dist/css/bootstrap.min.css';
import "./styles/styles.css";

const Home = React.lazy(() => import("./components/Home"));
const Alumno = React.lazy(() => import("./components/Alumno"));
const Profesor = React.lazy(() => import("./components/Profesor"));
const Administrador = React.lazy(() => import("./components/Administrador"));
const Registro = React.lazy(() => import("./components/Registro"));
const InfoEmpresa = React.lazy(() => import("./components/InfoEmpresas"));
const ActualizarEmpresa = React.lazy(() => import("./components/ActualizarEmpresa"));
const Dataset = React.lazy(() => import("./components/Dataset"));
const NeuralNetwork = React.lazy(() => import("./components/NeuralNetwork"));
const Prediction = React.lazy(() => import("./components/Prediction"));
const FuturePrediction = React.lazy(() => import("./components/FuturePrediction"));

const App = () => {
    return (
        <div>
            <Switch>
                {/* Ruta para el login */}
                <Route exact path="/">
                    <Login />
                </Route>

                {/* Rutas para usuarios */}
                <Suspense fallback={<div>Cargando...</div>}>
                    <Route exact path="/Proyecto/home">
                        <Home />
                    </Route>
                    <Route exact path="/Proyecto/administrador">
                        <Administrador />
                    </Route>
                    <Route exact path="/Proyecto/profesor">
                        <Profesor />
                    </Route>
                    <Route exact path="/Proyecto/alumno">
                        <Alumno />
                    </Route>

                    {/* Rutas para el CRUD */}
                    <Route exact path="/Proyecto/registro">
                        <Registro />
                    </Route>
                    <Route exact path="/info/:id">
                        <InfoEmpresa />
                    </Route>
                    <Route exact path="/editar/:id">
                        <ActualizarEmpresa />
                    </Route>
                    <Route exact path="/Proyecto/dataset">
                        <Dataset />
                    </Route>
                    <Route exact path="/Proyecto/neural-network">
                        <NeuralNetwork />
                    </Route>
                    <Route exact path="/Proyecto/prediction">
                        <Prediction />
                    </Route>
                    <Route exact path="/Proyecto/future-prediction">
                        <FuturePrediction />
                    </Route>
                </Suspense>

                {/* Ruta para manejar errores 404 */}
                <Route path="*" render={() => <h1>RECURSO NO ENCONTRADO</h1>} />
            </Switch>
        </div>
    );
};

export default App;
