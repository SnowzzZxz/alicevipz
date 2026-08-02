const fs = require('fs');
const path = require('path');

const COBRANCAS_FILE = path.join(__dirname, '../cobrancas.json');

let cobrancas = {};

// Tenta carregar do arquivo (se existir e se a Vercel deixar)
try {
    if (fs.existsSync(COBRANCAS_FILE)) {
        const data = fs.readFileSync(COBRANCAS_FILE, 'utf8');
        cobrancas = JSON.parse(data);
        console.log('✅ Cobranças carregadas do arquivo');
    }
} catch (e) {
    console.log('⚠️ Não foi possível carregar cobranças do arquivo, usando memória');
}

module.exports = {
    get: (id) => cobrancas[id],
    set: (id, dados) => {
        cobrancas[id] = dados;
        // Tenta salvar no arquivo (se a Vercel deixar)
        try {
            fs.writeFileSync(COBRANCAS_FILE, JSON.stringify(cobrancas, null, 2));
        } catch (e) {
            console.log('⚠️ Não foi possível salvar no arquivo, mantendo em memória');
        }
    },
    getAll: () => cobrancas
};
