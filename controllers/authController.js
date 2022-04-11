const jwt = require("jsonwebtoken");
const bcryptjs = require("bcryptjs");
const conexion = require("../database/db")
const {promisify} = require("util")

// Procedimineto para registrarnos
exports.register = async (req, res) => {
    try {
        const name = req.body.name
        const user = req.body.user
        const pass = req.body.pass
        let passHash = await bcryptjs.hash(pass, 8);
        //console.log(passHash);

        conexion.query("INSERT INTO users SET ?", {user:user, name:name, pass:passHash}, (error, results) => {
            if (error){console.log(error)}
            res.redirect("/") 
        })
    } catch (error) {
        console.log(error);
    }
}

exports.login = async (req, res) => {
    try {
        const user = req.body.user
        const pass = req.body.pass

        if ( !user || !pass ) {
            res.render("login", {
                alert:true,
                alertTitle: "advertencia",
                alertMessage: "Ingrese un usuario y password",
                alertIcon: "info",
                showConfirmButton: true,
                timer: 800,
                ruta: "login"
            })
        }else{
            conexion.query("SELECT * FROM users WHERE user = ?", [user], async (error, results) => {
                if( results.lenght == 0 || ! (await bcryptjs.compare(pass, results[0].pass)) ){
                    res.render("login", {
                        alert:true,
                        alertTitle: "Error",
                        alertMessage: "Usuario y/o password incorrectas",
                        alertIcon: "error",
                        showConfirmButton: true,
                        timer: 800,
                        ruta: "login"
                    })    
                }else{
                    // Inicio de sesion OK
                    const id = results[0].id
                    const token = jwt.sign({id:id}, process.env.JWT_SECRETO, {
                        expiresIn: process.env.JWT_TIEMPO_EXPIRA,
                    })
                    // generamos el token sin fecha de expiracion
                    //const token = jwt.sign({id:id}, process.env.JWT_SECRETO)
                    console.log(`TOKEN: ${token} para el usuario: ${user}`)

                    const cookieOptions = {
                        expires: new Date(Date.now()+process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000),
                        httpOnly: true
                    }
                    res.cookie("jwt", token, cookieOptions)
                    res.render("login", {
                        alert:true,
                        alertTitle: "Conexion exitosa",
                        alertMessage: "¡LOGIN CORRECTO!",
                        alertIcon: "success",
                        showConfirmButton: false,
                        timer: 800,
                        ruta: ""
                    })  
                }
            });
        }
    } catch (error) {
        console.log(error);       
    }
}