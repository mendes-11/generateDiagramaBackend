const User = require("../model/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { cpf: cpfValidator } = require('cpf-cnpj-validator');
const isValidCep = require("@brazilian-utils/is-valid-cep");

class UserController {
    static async register(req, res) {
        try {
            const { name, dateBirth, email, cpf, edv, cep, street, number, complement, password, confirmPassword } = req.body;
            // VEREFICA SE ELES FORAM INSERIDOS NO BODY.
            const requiredFields = ['name', 'dateBirth', 'email', 'cpf', 'edv', 'cep', 'street', 'number', 'complement', 'password', 'confirmPassword'];
            for (let field of requiredFields) {
                if (!req.body[field]) {
                    return res.status(400).json({ message: `${field} é obrigatório` });
                }
            }
            if (!isValidEmail(email)) return res.status(400).json({ message: "Email inválido" });
            if (!isValidDate(dateBirth)) return res.status(400).json({ message: "Data de nascimento inválida" });
            if (!cpfValidator.isValid(cpf)) return res.status(400).json({ message: "CPF inválido" });
            if (!isValidCep(cep)) return res.status(400).json({ message: "CEP inválido" });
            if (password !== confirmPassword) return res.status(400).json({ message: "As senhas não são iguais" });

            const emailExist = await User.findOne({ email: email });
            if (emailExist) return res.status(422).json({ message: "Email já cadastrado" });

            const cpfExist = await User.findOne({ cpf: cpf });
            if (cpfExist) return res.status(422).json({ message: "CPF já cadastrado" });

            const edvExist = await User.findOne({ edv: edv });
            if (edvExist) return res.status(422).json({ message: "EDV já cadastrado" });

            const hashedPassword = await bcrypt.hash(password, 10);

            const newUser = new User({
                name,
                dateBirth,
                email,
                cpf,
                edv,
                password: hashedPassword,
                cep,
                street,
                number,
                complement,
                createdAt: Date.now()
            });

            await newUser.save();
            res.status(201).send({ message: "Usuário cadastrado com sucesso" });
        } catch (error) {
            console.error(error);
            res.status(500).send({ message: "Erro ao cadastrar usuário", error: error.message });
        }
    }

    static async login(req, res) {
        try {
            const { edv, password } = req.body;

            if (!edv || !password) return res.status(400).json({ message: "EDV e senha são obrigatórios" });

            const user = await User.findOne({ edv: edv });
            if (!user) return res.status(404).json({ message: "Usuário não encontrado" });

            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) return res.status(401).json({ message: "Senha inválida" });

            const token = jwt.sign({ id: user._id }, process.env.SECRET, { expiresIn: '24h' });
     
            res.status(200).json({ message: "Login bem-sucedido", token: token });
        } catch (error) {
            console.error(error);
            res.status(500).send({ message: "Erro ao fazer login", error: error.message });
        }
    }

    static async getUser(req, res){
        const { id } = req.query;
        try{
            const user = await User.findById(id);
            if(!user) return res.status(404).json({ message: "Usuário não encontrado" })
            res.status(200).json(user); 
        } catch (error) {
            return res.status(500).send({ menssage: "Erro ao retornar o usuário", error: error.menssage });
        }

    }

    static async updateUser(req, res) {
        const { id } = req.query;
        const updateFields = req.body;
    
        try {
            
            if (!id) return res.status(400).json({ message: "É necessário fornecer um ID para atualizar o usuário" });
    
            const user = await User.findById(id);
            if (!user) return res.status(404).json({ message: "Usuário não encontrado" });
    
            Object.keys(updateFields).forEach(key => {
                user[key] = updateFields[key];
            });
    
            await user.save();
    
            res.status(200).json({ message: "Usuário atualizado com sucesso", updatedUser: user });
    
        } catch (error) {
            res.status(500).send({ message: "Erro ao atualizar usuário", error: error.message });
        }
    }
    

    static async deleteUser(req, res){
        const { id } = req.query;
        try{
            const userID = await User.findById(id);
            if(!userID) return res.status(404).json({ message: "Usuário não encontrado" });

            await User.findByIdAndDelete(id);
            res.status(201).send({ message: "Usuário deletado", userID });

        } catch (error){
            return res.status(500).send({ message: "Erro ao deletar usuário", error: error.message });
        }
    }
}

module.exports = UserController;

function isValidEmail(email) {
    return email.includes('@');
}


function isValidDate(date) {
    return /\d{4}-\d{2}-\d{2}/.test(date);
}
