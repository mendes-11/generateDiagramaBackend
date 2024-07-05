// const User = require("../model/user");
// const jwt = require("jsonwebtoken");
// require("dotenv").config();
// const bcrypt = require("bcrypt");
// const cpf  = require('cpf-cnpj-validator');
// const isValidCep = require("@brazilian-utils/is-valid-cep");

// class UserController {
//     static async register(req, res) {
//         try {
//             const { name, dateBirth, email, cpfUser, edv, cep, street, number, complement, password, confirmPassword } = req.body;

//             if (!name) return res.status(400).json({ message: "Nome é obrigatório" });
//             if (!dateBirth) return res.status(400).json({ message: "Data de nascimento é obrigatória" });
//             if (!email) return res.status(400).json({ message: "Email é obrigatório" });
//             if (!cpfUser) return res.status(400).json({ message: "CPF é obrigatório" });
//             if (!street) return res.status(400).json({ message: "Rua é brigatória" });
//             if (!number) return res.status(400).json({ message: "Numero é obrigatório" });
//             if (!complement) return res.status(400).json({ message: "Complemento necessario" });
//             if (!edv) return res.status(400).json({ message: "EDV é obrigatório" });
//             if (!password) return res.status(400).json({ message: "Senha é obrigatória" });
//             if (password !== confirmPassword) return res.status(400).json({ message: "As senhas não são iguais" });
//             if (!cep) return res.status(400).json({ message: "CEP é obrigatório" });

//             const emailExist = await User.findOne({ email: email });
//             if (emailExist) return res.status(422).json({ message: "Email já cadastrado" });
            
//             const cpfExist = await User.findOne({ cpf: cpfUser });
//             if (cpfExist) return res.status(422).json({ message: "CPF já cadastrado" });

//             const edvExist = await User.findOne({ edv: edv });
//             if (edvExist) return res.status(422).json({ message: "EDV já cadastrado" });

//             if(!cpf.isValid(cpfUser)) return res.status(422).json({ message: "CPF não existe"});

//             if(!isValidCep(cep)) return res.status(422).json({ message: "CEP é inválido" });

//             const salt = await bcrypt.genSalt(10);
//             const hashedPassword = await bcrypt.hash(password, salt);

//             const newUser = new User({
//                 name,
//                 dateBirth,
//                 email,
//                 cpf: cpfUser,
//                 edv,
//                 password: hashedPassword,
//                 cep,
//                 street,
//                 number,
//                 complement,
//                 createdAt: Date.now()
//             });

//             await newUser.save();
//             res.status(201).send({ message: "Usuário cadastrado com sucesso" });
//         } catch (error) {
//             res.status(500).send({ message: "Erro ao cadastrar", data: error.message });
//         }
//     }

//     static async login(req, res) {
//         try {
//             const { edv, password } = req.body;

//             if (!edv) return res.status(400).json({ message: "EDV é obrigatório" });
//             if (!password) return res.status(400).json({ message: "Senha é obrigatória" });

//             const user = await User.findOne({ edv: edv });
//             if (!user) return res.status(404).json({ message: "Usuário não encontrado" });

//             const isPasswordValid = await bcrypt.compare(password, user.password);
//             if (!isPasswordValid) return res.status(401).json({ message: "Senha inválida" });

//             const token = jwt.sign({ id: user._id }, process.env.SECRET, { expiresIn: '24h' });
     
//             res.status(200).json({ message: "Login bem-sucedido", token: token });
//         } catch (error) {
//             console.error(error)
//             res.status(500).send({ message: "Erro ao fazer login", data: error.message });
//         }
//     }
// }

// module.exports = UserController;


const User = require("../model/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { cpf: cpfValidator } = require('cpf-cnpj-validator');
const isValidCep = require("@brazilian-utils/is-valid-cep");

class UserController {
    static async register(req, res) {
        try {
            const { name, dateBirth, email, cpfUser, edv, cep, street, number, complement, password, confirmPassword } = req.body;

            const requiredFields = ['name', 'dateBirth', 'email', 'cpfUser', 'edv', 'cep', 'street', 'number', 'complement', 'password', 'confirmPassword'];
            for (let field of requiredFields) {
                if (!req.body[field]) {
                    return res.status(400).json({ message: `${field} é obrigatório` });
                }
            }

            if (!isValidEmail(email)) return res.status(400).json({ message: "Email inválido" });
            if (!isValidDate(dateBirth)) return res.status(400).json({ message: "Data de nascimento inválida" });
            if (!cpfValidator.isValid(cpfUser)) return res.status(400).json({ message: "CPF inválido" });
            if (!isValidCep(cep)) return res.status(400).json({ message: "CEP inválido" });ais
            if (password !== confirmPassword) return res.status(400).json({ message: "As senhas não são iguais" });

            const emailExist = await User.findOne({ email: email });
            if (emailExist) return res.status(422).json({ message: "Email já cadastrado" });

            const cpfExist = await User.findOne({ cpf: cpfUser });
            if (cpfExist) return res.status(422).json({ message: "CPF já cadastrado" });

            const edvExist = await User.findOne({ edv: edv });
            if (edvExist) return res.status(422).json({ message: "EDV já cadastrado" });
            console.log("Aqui")
            const hashedPassword = await bcrypt.hash(password, 10);

            const newUser = new User({
                name,
                dateBirth,
                email,
                cpf: cpfUser,
                edv,
                password: hashedPassword,
                cep,
                street,
                number,
                complement,
                createdAt: Date.now()
            });
            console.log("SAVE")

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
}

module.exports = UserController;

function isValidEmail(email) {
    return email.includes('@');
}


function isValidDate(date) {
    return /\d{4}-\d{2}-\d{2}/.test(date);
}
