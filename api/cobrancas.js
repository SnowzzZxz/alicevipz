// api/cobrancas.js
const fs = require('fs');
const path = require('path');

const COBRANCAS_FILE = path.join(__dirname, '../cobrancas.json');

// Carrega as cobranças do arquivo
function carregarCobrancas() {
    try {
        if (fs.existsSync(COBRANCAS_FILE)) {
            const data = fs.readFileSync(COBRANCAS_FILE, 'utf8');
            return JSON.parse(data);
        }
    } catch (error) {
        console.error('Erro ao carregar cobranças:', error);
    }
    return {};
}

// Salva as cobranças no arquivo
function salvarCobrancas(cobrancas) {
    try {
        fs.writeFileSync(COBRANCAS_FILE, JSON.stringify(cobrancas, null, 2));
    } catch (error) {
        console.error('Erro ao salvar cobranças:', error);
    }
}

let cobrancas = carregarCobrancas();

// Exporta um objeto com métodos de acesso
module.exports = {
    get: (id) => cobrancas[id],
    set: (id, dados) => {
        cobrancas[id] = dados;
        salvarCobrancas(cobrancas);
    },
    getAll: () => cobrancas
};
