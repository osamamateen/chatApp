const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
//REGISTER
router.post("/register", async (req, res) => {
  try {
    console.log("1");
    // Our register logic starts here
    try {
      // Get user input
      const { username, password } = req.body;

      console.log(username, password);
      // Validate user input
      if (!(password && username)) {
        return res.status(400).send("Input all required fields");
      }

      // check if user already exist
      // Validate if user exist in our database
      const oldUser = await User.findOne({ username });

      if (oldUser) {
        console.log("oldUser", oldUser);
        return res.status(409).send("User Already Exist. Please Login");
      }
      //Encrypt user password
      encryptedPassword = await bcrypt.hash(password, 10);
      console.log("encryptedPassword", encryptedPassword);
      // Create user in our database
      const user = await User.create({
        username: username, // sanitize: convert email to lowercase
        password: encryptedPassword,
      });
      console.log("user", user);
      // Create token
      const token = jwt.sign(
        { userId: user._id, username },
        process.env.TOKEN_KEY,
        {
          expiresIn: "2h",
        }
      );

      console.log("token", token);
      // save user token
      user.token = token;

      // return new user
      return res.status(200).json(user);
    } catch (err) {
      console.log(err);
    }
    // Our register logic ends here
  } catch (err) {
    return res.status(500).json(err);
  }
});

//LOGIN
router.post("/login", async (req, res) => {
  // Our login logic starts here
  try {
    // Get user input
    const { username, password } = req.body;

    // Validate user input
    if (!(username && password)) {
      return res.status(400).send("All input is required");
    }
    // Validate if user exist in our database
    const user = await User.findOne({ username });

    if (user && (await bcrypt.compare(password, user.password))) {
      // Create token
      const token = jwt.sign(
        { userId: user._id, username },
        process.env.TOKEN_KEY,
        {
          expiresIn: "2h",
        }
      );

      // save user token
      user.token = token;

      // user
      return res.status(200).json({
        token,
        user,
      });
    }
    return res.status(400).send("Invalid Credentials");
  } catch (err) {
    console.log(err);
  }
  // Our register logic ends here
});

module.exports = router;
