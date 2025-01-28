const { DataTypes } = require('sequelize');
const { sequelizeUsuarios } = require('../config/database'); // Importa la conexión a la base de datos 'usuarios'

const User = sequelizeUsuarios.define('User', {
    idLOGIN: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    USERNAME: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    PASSWORD: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    TIPOUSUARIO: {
        type: DataTypes.STRING,
        allowNull: true,
    }
}, {
    tableName: 'login',
    timestamps: false
});

const initUsers = async () => {
    await sequelizeUsuarios.sync();
    await User.bulkCreate(
        [
            { USERNAME: 'admin', PASSWORD: '1234', TIPOUSUARIO: 'administrador' },
            { USERNAME: 'profesor', PASSWORD: '12345', TIPOUSUARIO: 'profesor' },
            { USERNAME: 'alumno', PASSWORD: '123456', TIPOUSUARIO: 'alumno' },
        ],
        { ignoreDuplicates: true }
    );
}

module.exports = { User, initUsers };
