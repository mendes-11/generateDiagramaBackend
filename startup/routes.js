const express = require("express");
const user = require("../src/routes/user");
const feedback = require("../src/routes/feedback")


module.exports = function (app) {
    app.use(express.json())
        .use("/api/user", user)
        .use("/api/feedback", feedback)
        
}