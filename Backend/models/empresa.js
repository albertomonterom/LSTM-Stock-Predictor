const { DataTypes } = require('sequelize');
const { sequelizeEmpresas } = require('../config/database');

const Empresa = sequelizeEmpresas.define('Empresa', {
    idEMPRESA: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    NOMBRE: {
        type: DataTypes.STRING,
        allowNull: false,
    },
}, {
    tableName: 'empresas',
    timestamps: false,
});

const PrecioAccion = sequelizeEmpresas.define('PrecioAccion', {
    idPRECIO: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    idEMPRESA: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Empresa,
            key: 'idEMPRESA',
        },
    },
    FECHA: {
        type: DataTypes.DATEONLY,
        allowNull: false,
    },
    PRECIO: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
}, {
    tableName: 'precios_acciones',
    timestamps: false,
});

Empresa.hasMany(PrecioAccion, { foreignKey: 'idEMPRESA', as: 'precios' });
PrecioAccion.belongsTo(Empresa, { foreignKey: 'idEMPRESA', as: 'empresa' });

const initEmpresas = async () => {
    await sequelizeEmpresas.sync();
    const empresas = await Empresa.bulkCreate([
        { NOMBRE: 'Empresa A' },
        { NOMBRE: 'Empresa B' },
        { NOMBRE: 'Empresa C' },
    ], { ignoreDuplicates: true });

    // Inicializar precios diarios con diferentes meses para cada empresa
    const now = new Date();

    for (let i = 0; i < 30; i++) {
        const precios = [
            {
                idEMPRESA: empresas[0].idEMPRESA,
                FECHA: new Date(now.getFullYear(), now.getMonth(), now.getDate() + i).toISOString().split('T')[0],
                PRECIO: 5000 + 150 * Math.sin(i * Math.PI / 6) + (Math.random() * 200 - 100),
            },
            {
                idEMPRESA: empresas[1].idEMPRESA,
                FECHA: new Date(now.getFullYear(), now.getMonth() + 1, now.getDate() + i).toISOString().split('T')[0],
                PRECIO: 3500 + 100 * Math.sin(i * Math.PI / 8) + (Math.random() * 150 - 75),
            },
            {
                idEMPRESA: empresas[2].idEMPRESA,
                FECHA: new Date(now.getFullYear(), now.getMonth() + 2, now.getDate() + i).toISOString().split('T')[0],
                PRECIO: 11000 + 300 * Math.sin(i * Math.PI / 10) + (Math.random() * 300 - 150),
            },
        ];
        await PrecioAccion.bulkCreate(precios);
    }
};

module.exports = { Empresa, PrecioAccion, initEmpresas };