const axios = require('axios');
const cobrancasDB = require('./cobrancas.js');

module.exports = async (req, res) => {
    // ... (código igual até o final)

    // 🔥 MUDA A FORMA DE SALVAR
    cobrancasDB.set(linkId, {
        paymentId: paymentId,
        valor: parseFloat(valor),
        descricao: descricao || 'Cobrança',
        cliente: cliente || 'Cliente',
        data: new Date().toISOString(),
        status: 'pending',
        qrCode: qrCode,
        codigoPix: codigoPix || paymentId
    });

    // ... (resto do código)
};
