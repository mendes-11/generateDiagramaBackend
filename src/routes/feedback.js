const express = require("express");
const router = express.Router();
const feedbackController = require("../controller/feedbackController")


router
    .post("/createFeedback", feedbackController.postFeedback)
    .get("/getFeedback", feedbackController.getFeedback)


module.exports = router;