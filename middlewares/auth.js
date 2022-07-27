function isLoggedIn(req, res, next) {

  if (req.session.user === undefined) {
    // el usuario no tiene una session activa
    res.redirect("/auth/login")
  } else {
    // el usuario SI tiene una session activa
    next() // continua con la ejecución de la ruta
  }

}

module.exports = isLoggedIn