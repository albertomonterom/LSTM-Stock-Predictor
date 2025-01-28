// Login.js
import React from "react";
import { Redirect } from "react-router-dom";
import { withAlert } from "react-alert";

class Login extends React.Component {
  constructor() {
    super();
    this.state = {
      condition: false,
      tipousuario: "",
      usuario: "",
      password: "",
      isLoading: false,
      errorVisible: false,
    };
  }

  validar = (usuario, password) => {
    if (this.state.isLoading) return;
  
    this.setState({ isLoading: true });
  
    // Enviar solicitud POST al backend para validar credenciales
    fetch("http://localhost:9999/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ USERNAME: usuario, PASSWORD: password }),
    })
      .then((response) => {
        // Verificar si la respuesta tiene un código de estado válido
        if (!response.ok) {
          if (response.status === 401) {
            // Credenciales incorrectas
            throw new Error("Credenciales incorrectas");
          }
          throw new Error("Error de conexión con el servidor");
        }
        return response.json();
      })
      .then((usuario) => {
        if (usuario.status === "success") {
          // Mostrar alerta de éxito
          this.props.alert.show("Inicio de sesión exitoso", { type: "success" });
  
          // Configurar redirección basada en el tipo de usuario
          if (usuario.tipo === "administrador") {
            this.setState({ condition: true, tipousuario: "administrador" });
          } else if (usuario.tipo === "profesor") {
            this.setState({ condition: true, tipousuario: "profesor" });
          } else if (usuario.tipo === "alumno") {
            this.setState({ condition: true, tipousuario: "alumno" });
          }
        }
      })
      .catch((error) => {
        // Manejar diferentes tipos de errores
        if (error.message === "Credenciales incorrectas") {
          if (!this.state.errorVisible) {
            this.props.alert.show("Usuario o contraseña incorrectos", {
              type: "error",
            });
          }
        } else {
          if (!this.state.errorVisible) {
            this.props.alert.show("Error de conexión con el servidor", {
              type: "error",
            });
          }
        }
        this.setState({ errorVisible: true });
        setTimeout(() => this.setState({ errorVisible: false }), 3000); // Reiniciar errorVisible
      })
      .finally(() => {
        this.setState({ isLoading: false });
      });
  };
  

  handleInputChange = (e) => {
    const { value, name } = e.target;
    this.setState({
      [name]: value,
    });
  };

  render() {
    const styles = {
      padding: "5px",
    };

    const { condition, tipousuario, usuario, password } = this.state;

    // Redirigir según el tipo de usuario
    if (condition && tipousuario === "administrador") {
      return <Redirect to="/Proyecto/administrador" />;
    }
    if (condition && tipousuario === "profesor") {
      return <Redirect to="/Proyecto/profesor" />;
    }
    if (condition && tipousuario === "alumno") {
      return <Redirect to="/Proyecto/alumno" />;
    }

    return (
      <div className="login-container">
        <div className="login-box">
          <h1>Somos Trend Lens</h1>
          <p>Por favor, inicie sesión en su cuenta</p>
          <form>
            <div className="form-group">
              <label htmlFor="usuario">Usuario</label>
              <input
                type="text"
                id="usuario"
                name="usuario"
                value={usuario}
                onChange={this.handleInputChange}
                placeholder="Ingrese el usuario"
                className="form-control"
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={password}
                onChange={this.handleInputChange}
                placeholder="Ingrese su contraseña"
                className="form-control"
              />
            </div>
            <button
              type="button"
              onClick={() => this.validar(usuario, password)}
              className="button-login"
            >
              Login
            </button>
          </form>
          <h2 className="title-members">Integrantes</h2>
          <ul className="list-names">
            <li>Medellín Niño Andrea</li>
            <li>Montero Molina Alberto</li>
            <li>Pérez Núñez Rubén Gabriel</li>
          </ul>
        </div>
      </div>
    )
  }
}

// Envolver el componente Login en withAlert para permitir el uso de alertas
export default withAlert()(Login);
