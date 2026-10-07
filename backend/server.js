import express from "express";

import "dotenv/config";
import livrosroutes from "./routes/livrosroutes.js";
import corsMiddleware from "./middlewares/corsMidware.js";
import { testarConexao } from "./database/conexao.js";

const app = express();
const port = process.env.port || 3000;

app.use(corsMiddleware);
app.use(express.json());

app.use("/livros", livrosroutes);

app.get("/", function (req, res) {
    res.status(200).json({ mensagem: "api da biblioteca funcionando!" })
});

async function iniciarservidor() {
    try {
        await testarConexao();
        app.listen(port, function () {
            console.log("servidor rodando em http://localhost:" + port);
        });
    } catch (erro) {
        console.log("não foi possivel iniciar o servidor");
        console.log(erro.message);
    }
}
iniciarservidor();