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

// === Rota inicial ===
app.get('/', (req, res) => {
    res.send(`
    <h1>Bem-vindo ao sistema</h1>
    <ul>
      <li><a href="/fornecedores/cadastro">Cadastrar Fornecedor</a></li>
      <li><a href="/produtos/cadastro">Cadastrar Produto</a></li>
    </ul>
  `);
});

// === Cadastro de Fornecedor ===
// Rota GET - formulario
app.get('/fornecedores/cadastro', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'cadastro-fornecedor.html'));
});

// Rota POST - recebendo dados
app.post('/fornecedores/cadastrar', (req, res) => {
    const { nome, cnpj, endereco, telefone, email, contato } = req.body;
    // Aqui você pode validar e salvar os dados no banco
    console.log('Fornecedor cadastrado:', { nome, cnpj, endereco, telefone, email, contato });
    res.send('Fornecedor cadastrado com sucesso!');
});

// === Cadastro de Produto ===
// Rota GET - formulario
app.get('/produtos/cadastro', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'cadastro-produto.html'));
});

// Rota POST - recebendo dados com upload
app.post('/produtos/cadastrar', upload.single('imagem'), (req, res) => {
    const { nome, codigoBarras, descricao, quantidade, categoria, validade } = req.body;
    const imagem = req.file;
    // Aqui você pode validar e salvar no banco
    console.log('Produto cadastrado:', {
        nome,
        codigoBarras,
        descricao,
        quantidade,
        categoria,
        validade,
        imagem: imagem ? imagem.filename : 'Sem imagem'
    });
    res.send('Produto cadastrado com sucesso!');
});

// Iniciar o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});


