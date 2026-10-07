const botao = document.getElementById("btnBuscar");
const listarlivros = document.getElementById("listaLivros");
const mensagem = document.getElementById("mensagem");
const formulario = document.getElementById("formLivro");
const campoTitulo = document.getElementById("titulo");
const campoAno = document.getElementById("ano");
const campoAutor = document.getElementById("autor");

botao.addEventListener("click", buscarLivros);
formulario.addEventListener("submit", salvarLivro);

let idEdicao = null;
const botaoSalvar = document.getElementById("btnSalvar");

async function buscarLivros() {
    try {
        mensagem.textContent = "Buscando Livros...";

        const resposta = await fetch("http://localhost:3000/livros");

        if (!resposta.ok) {
            throw new Error("Erro HTTP: " + resposta.status);
        }

        const livros = await resposta.json();
        listarlivros.innerHTML = "";

        if (livros.length === 0) {
            mensagem.textContent = "Nenhum livro cadastrado";
            return;
        }

        for (let i = 0; i < livros.length; i++) {
            listarlivros.innerHTML += `
                <tr>
                    <td>${livros[i].id}</td>
                    <td>${livros[i].titulo}</td>
                    <td>${livros[i].autor}</td>
                    <td>${livros[i].ano}</td>
                    <td>
                        <button onclick="editarLivro(${livros[i].id})">
                            Editar
                        </button>
                        <button onclick="excluirLivro(${livros[i].id})">
                            Excluir
                        </button>
                    </td>
                </tr>
            `;
        }

        mensagem.textContent = livros.length + " livros encontrados";
    } catch (erro) {
        mensagem.textContent = "Não foi possível carregar os livros.";
        console.error(erro);
    }
}

async function salvarLivro(evento) {
    evento.preventDefault();

    if (idEdicao === null) {
        await cadastrarLivro();
    } else {
        await atualizarLivro();
    }
}

async function cadastrarLivro() {
    try {
        const titulo = campoTitulo.value;
        const autor = campoAutor.value;
        const ano = campoAno.value;

        const livro = {
            titulo: titulo,
            autor: autor,
            ano: ano
        };

        const resposta = await fetch("http://localhost:3000/livros", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(livro)
        });

        if (!resposta.ok) {
            throw new Error("Erro HTTP: " + resposta.status);
        }

        const dados = await resposta.json();
        formulario.reset();
        await buscarLivros();
        mensagem.textContent = dados.mensagem;
    } catch (erro) {
        mensagem.textContent = "Não foi possível cadastrar o livro.";
        console.error("Erro ao cadastrar livro:", erro);
    }
}

async function editarLivro(id) {
    try {
        const resposta = await fetch("http://localhost:3000/livros/" + id);

        if (!resposta.ok) {
            throw new Error("Erro HTTP: " + resposta.status);
        }

        const livro = await resposta.json();
        campoTitulo.value = livro.titulo;
        campoAutor.value = livro.autor;
        campoAno.value = livro.ano;

        idEdicao = livro.id;
        botaoSalvar.textContent = "Atualizar";
        mensagem.textContent = "Editando livro de ID " + livro.id;
    } catch (erro) {
        mensagem.textContent = "Não foi possível carregar o livro.";
        console.error("Erro ao carregar livro:", erro);
    }
}

async function atualizarLivro() {
    try {
        const livro = {
            titulo: campoTitulo.value,
            autor: campoAutor.value,
            ano: campoAno.value
        };

        const resposta = await fetch("http://localhost:3000/livros/" + idEdicao, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(livro)
        });

        if (!resposta.ok) {
            throw new Error("Erro HTTP: " + resposta.status);
        }

        const dados = await resposta.json();
        formulario.reset();
        idEdicao = null;
        botaoSalvar.textContent = "Cadastrar";
        await buscarLivros();
        mensagem.textContent = dados.mensagem;
    } catch (erro) {
        mensagem.textContent = "Não foi possível atualizar o livro.";
        console.error("Erro ao atualizar livro:", erro);
    }
}

async function excluirLivro(id) {
    try {
        const resposta = await fetch("http://localhost:3000/livros/" + id, {
            method: "DELETE"
        });

        if (!resposta.ok) {
            const dadosErro = await resposta.json().catch(() => ({ mensagem: "Erro ao excluir livro" }));
            throw new Error(dadosErro.mensagem || "Erro HTTP: " + resposta.status);
        }

        const dados = await resposta.json();
        formulario.reset();
        idEdicao = null;
        botaoSalvar.textContent = "Cadastrar";
        await buscarLivros();
        mensagem.textContent = dados.mensagem;
    } catch (erro) {
        mensagem.textContent = "Não foi possível excluir o livro.";
        console.error("Erro ao excluir livro:", erro);
    }
}

window.editarLivro = editarLivro;
window.excluirLivro = excluirLivro;
