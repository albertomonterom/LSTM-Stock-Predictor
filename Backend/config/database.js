const { Sequelize } = require('sequelize');

// Conexión a la base de datos 'usuarios'
const sequelizeUsuarios = new Sequelize('usuarios', 'root', '1234', {
    host: 'localhost',
    dialect: 'mysql',
    port: 3306
});

// Conexión a la base de datos 'empresas'
const sequelizeEmpresas = new Sequelize('empresas', 'root', '1234', {
    host: 'localhost',
    dialect: 'mysql',
    port: 3306
});

// Prueba de conexión
const initDatabases = async () => {
    try {
        await sequelizeUsuarios.authenticate();
        console.log("Conexión exitosa a la base de datos 'usuarios'");

        await sequelizeEmpresas.authenticate();
        console.log("Conexión exitosa a la base de datos 'empresas'");
    } catch (error) {
        console.error("Error conectando a las bases de datos:", error);
    }
};

module.exports = { sequelizeUsuarios, sequelizeEmpresas, initDatabases };
