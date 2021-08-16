const { Router } = require("express");
const router = Router();
const bcrypt = require("bcrypt");
const { User } = require("../src/db/models");

router
  .route("/")
  .get((req, res) => {
    if (req.query.err) {
      res.locals.err = "Не найден логин или пароль";
      res.render("loginPage", { error: res.locals.err });
    }
    res.render("loginPage");
  })
  .post(async (req, res) => {
    const { email, password } = req.body;
    if (email && password) {
      const currentUser = await User.findOne({ where: { email } });
      if (
        currentUser &&
        currentUser.id === 1 &&
        password === currentUser.password
      ) {
        const role = {};
        if (currentUser.role === "admin") role.admin = true;
        if (currentUser.role === "manager") role.manager = true;
        if (currentUser.role === "user") role.user = true;
        req.session.user = {
          id: currentUser.id,
          name: currentUser.name,
          role: role,
          roomid: currentUser.roomId,
        };
        return res.redirect("/mainPage");
      }
      if (
        currentUser &&
        (await bcrypt.compare(password, currentUser.password))
      ) {
        const role = {};
        if (currentUser.role === "admin") role.admin = true;
        if (currentUser.role === "manager") role.manager = true;
        if (currentUser.role === "user") role.user = true;
        req.session.user = {
          id: currentUser.id,
          name: currentUser.name,
          role: role,
          roomid: currentUser.roomId,
        };
        return res.redirect("/mainPage");
      } else {
        return res.redirect("/?err=true");
      }
    } else {
      return res.redirect("/?err=true");
    }
  });

module.exports = router;
