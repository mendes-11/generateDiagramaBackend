const express = require("express");
const router = express.Router();
const UserController = require("../controller/userController")

router
    .post("/register", UserController.register)
    .post("/login", UserController.login)
    .get("/:id", UserController.getUser)
    .put("/:id",UserController.updateUser)
    .delete("/:id", UserController.deleteUser)

module.exports = router;