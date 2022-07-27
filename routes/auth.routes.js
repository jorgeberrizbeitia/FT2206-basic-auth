const router = require("express").Router();
const User = require("../models/User.model.js")
const bcrypt = require('bcryptjs');

// GET "/auth/signup" => renderizar el formulario de registro
router.get("/signup", (req, res, next) => {
  res.render("auth/signup.hbs")
})

// POST "/auth/signup" => Recibir la informacion del usuario y crear el perfil en DB
router.post("/signup", async (req, res, next) => {
  // console.log(req.body)
  const {username, email, password} = req.body

  // VALIDACIONES DE BACKEND

  // CG => que el usuario no ha llenado alguno de los campos
  if (username === "" || email === "" || password === "") {
    res.render("auth/signup.hbs", {
      errorMessage: "Debes llenar todos los campos"
    })
    return; // de aqui en adelante no ejecutas más nada de la funcion.
  }

  // CG => la contraseña debe ser suficientemente fuerte
  // if (password.length < 10)
  // Expresiones regulares => .test
  let passwordRegex = /((?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W]).{8,64})/
  if (passwordRegex.test(password) === false) {
    res.render("auth/signup.hbs", {
      errorMessage: "La contraseña debe tener al menos una mayuscula, minuscula, número y caracter especial. Y más de 8 caracteres de largo"
    })
    return; // de aqui en adelante no ejecutas más nada de la funcion.
  }

  // aqui puedes seguir haciendo otras validaciones => clausulas de guardia


  try {
    
    // CG => aqui haremos la validacion de si el usuario ya está creado
    const foundUser = await User.findOne({ email })
    if (foundUser !== null) {
      res.render("auth/signup.hbs", {
        errorMessage: "Usuario ya registrado"
      })
      return; // de aqui en adelante no ejecutas más nada de la funcion.
    } 

    // CG => aqui haremos la validacion de si el nombre de usuario ya ha sido usado
    const foundUserByUsername = await User.findOne({ username })
    if (foundUserByUsername !== null) {
      res.render("auth/signup.hbs", {
        errorMessage: "El nombre ya ha sido usado, cambiarlo :)"
      })
      return; // de aqui en adelante no ejecutas más nada de la funcion.
    } 

    console.log("Todas las validaciones han sido checkeadas!")

    // Cifrar la contraseña del usuario porque somos buenos desarrolladores :)
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)
    // console.log(hashedPassword)

    // crear el usuario y guardarlo en la base de datos
    await User.create({
      username,
      email,
      password: hashedPassword
    })

    res.redirect("/auth/login")

  } catch(err) {
    next(err)
  }
})

// GET "/auth/login" => renderizar el formulario de acceso a la pagina
router.get("/login", (req, res, next) => {
  res.render("auth/login.hbs")
})

// POST "/auth/login" => Verificar las credenciales del usuario y permitir acceso
router.post("/login", async (req, res, next) => {

  console.log(req.body)
  const { acceso, password } = req.body

  // que los datos no esten vacios
  if (acceso === "" || password === "") {
    res.render("auth/login.hbs", {
      errorMessage: "Debes llenar todos los datos"
    })
    return;
  }


  try {
    // 1. Buscar  el usuario registrado
    const foundUser = await User.findOne({$or: [{username: acceso}, {email: acceso}]})
    console.log(foundUser)

    if (foundUser === null) {
      res.render("auth/login.hbs", {
        errorMessage: "Usuario no encontrado"
      })
      return;
    }
  
    // 2. Validar la contraseña
    const isPasswordValid = await bcrypt.compare(password, foundUser.password)
    console.log("isPasswordValid", isPasswordValid)

    if (isPasswordValid === false) {
      res.render("auth/login.hbs", {
        errorMessage: "Contraseña invalida"
      })
      return;
    }
  
    // El usuario es quien dice ser. El usuario ha sido autenticado.
    // 3. Permitir acceso a la aplicacion. Abrir una sesión de usuario.
    // ya tenemos configurado los paquetes de express-session y mongo-connect

    // esta linea de codigo general la session que será guardada en la DB
    // ... y tambien la informacion de la cookie que será enviada al cliente.
    req.session.user = {
      _id: foundUser._id,
      email: foundUser.email,
      username: foundUser.username,
      role: foundUser.role
    }
  
    // espera a que la session/cookie haya sido creada correctamente antes de enviar respuesta al usuario
    req.session.save(() => {
      res.redirect("/profile") // 404
    })
    
  } catch (err) {
    next(err)
  }

})

// GET "/auth/logout" => le permite al usuario cerrar sesssion
router.get("/logout", (req, res, next) => {

  req.session.destroy(() => {
    res.redirect("/")
  })

})


module.exports = router;