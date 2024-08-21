const User = require("../model/user");
const Feedback = require("../model/feedback");

class feedbackController {
  static async postFeedback(req, res) {
    try {
      const { userID, type, message, score } = req.body;

      const requiredFields = ["userID", "type", "message", "score"];
      for (let field of requiredFields) {
        if (!req.body[field]) {
          return res.status(400).json({ message: `${field} é obrigatório` });
        }
      }

      const user = await User.findById(userID);
      if (!user)
        return res.status(404).json({ message: "Usuário não encontrado" });

      res.status(200).json(user);

      const newFeedback = new Feedback({
        user: userID,
        type,
        message,
        score,
        date: Date.now(),
      });

      await newFeedback.save();
      res.status(201).send({ message: "Feedback feito com sucesso" });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .send({ message: "Erro ao receber o feedback!", error: error.message });
    }
  }
}

module.exports = feedbackController;
