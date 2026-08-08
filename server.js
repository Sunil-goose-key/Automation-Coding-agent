const express = require("express");
const LoginPage = require("./login");

const app = express();
app.use(express.json());

app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

app.post("/login", (req, res) => {
  const { username, password } = req.body || {};
  const page = new LoginPage();
  page.setUsername(username);
  page.setPassword(password);
  const result = page.login();
  res.status(result.success ? 200 : 400).json(result);
});

const port = process.env.PORT || 3000;
if (require.main === module) {
  app.listen(port, () => console.log(`Server listening on port ${port}`));
}

module.exports = app;
