const cors = require("cors");
require("dotenv").config();
const express = require("express");
const app = express();

// const { authentication } = require("./middlewares/authentication");
const authRoutes = require("./routes/auth/authRoutes");
const adminRouter = require("./routes/admin/adminRoutes");
const { authentication } = require("./middlewares/authentication");
const userRouter = require("./routes/user/userRoutes");
const ownerRouter = require("./routes/owner/ownerRoutes");

app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
    console.log(req.url);
    next();
  })


app.use("/", authRoutes);


app.use(authentication);


app.use("/admin", adminRouter);
app.use('/user', userRouter);
app.use('/owner', ownerRouter )


const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
    console.log(`Server ${PORT}-portda xizmatingizga muntazir 🫡  | Omad yor bo'lsin`);
});