const serviceController = require("../controller/services.controler");

const home = (app) => {
  // homepage
  app.get("/api/homepage/getlist", serviceController.homepage);
  app.post("/api/homepage/create", serviceController.create);
  app.put("/api/homepage/update/:id", serviceController.update);
  app.delete("/api/homepage/remove/:id", serviceController.remove);
  app.get("/api/homepage/search" , serviceController.seacrh)
};

module.exports = home;
