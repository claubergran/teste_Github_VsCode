const { exec } = require('child_process');

// Porta que você está usando
const PORT = 3000;

// Comando para localizar o PID na porta
const findCommand = `netstat -ano | findstr :${PORT}`;

exec(findCommand, (err, stdout, stderr) => {
    if (err || !stdout) {
        console.log(`Nenhum processo usando a porta ${PORT}. Iniciando o servidor...`);
        startServer();
        return;
    }

    // Extraindo o PID da resposta
    const lines = stdout.trim().split('\n');
    const pid = lines[0].trim().split(/\s+/).pop();

    console.log(`Finalizando processo antigo na porta ${PORT} (PID: ${pid})...`);

    exec(`taskkill /PID ${pid} /F`, (errKill) => {
        if (errKill) {
            console.error('Erro ao finalizar o processo:', errKill);
            return;
        }

        console.log('Processo finalizado com sucesso. Iniciando o servidor...');
        startServer();
    });
});

function startServer() {
    const server = exec('node app.js');

    server.stdout.on('data', (data) => {
        console.log(data);
    });

    server.stderr.on('data', (data) => {
        console.error(data);
    });

    server.on('close', (code) => {
        console.log(`Servidor finalizado com código ${code}`);
    });
}
