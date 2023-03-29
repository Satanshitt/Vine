const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.render("home", {
    error: req.flash("error"),
    message: req.flash("message"),
    info: req.flash("info"),
    danger: req.flash("danger"),
  });
});

router.get("*", (req, res) => {
  req.flash(
    "error",
    "Esta página no parece existir. Es posible que haya seguido un enlace incorrecto o haya escrito mal la dirección."
  );
  res.redirect("/");
});

module.exports = router;
