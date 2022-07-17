const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
//REGISTER
router.post("/register", async (req, res) => {
  try {
    try {
      const { username, password } = req.body;

      if (!(password && username)) {
        return res.status(400).send("Input all required fields");
      }

      // check if user exists
      const oldUser = await User.findOne({ username });

      if (oldUser) {
        return res.status(409).send("User Already Exist. Please Login");
      }

      // create password hash
      encryptedPassword = await bcrypt.hash(password, 10);

      // create new user
      const user = await User.create({
        username: username,
        password: encryptedPassword,
      });

      const token = jwt.sign(
        { userId: user._id, username },
        process.env.TOKEN_KEY,
        {
          expiresIn: "2h",
        }
      );

      user.token = token;

      return res.status(200).json(user);
    } catch (err) {
      console.log(err);
    }
  } catch (err) {
    return res.status(500).json(err);
  }
});

//LOGIN
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!(username && password)) {
      return res.status(400).send("All input is required");
    }

    // check for user
    const user = await User.findOne({ username });

    // authenticate user
    if (user && (await bcrypt.compare(password, user.password))) {
      const token = jwt.sign(
        { userId: user._id, username },
        process.env.TOKEN_KEY,
        {
          expiresIn: "2h",
        }
      );

      user.token = token;

      return res.status(200).json({
        token,
        user,
      });
    }
    return res.status(400).send("Invalid Credentials");
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
