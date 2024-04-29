const express = require("express");
const router = express.Router();

router.post("/", async (req, res) => {
  const { userId, address, phoneNumber } = req.body;
  try {
    await req
      .db("users")
      .where("userid", userId)
      .update({ address: address, phone_number: phoneNumber });
    res.status(200).json({ message: "User details updated successfully" });
    
  } catch (error) {
    console.error("Error updating user details:", error);
    res
      .status(500)
      .json({ error: "An error occurred while updating user details" });
  }
});

module.exports = router;
