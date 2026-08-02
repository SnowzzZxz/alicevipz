const cobrancasDB = require('../cobrancas.js');

module.exports = async (req, res) => {
    const { id } = req.query;
    const cobranca = cobrancasDB.get(id); // 🔥 USA O MÉTODO GET

    if (!cobranca) {
        // ... (código de erro 404)
    }

    // ... (resto do código)
};
