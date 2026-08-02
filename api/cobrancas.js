const fs = require('fs');
const path = require('path');

// 🔥 ARQUIVO NA PASTA PUBLIC (QUE A VERCEL MANTÉM)
const COBRANCAS_FILE = path.join(__dirname, '../public/cobrancas.json');

// Garante que a pasta public existe
const publicDir = path.join(__dirname, '../public');
if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
}

function carregarCobrancas() {
    try {
        if (fs.existsSync(COBRANCAS_FILE)) {
            const data = fs.readFileSync(COBRANCAS_FILE, 'utf8');
            return JSON.parse(data);
        }
    } catch (e) {
        console.log('⚠️ Erro ao carregar:', e.message);
    }
    return {};
}

function salvarCobrancas(cobrancas) {
    try {
        fs.writeFileSync(COBRANCAS_FILE, JSON.stringify(cobrancas, null, 2));
        return true;
    } catch (e) {
        console.log('⚠️ Erro ao salvar:', e.message);
        return false;
    }
}

let cobrancas = carregarCobrancas();

module.exports = {
    get: (id) => cobrancas[id],
    set: (id, dados) => {
        cobrancas[id] = dados;
        salvarCobrancas(cobrancas);
    },
    getAll: () => cobrancas
};
