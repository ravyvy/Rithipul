const aboutController = require("../controller/about.controler");

const about = (app) => {
  app.get("/api/about/getlist", aboutController.about);
  app.post("/api/about/create", aboutController.create);
  app.put("/api/about/update/:id", aboutController.update);
  app.delete("/api/about/remove/:id", aboutController.remove);
  app.get("/api/about/search", aboutController.search);

};

module.exports = about;
