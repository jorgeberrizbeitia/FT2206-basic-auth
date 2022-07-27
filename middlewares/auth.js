function isLoggedIn(req, res, next) {

  if (req.session.user === undefined) {
    // el usuario no tiene una session activa
    res.redirect("/auth/login")
  } else {
    // el usuario SI tiene una session activa
    next() // continua con la ejecución de la ruta
  }
}

function isAdmin(req, res, next) {
  if (req.session.user.role === "admin") {
    next()
  } else {
    res.redirect("/auth/login")
  }
}

// module.exports = isLoggedIn
module.exports = {
  isLoggedIn,
  isAdmin
}