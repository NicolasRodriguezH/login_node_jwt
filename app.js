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

app.listen(8000, () => {
    console.log("Server UP running in http://localhost:8000");
});