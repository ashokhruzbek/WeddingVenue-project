const cors = require("cors");
require("dotenv").config();
const express = require("express");
const app = express();

// Routers
const authRoutes = require("./routes/auth/authRoutes");
const adminRouter = require("./routes/admin/adminRoutes");
const userRouter = require("./routes/user/userRoutes");
const ownerRouter = require("./routes/owner/ownerRoutes");
const venueRouter = require("./routes/venuesRouter/venuesRouter");

app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
    console.log(req.url);
    next();
});

// Statik papka (uploads ichidagi fayllarni brauzerga ko'rsatish uchun)
app.use('/uploads', express.static('uploads'));

app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRouter);
app.use('/api/user', userRouter);
app.use('/api/owner', ownerRouter );
app.use('/api/venues', venueRouter);

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
    console.log(`Server ${PORT}-portda xizmatingizga muntazir 🫡  | Omad yor bo'lsin`);
});
