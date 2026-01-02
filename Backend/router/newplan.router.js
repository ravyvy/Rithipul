const newplanController = require("../controller/newplan.controler");

const newplans = (app) => {
  app.get("/api/newplan/getlist", newplanController.newplan);
  app.post("/api/newplan/create", newplanController.create);
  app.put("/api/newplan/update/:id", newplanController.update);
  app.delete("/api/newplan/remove/:id", newplanController.remove);
  app.get("/api/newplan/search", newplanController.search);

};

module.exports = newplans;
