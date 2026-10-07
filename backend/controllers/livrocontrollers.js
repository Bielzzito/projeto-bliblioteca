import { pool } from "../database/conexao.js";

async function listarlivros(req, res) {
    try {
        const [livros] = await pool.query("select * from livros");
        res.status(200).json(livros);
    } catch (erro) {
        console.log("erro ao buscar livros:", erro);
        res.status(500).json({ mensagem: "erro ao buscar livros" });
    }
}

async function buscarLivroPorID(req, res) {
    try {
        const id = req.params.id;
        const [livros] = await pool.query("SELECT * FROM livros where id=?", [id]);
        if (livros.length === 0) {
            return res.status(404).json({ mensagem: "livro não encontrado" });
        }
        res.status(200).json(livros[0]);
    } catch (erro) {
        console.log("Erro ao buscar livro:", erro);
        res.status(500).json({ mensagem: "Erro ao buscar livro" });
    }
}

//post
async function cadastrarLivro(req, res) {
    const { titulo, autor, ano } = req.body;
    try {
        if (!titulo || !autor || !ano) {
            return res.status(400).json({ mensagem: "preencha todos os campos" });
        }

        const [resultado] = await pool.query("insert into livros (titulo, autor, ano) values (?, ?, ?)", [titulo, autor, ano]);
        res.status(201).json({ mensagem: " Lirvo cadastrado com sucesso.", id: resultado.insertId });
    } catch (erro) {
        console.log("Erro ao cadastrar Livro:", erro);
        res.status(500).json({ mensagem: "erro ao cadastrar livro" });
    }
}

//PUT
async function atualizarLivro(req, res) {
    try {
        const id = req.params.id;
        const { titulo, autor, ano } = req.body;
        if (!titulo || !autor || !ano) {
            return res.status(400).json({ mensagem: "preencha todos os campos" });
        }
        const [resultado] = await pool.query(
            "UPDATE livros SET titulo = ?, autor=?, ano=? where id=?",
            [titulo, autor, ano, id]
        );
        if (resultado.affectedRows === 0) {
            return res.status(404).json({ mensagem: "livro não encontrado" });
        }
        res.status(200).json({ mensagem: "Livro atualizado com sucesso" });
    } catch (erro) {
        console.log("Erro ao atualizar Livro:", erro);
        res.status(500).json({ mensagem: "erro ao atualizar livro" });
    }
}

async function deletarLivro(req, res) {
    try {
        const id = req.params.id;
        const [resultado] = await pool.query("DELETE FROM livros WHERE id = ?", [id]);

        if (resultado.affectedRows === 0) {
            return res.status(404).json({ mensagem: "livro não encontrado" });
        }

        res.status(200).json({ mensagem: "Livro excluído com sucesso" });
    } catch (erro) {
        console.log("Erro ao excluir Livro:", erro);
        res.status(500).json({ mensagem: "erro ao excluir livro" });
    }
}

export { listarlivros, cadastrarLivro, atualizarLivro, buscarLivroPorID, deletarLivro };