const path = require('path');
require('dotenv').config({ path: path.join(__dirname, 'database', '.env') });
const express = require('express');
const cors = require('cors');

const app = express();
const port = 1000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.send('Server is running successfully!');
});
// home page
const serviceRouter = require("./router/services.router");
serviceRouter(app);
// new plan
const newplans = require("./router/newplan.router");
newplans(app);

// team
const team = require("./router/team.router");
team(app);

// about
const about = require("./router/about.router");
about(app);

// admin
const admin = require("./router/admin.router");
admin(app);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
