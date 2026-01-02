const adminController = require("../controller/admin.controler");
const { validate_token } = require("../auth/middle");

const admin = (app) => {

  // login
  app.post("/api/admin/login", adminController.login);
  app.post("/api/admin/create" , adminController.create)

  // protected route example
  app.get("/api/admin/profile", validate_token(), (req, res) => {
    res.json({
      message: "Welcome Admin",
      user: req.user
    });
  });

};

module.exports = admin;
