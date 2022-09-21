const router = require("express").Router();
const Pin = require("../models/Pin");
const asyncHandler = require("express-async-handler");

//create a Pin

router.post("/", asyncHandler(async (req, res) => {
  const newPin = new Pin(req.body);
  try {
    const savedPin = await newPin.save();
    res.status(200).json(savedPin);
  } catch (error) {
    res.status(400).json(error);
  }
}));

//get all pins

router.get("/", async (req, res) => {
  try {
    const pins = await Pin.find();
    res.status(200).json(pins);
  } catch (error) {
    res.status(400).json(error);
  }
});

module.exports = router;
