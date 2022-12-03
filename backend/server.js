const express = require("express");
const dotenv = require("dotenv").config();
const mongoose = require("mongoose");
const port = process.env.PORT || 5000;
const pinRoute = require("./routes/pins");
const userRoute = require("./routes/users");

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config({path: __dirname+'/.env'});
}


const app = express();

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("MongoDB connected");
  })
  .catch((err) => console.log(err));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/api/pins", pinRoute);
app.use("/api/users", userRoute);

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend', 'build')));
  app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend', 'build', 'index.html'));
  })
}

app.listen(port, () => console.log(`server started on port ${port}`));
