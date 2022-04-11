const express = require("express");
const { append } = require("express/lib/response");
const router = express.Router();

const authController = require("../controllers/authController")

// Router para las vistas
router.get("/", (req, res) => {
    res.render("index");
})
router.get("/login", (req, res) => {
    res.render("login", {alert:false});
})
router.get("/register", (req, res) => {
    res.render("register");
})

// Router para los metodos del controlador
router.post("/register", authController.register)
router.post("/login", authController.login)


module.exports = router;