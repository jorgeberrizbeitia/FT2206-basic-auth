const router = require("express").Router();

const {isLoggedIn, isAdmin} = require("../middlewares/auth.js")

router.get("/", isLoggedIn, (req, res, next) => {


  // if (req.session.user === undefined) {
  //   // el usuario no tiene una sesion
  //   res.redirect("/auth/login")
  //   return
  // }
  // ! mejorado en el middleware isLoggedIn

  // EN TODAS LAS RUTAS DE MI CODIGO yo tendre acceso a req.session.user
  // el usuario que esta activo y usando la app en esta solicitud
  console.log(req.session.user)
  console.log("probando!")
  let myVar = "patata"
  res.render("profile/private.hbs")


})

router.get("/admin", isLoggedIn, isAdmin, (req, res, next) => {
  res.render("profile/admin.hbs")
})


module.exports = router;