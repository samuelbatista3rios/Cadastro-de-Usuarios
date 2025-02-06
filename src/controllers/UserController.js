const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

module.exports = {
    async register(req, res) {
        try {
            const { name, email, password } = req.body;

            const existingUser = await User.findOne({ email });
            if (existingUser) {
                return res.status(400).json({ error: "Usuário já cadastrado" });
            }

            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            const user = await User.create({ name, email, password: hashedPassword });

            return res.status(201).json({
                message: "Usuário registrado com sucesso!",
            });
        } catch (err) {
            return res.status(400).json({ error: "Erro ao cadastrar usuário" });
        }
    },


    async getAllUsers(req, res) {
        try {
            const users = await User.find({}, "-password");
            res.json(users);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Erro ao buscar usuários" });
        }
    },
    async delete(req, res) {
        try {
            const userId = req.params.id;

            const user = await User.findById(userId);
            if (!user) {
                return res.status(404).json({ message: "Usuário não encontrado" });
            }

            await User.deleteOne({ _id: userId });

            return res.json({ message: "Usuário deletado com sucesso!" });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Erro no servidor" });
        }
    },
    async login(req, res) {
        try {
            const { email, password } = req.body;
            const user = await User.findOne({ email });

            if (!user || !(await bcrypt.compare(password, user.password))) {
                return res.status(400).json({ error: "Credenciais inválidas" });
            }

            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
                expiresIn: "1h",
            });

            return res.json({ user, token });
        } catch (err) {
            return res.status(500).json({ error: "Erro no login" });
        }
    },
};
