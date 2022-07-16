const User = require("../models/User");
const router = require("express").Router();
const bcrypt = require("bcrypt");
const auth = require("../middleware/auth");

//get a user
router.get("/", auth, async (req, res) => {
  const { userId, username } = req.query;
  try {
    let query = {};

    if (userId) {
      query = {
        _id: { $ne: userId },
      };
    }
    if (username) {
      query = {
        ...query,
        username,
      };
    }
    const users = await User.find(query).select({
      username: 1,
      _id: 1,
    });
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json(err);
  }
});

//get friends
router.get("/:userId", auth, async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    const { password, updatedAt, ...other } = user._doc;
    res.status(200).json(other);

    res.status(200).json(friendList);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
