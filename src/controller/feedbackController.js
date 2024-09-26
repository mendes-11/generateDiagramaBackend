const User = require("../model/user");
const Feedback = require("../model/feedback");
const jwt = require("jsonwebtoken");

class feedbackController {
  static async postFeedback(req, res) {
    try {
      const { userID, type, message } = req.body;

      const requiredFields = ["userID", "type", "message"];
      for (let field of requiredFields) {
        if (!req.body[field]) {
          return res.status(400).json({ message: `${field} é obrigatório` });
        }
      }
      const id = jwt.decode(userID);

      const user = await User.findById(id);
      if (!user)
        return res.status(404).json({ message: "Usuário não encontrado" });

      res.status(200).json(user);

      const newFeedback = new Feedback({
        user: userID,
        type,
        message,
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

  static async getFeedback(req, res) {
    try {
      const feedbacks = await Feedback.find();
      
      if (feedbacks.length === 0) {
        return res.status(404).json({ message: "Nenhum feedback encontrado" });
      }
  
      res.status(200).json(feedbacks);
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: "Erro ao buscar feedbacks!", error: error.message });
    }
  }
  
}

module.exports = feedbackController;
