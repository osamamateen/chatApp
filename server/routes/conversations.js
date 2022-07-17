const router = require("express").Router();
const Conversation = require("../models/Conversation");
const auth = require("../middleware/auth");

// create a new Conversation
router.post("/", auth, async (req, res) => {
  try {
    // search for existing conversation
    const conversation = await Conversation.find({
      members: { $all: [req.body.senderId, req.body.receiverId] },
    });

    // if conversation does not exist
    if (!conversation || !conversation.length) {
      // create a new conversation
      const newConversation = new Conversation({
        members: [req.body.senderId, req.body.receiverId],
      });

      const savedConversation = await newConversation.save();
      if (savedConversation) return res.status(200).json([savedConversation]);
    } else {
      return res.status(200).json(conversation);
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
});

// get conversations of the given user
router.get("/:userId", auth, async (req, res) => {
  try {
    const conversation = await Conversation.find({
      members: { $in: [req.params.userId] },
    });
    return res.status(200).json(conversation);
  } catch (err) {
    return res.status(500).json(err);
  }
});

module.exports = router;
