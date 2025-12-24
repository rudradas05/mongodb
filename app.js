//jshint esversion:6
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
// const encrypt = require("mongoose-encryption");
// const md5 = require("md5");
const bcrypt = require("bcrypt");
const saltRounds = 10;

const app = express();

// console.log(process.env.API_KEY);

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));

mongoose
  .connect()
  .then(() => console.log("DB connected"))
  .catch((err) => {
    console.error(err);
  });


const userSchema = new mongoose.Schema({
  email: String,
  password: String,
});

// userSchema.plugin(encrypt, {
//   secret: process.env.SECRET,
//   encryptedFields: ["password"],
// });

const User = new mongoose.model("User", userSchema);

app.get("/", function (req, res) {
  res.render("home");
});

app.get("/login", function (req, res) {
  res.render("login");
});

app.get("/register", function (req, res) {
  res.render("register");
});

app.post("/register", function (req, res) {
  bcrypt.hash(req.body.password, saltRounds, function (err, hash) {
    const newUser = new User({
      email: req.body.username,
      password: hash,
    });
    newUser
      .save()
      .then(() => {
        res.render("secrets");
      })
      .catch((err) => {
        console.log(err);
      });
  });
});

// app.post("/login", function (req, res) {
//   const username = req.body.username;
//   const password = req.body.password;
//   try {
//     const user = User.findOne({ email: username });
//     if (user) {
//       if (user.password === password) {
//         res.render("secrets");
//       }
//     } else {
//       res.send("Invalid credentials");
//     }
//   } catch (error) {
//     console.log(error);
//     res.send("Server error");
//   }
// });

const loginUser = async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  try {
    const user = await User.findOne({ email: username });
    if (user) {
      if (
        await bcrypt.compare(password, user.password, function (err, result) {
          if (result) {
            res.render("secrets");
          } else {
            res.send("Invalid credentials");
          }
        })
      ) {
        // res.render("secrets");
      } else {
        res.send("Invalid credentials");
      }
    } else {
      res.send("User not found");
    }
  } catch (error) {
    console.log(error);
    res.send("Server error");
  }
};

app.post("/login", loginUser);

app.listen(3000, function () {
  console.log("Server is running on port 3000");
});

