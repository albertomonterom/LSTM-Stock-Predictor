const express = require("express");
const cors = require("cors");
const { initDatabases } = require("./config/database");
const { initUsers } = require("./models/user");
const { initEmpresas } = require("./models/empresa");

const app = express();
const puerto = 9999;

app.use(express.json());
app.use(
    cors({
        origin: "*",
        methods: ["GET", "POST", "PUT", "DELETE"],
        allowedHeaders: ["Content-Type", "Authorization"],
    })
);

(async () => {
    await initDatabases();
    await initUsers();
    await initEmpresas();
    console.log("Base de datos inicializada");

    app.listen(puerto, () => {
        console.log(`Servidor corriendo en el puerto ${puerto}`);
    });
})();

// Importar modelos
const { Empresa, PrecioAccion } = require("./models/empresa"); // Modelo para la tabla de empresas
const { User } = require("./models/user"); // Modelo para la tabla de usuarios

// RUTAS PARA EMPRESAS

// Obtener todas las empresas
app.get("/empresas", async (req, res) => {
    try {
        const empresas = await Empresa.findAll();
        res.status(200).json(empresas);
    } catch (error) {
        console.error("Error al obtener empresas:", error);
        res.status(500).json({ status: "error", message: "Error al obtener empresas" });
    }
});

// Obtener una empresa por ID
app.get("/empresa/:id", async (req, res) => {
    try {
        const empresa = await Empresa.findByPk(req.params.id);
        if (empresa) {
            res.status(200).json(empresa);
        } else {
            res.status(404).json({ status: "error", message: "Empresa no encontrada" });
        }
    } catch (error) {
        console.error("Error al obtener empresa:", error);
        res.status(500).json({ status: "error", message: "Error al obtener empresa" });
    }
});

// Crear una nueva empresa
app.post("/empresa", async (req, res) => {
    try {
        const { NOMBRE } = req.body;
        if (!NOMBRE) {
            return res.status(400).json({ status: "error", message: "Datos incompletos" });
        }

        const nuevaEmpresa = await Empresa.create({ NOMBRE });
        res.status(201).json(nuevaEmpresa);
    } catch (error) {
        console.error("Error al crear empresa:", error);
        res.status(500).json({ status: "error", message: "Error al crear empresa" });
    }
});

// Actualizar una empresa por ID
app.put("/empresa/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { NOMBRE } = req.body;

        const empresa = await Empresa.findByPk(id);
        if (empresa) {
            empresa.NOMBRE = NOMBRE || empresa.NOMBRE;
            await empresa.save();
            res.status(200).json(empresa);
        } else {
            res.status(404).json({ status: "error", message: "Empresa no encontrada" });
        }
    } catch (error) {
        console.error("Error al actualizar empresa:", error);
        res.status(500).json({ status: "error", message: "Error al actualizar empresa" });
    }
});

// Eliminar una empresa por ID
app.delete("/empresa/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const empresa = await Empresa.findByPk(id);

        if (empresa) {
            await empresa.destroy();
            res.status(200).json({ status: "success", message: "Empresa eliminada" });
        } else {
            res.status(404).json({ status: "error", message: "Empresa no encontrada" });
        }
    } catch (error) {
        console.error("Error al eliminar empresa:", error);
        res.status(500).json({ status: "error", message: "Error al eliminar empresa" });
    }
});

// RUTAS PARA PRECIOS DE ACCIONES

// Obtener todos los precios de una empresa
app.get("/empresa/:id/precios", async (req, res) => {
    try {
        const precios = await PrecioAccion.findAll({
            where: { idEMPRESA: req.params.id },
        });
        res.status(200).json(precios);
    } catch (error) {
        console.error("Error al obtener precios: ", error);
        res.status(500).json({ status: "error", message: "Error al obtener precios" });
    }
});

// Crear un nuevo precio de acción
app.post("/empresa/:id/precio", async (req, res) => {
    try {
        const { id } = req.params;
        const { FECHA, PRECIO } = req.body;

        if (!FECHA || !PRECIO) {
            return res.status(400).json({ status: "error", message: "Datos incompletos" });
        }
        
        const nuevoPrecio = await PrecioAccion.create({
            idEMPRESA: id,
            FECHA,
            PRECIO
        });

        res.status(201).json(nuevoPrecio);
    } catch (error) {
        console.error("Error al crear precio: ", error);
        res.status(500).json({ status: "error", message: "Error al crear precio" });
    }
});

// Actualizar un precio de acción
app.put("/precio/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { FECHA, PRECIO } = req.body;

        const precio = await PrecioAccion.findByPk(id);

        if (precio) {
            precio.FECHA = FECHA || precio.FECHA;
            precio.PRECIO = PRECIO || precio.PRECIO;
            await precio.save();
            res.status(200).json(precio);
        } else {
            res.status(404).json({ status: "error", message: "Precio no encontrado" });
        }
    } catch (error) {
        console.error("Error al actualizar precio: ", error);
        res.status(500).json({ status: "error", message: "Error al actualizar precio" });
    }
});

// Eliminar un precio de acción
app.delete("/precio/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const precio = await PrecioAccion.findByPk(id);

        if (precio) {
            await precio.destroy();
            res.status(200).json({ status: "success", message: "Precio eliminado" });
        } else {
            res.status(404).json({ status: "error", message: "Precio no encontrado" });
        }
    } catch (error) {
        console.error("Error al eliminar precio: ", error);
        res.status(500).json({ status: "error", message: "Error al eliminar precio" });
    }
});

/* Rutas para manejar login */

// Login de usuario
app.post("/login", async (req, res) => {
    try {
        const { USERNAME, PASSWORD } = req.body;
        if (!USERNAME || !PASSWORD) {
            return res.status(400).json({ status: "error", message: "Credenciales incompletas" });
        }

        const user = await User.findOne({
            where: { USERNAME, PASSWORD },
        });

        if (user) {
            res.status(200).json({ status: "success", tipo: user.TIPOUSUARIO });
        } else {
            res.status(401).json({ status: "error", message: "Credenciales incorrectas" });
        }
    } catch (error) {
        console.error("Error al iniciar sesión:", error);
        res.status(500).json({ status: "error", message: "Error al procesar login" });
    }
});

// Obtener todos los usuarios (opcional)
app.get("/usuarios", async (req, res) => {
    try {
        const usuarios = await User.findAll();
        res.status(200).json(usuarios);
    } catch (error) {
        console.error("Error al obtener usuarios:", error);
        res.status(500).json({ status: "error", message: "Error al obtener usuarios" });
    }
});

// Ruta de prueba para verificar el servidor
app.get("/", (req, res) => {
    res.status(200).json({ status: "success", message: "Servidor funcionando correctamente" });
});