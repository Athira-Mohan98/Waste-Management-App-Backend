const ReplySchema = require("../Model/ReplyModel");
const ContactSchema = require('../Model/ContactModel');


//admin to user
exports.sendResponse = async (req, res) => {

  const { email, response } = req.body
  if (!email || !response) {

    res.status(400).json("Email and response are required")
  }
  else {
    try {
      const newResponse = await ReplySchema.create({ email, response,sender: "admin",recipient: "user" })
      console.log(newResponse);

      await ContactSchema.updateMany({ email }, { $set: { status: "Reviewed" } });
      global.io.emit(`reply-${email}`, {
        response,
        timestamp: new Date()
      });
      global.io.emit("new-admin-reply", {
        response,
        email,
        timestamp: new Date()
      });
      res.status(200).json("Response send successfully")

    } catch (error) {
      res.status(500).json(error)
    }
  }
}

exports.getUserReplies = async (req, res) => {
  try {
    const email = req.user.email
    const replies = await ReplySchema.find({ email }).sort({ createdAt: -1 });
    res.status(200).json(replies);
  } catch (err) {
    res.status(500).json("Failed to get reply")
  }
};


exports.deleterequests = async (req, res) => {
  try {
    const userId = req.params.id
    console.log(userId);

    const deleted = await ReplySchema.findByIdAndDelete(userId)
    if (!deleted)
      res.status(404).json("Unable to find details")
    else {
      res.status(200).json( "message deleted successfully" )

    }
  } catch (error) {
    res.status(500).json(error);
  }
}


exports.getAgentReply = async (req, res) => {
  try {
   const replies = await ReplySchema.find({email: "agent@gmail.com",sender: "admin"}).sort({ createdAt: -1 });
    res.status(200).json(replies);
  } catch (err) {
    res.status(500).json("Failed to get reply")
  }
};


exports.deleteagentrequests = async (req, res) => {
  try {
    const userId = req.params.id
    console.log(userId);

    const deleted = await ReplySchema.findByIdAndDelete(userId)
    if (!deleted)
      res.status(404).json("Unable to find ")
    else {
      res.status(200).json({ message: "message deleted successfully" })

    }
  } catch (error) {
    res.status(500).json(error);
  }
}
