const http = require('http');
const fs = require('fs');
const path = require('path');
const { parse } = require('querystring');

const server = http.createServer((req, res) => {
    if (req.method === 'GET' && req.url === '/') {
        fs.readFile(path.join(__dirname, 'public', 'index.html'), (err, content) => {
            res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
            res.end(content);
        });
    } else if (req.method === 'POST' && req.url === '/cadastrar') {
        let body = '';

        req.on('data', chunk => {
            body += chunk.toString();
        });

        req.on('end', () => {
            const dados = parse(body);

            // Carrega fornecedores existentes
            let fornecedores = [];
            if (fs.existsSync('fornecedores.json')) {
                fornecedores = JSON.parse(fs.readFileSync('fornecedores.json'));
            }

            // Verifica duplicidade de CNPJ
            const fornecedorExistente = fornecedores.find(f => f.cnpj === dados.cnpj);

            if (fornecedorExistente) {
                res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
                res.end('<h2>Fornecedor com esse CNPJ já está cadastrado!</h2><a href="/">Voltar</a>');
                return;
            }

            // Valida campos obrigatórios
            if (!dados.nome || !dados.cnpj || !dados.endereco || !dados.telefone || !dados.email || !dados.contato) {
                res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
                res.end('<h2>Todos os campos são obrigatórios!</h2><a href="/">Voltar</a>');
                return;
            }

            // Salva fornecedor
            fornecedores.push(dados);
            fs.writeFileSync('fornecedores.json', JSON.stringify(fornecedores, null, 2));

            res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
            res.end('<h2>Fornecedor cadastrado com sucesso!</h2><a href="/">Voltar</a>');
        });
    } else {
        res.writeHead(404);
        res.end('Página não encontrada.');
    }
});

const PORT = 3000;
server.listen(PORT, () => console.log(`Servidor rodando em http://localhost:${PORT}`));

