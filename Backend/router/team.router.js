const teamController = require("../controller/team.controler");

const team = (app) => {
  app.get("/api/team/getlist", teamController.getlist);
  app.post("/api/team/create", teamController.create);
  app.put("/api/team/update/:id", teamController.update);
  app.delete("/api/team/remove/:id", teamController.remove);
  app.get("/api/team/search/", teamController.seacrhTeam);

};

module.exports = team;
