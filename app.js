const express = require('express');
const path = require('path');
const multer = require('multer');
const app = express();
const PORT = 3000;

// Middleware para processar dados de formulários
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Configuração do multer para upload de imagens na pasta 'uploads'
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/')
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname)
    }
});
const upload = multer({ storage });

// Servir arquivos estáticos (ex: imagens)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// === Tela inicial ===
app.get('/', (req, res) => {
    res.send(`
        <h1>Bem-vindo ao sistema</h1>
        <ul>
            <li><a href="/fornecedores/cadastro">Cadastrar Fornecedor</a></li>
            <li><a href="/produtos/cadastro">Cadastrar Produto</a></li>
            <li><a href="/produtos/associar">Associar Fornecedor a Produto</a></li>
        </ul>
    `);
});

// === Cadastro de Fornecedor ===
app.get('/fornecedores/cadastro', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'cadastro-fornecedor.html'));
});

app.post('/fornecedores/cadastrar', (req, res) => {
    const { nome, cnpj, endereco, telefone, email, contato } = req.body;
    console.log('Fornecedor cadastrado:', { nome, cnpj, endereco, telefone, email, contato });
    res.send('Fornecedor cadastrado com sucesso! <a href="/">Voltar</a>');
});

// === Cadastro de Produto ===
app.get('/produtos/cadastro', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'cadastro-produto.html'));
});

app.post('/produtos/cadastrar', upload.single('imagem'), (req, res) => {
    const { nome, codigoBarras, descricao, quantidade, categoria, validade } = req.body;
    const imagem = req.file;

    console.log('Produto cadastrado:', {
        nome,
        codigoBarras,
        descricao,
        quantidade,
        categoria,
        validade,
        imagem: imagem ? imagem.filename : 'Sem imagem'
    });

    res.send('Produto cadastrado com sucesso! <a href="/">Voltar</a>');
});

// === Associação de Fornecedor a Produto ===
app.get('/produtos/associar', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'associar-fornecedor.html'));
});

// Iniciar o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
