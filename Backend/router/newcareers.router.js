const careersController = require("../controller/newcareers.controler");

const careers = (app) => {
  app.get("/api/careers/getlist",  careersController.getlist);
  app.post("/api/careers/create",careersController.create);
  app.put("/api/careers/update/:id", careersController.update);
  app.delete("/api/careers/remove/:id", careersController.remove);
  app.get("/api/careers/search/", careersController.search);

};

module.exports = careers;
