// api/gerar-cobranca.js
const axios = require('axios');
const cobrancasDB = require('./cobrancas.js');

module.exports = async (req, res) => {
    // ... (código anterior)

    // Depois de salvar, adicione este log
    console.log(`✅ Cobrança salva: ${linkId}`);
    console.log(`📦 Cobranças atuais:`, cobrancasDB.getAll());

    // ... (resto do código)
};
