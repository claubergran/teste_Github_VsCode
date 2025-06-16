const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

app.use(bodyParser.urlencoded({ extended: true }));

let fornecedores = [];
let produtos = [];

// Página inicial
app.get('/', (req, res) => {
    res.send(`
        <h1>Sistema de Cadastro</h1>
        <a href="/fornecedor">Cadastrar Fornecedor</a><br>
        <a href="/produto">Cadastrar Produto</a>
    `);
});

// Cadastro de Fornecedor
app.get('/fornecedor', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.post('/cadastrar', (req, res) => {
    const { nome, cnpj, endereco, telefone, email, contato } = req.body;

    const fornecedorExistente = fornecedores.find(f => f.cnpj === cnpj);

    if (fornecedorExistente) {
        res.send('Fornecedor com esse CNPJ já está cadastrado!');
        return;
    }

    fornecedores.push({ nome, cnpj, endereco, telefone, email, contato });
    res.send('Fornecedor cadastrado com sucesso!');
});

// Cadastro de Produto
app.get('/produto', (req, res) => {
    res.sendFile(path.join(__dirname, 'produto.html'));
});

app.post('/cadastrar-produto', (req, res) => {
    const { nome, codigo, descricao, preco, quantidade } = req.body;

    const produtoExistente = produtos.find(p => p.codigo === codigo);

    if (produtoExistente) {
        res.send('Produto com este código de barras já está cadastrado!');
        return;
    }

    if (!nome || !codigo || !descricao || !preco || !quantidade) {
        res.send('Todos os campos são obrigatórios!');
        return;
    }

    produtos.push({ nome, codigo, descricao, preco, quantidade });
    res.send('Produto cadastrado com sucesso!');
});

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});

