// express
const express = require("express");
const app = express();
app.use(express.json());

// cors
const cors = require("cors");
app.use(cors());

// backend routes
app.use("/api", require("./src/api/index.js"));

// PORT
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});

module.exports = app;