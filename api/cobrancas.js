// api/cobrancas.js
// 🔥 SIMPLES ASSIM: só memória, sem firula
const cobrancas = {};

module.exports = {
    get: (id) => cobrancas[id] || null,
    set: (id, dados) => {
        cobrancas[id] = dados;
        console.log(`✅ Cobrança salva: ${id}`);
    },
    getAll: () => cobrancas
};
