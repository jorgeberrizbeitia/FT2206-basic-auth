const router = require("express").Router();

const {localsUpdate} = require("../middlewares/auth")

// aqui el middleware que agregará variables para saber si el usuario está activo o no
router.use(localsUpdate)

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});

const authRoutes = require("./auth.routes")
router.use("/auth", authRoutes)

const profileRoutes = require("./profile.routes")
router.use("/profile", profileRoutes)

module.exports = router;
