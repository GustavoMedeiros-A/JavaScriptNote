var express = require('express');
var router = express.Router();
const User = require("../models/user");
const jwt = require("jsonwebtoken");
require("dotenv").config(); //Make the variables available to us
const secret = process.env.JWT_TOKEN;


router.post("/register", async(req, res) => {
  const { name, email, password } = req.body;
  const user = new User({ name, email, password });
  try {
    await user.save();
    res.status(200).json({user:user});
  } catch (error) {
    res.status(500).json(error)
  }
})

router.post("/login", async (req, res) => {
  const { email, password} = req.body;
  const maxAge = 3 *24 *60 *60;
  try {
    const user = await User.login(email, password);
    const token = jwt.sign({email}, secret, {expiresIn: maxAge})
    res.json({user: user, token:token})
  } catch (error) {
    res.status(500).json({error: "Incorrect email or password"})
  }

})



module.exports = router;
