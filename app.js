const http = require('http');
const fs = require('fs');
const path = require('path');
const querystring = require('querystring');

const server = http.createServer((req, res) => {
    if (req.method === 'GET' && req.url === '/') {
        // Servir o index.html
        fs.readFile(path.join(__dirname, 'index.html'), (err, data) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
                res.end('Erro ao carregar a página.');
            } else {
                res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
                res.end(data);
            }
        });
    } else if (req.method === 'POST' && req.url === '/cadastrar') {
        // Receber os dados do formulário
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            const fornecedor = querystring.parse(body);
            console.log('Fornecedor cadastrado:', fornecedor);

            // Retornar mensagem de sucesso
            res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
            res.end(`
                <h1>Fornecedor cadastrado com sucesso!</h1>
                <a href="/">Voltar</a>
            `);
        });
    } else {
        // Rota não encontrada
        res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end('Página não encontrada');
    }
});

const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}/`);
});
