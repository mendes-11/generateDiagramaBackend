const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    type: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    score: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: Date.now
    }
});

const Feedback = mongoose.model('feedback', feedbackSchema);

module.exports = Feedback;
