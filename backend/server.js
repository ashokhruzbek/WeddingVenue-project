const cors = require("cors");
require("dotenv").config();
const express = require("express");
const app = express();

const { authentication } = require("./middlewares/authentication");
const authRoutes = require("./routes/authRoutes");

app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
    console.log(req.url);
    next();
  })


app.use("/", authRoutes);

app.use(authentication);


const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
    console.log(`Server ${PORT}-portda xizmatingizga muntazir 🫡  | Omad yor bo'lsin`);
});