const express = require("express");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");

const app = express();

// Seteamos motor de plantillas
app.set("view engine", "ejs");

// Seteamos la carpeta public para archivos estaticos
app.use(express.static("public"));

// Para procesar datos enviads desde form
app.use(express.urlencoded({extended:true}));
app.use(express.json());

// Seteamos las variables de entorno
dotenv.config({path: "./env/.env"});

// Para poder trabajar con las cookies
app.use(cookieParser())

// Llamar al rputer
app.use("/", require("./routes/router"));

// Para eliminar el cache y que no se pueda vovler con el boton de back luego de que hacemos un LOGOUT
app.use(function(req, res, next) {
    if(!req.user)
    res.header('cache-control', 'private, no-cache, no-store, must-revalidate');
    next();
});

app.listen(8000, () => {
    console.log("Server UP running in http://localhost:8000");
});