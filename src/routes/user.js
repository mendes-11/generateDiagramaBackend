const express = require("express");
const router = express.Router();
const UserController = require("../controller/userController")

router
    .post("/register", UserController.register)
    .post("/login", UserController.login)
    .get("/", UserController.getUser)
    .put("/",UserController.updateUser)
    .delete("/delete", UserController.deleteUser)

module.exports = router;