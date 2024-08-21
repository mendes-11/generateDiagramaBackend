const mongoose = require("mongoose");

const user = mongoose.model(
    "user",
    new mongoose.Schema({
        name: {
            type: String,
            requerid: true
        },
        email: {
            type: String,
            required: true
        },
        cpf: {
            type: String,
            required: true
        },
        edv: {
            type: String,
            required: true
        },
        cep: {
            type: String,
            required: true,
        },
        street: {
            type: String,
            required: true
        },
        number: {
            type: String,
            required: true
        },
        password: {
            type: String,
            required: true
        },
        countDiagrams: {
            type: Number,
            required: true
        },
        createdAt: {
            type: Date,
            default: Date.now
        }

    })
);

module.exports = user;