const axios = require('axios');
const cobrancasDB = require('./cobrancas.js');

module.exports = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    try {
        const { valor, descricao, cliente, linkPersonalizado } = req.body;

        if (!valor || valor <= 0) {
            return res.status(400).json({ error: 'Valor inválido' });
        }

        let linkId = linkPersonalizado ? linkPersonalizado.trim() : null;

        if (linkId) {
            if (cobrancasDB.get(linkId)) {
                return res.status(400).json({ error: 'Este link já está sendo usado. Escolha outro nome.' });
            }
            linkId = linkId.replace(/[^a-zA-Z0-9-_]/g, '');
            if (!linkId) {
                return res.status(400).json({ error: 'Nome do link inválido. Use apenas letras, números, - e _' });
            }
        } else {
            linkId = Date.now().toString(36) + Math.random().toString(36).substring(2, 6);
        }

        const CLIENT_ID = 'zpk_541f4b2f71855fb26e1201a7';
        const CLIENT_SECRET = 'zsk_87b13fb23ba5eed5d6d9f0f9e6153d20dfeac10e24a66dd6';
        const ZPAY_API_URL = 'https://zpaysolution.com/api/v1';

        const response = await axios.post(
            `${ZPAY_API_URL}/payments`,
            {
                amount: parseFloat(valor),
                payerName: cliente || 'Cliente',
                description: descricao || 'Cobrança'
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'client-id': CLIENT_ID,
                    'client-secret': CLIENT_SECRET
                }
            }
        );

        const data = response.data;
        const paymentId = data.paymentId || data.id || data.transactionId;
        const codigoPix = data.copyPaste || data.pixCode || data.pix_code || data.brCode || data.pix || null;
        const qrCode = data.qrCodeBase64 || data.qrCode || data.qr_code ||
            `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(codigoPix || paymentId)}`;

        // 🔥 SALVA USANDO O MÉTODO SET
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

        res.status(200).json({
            success: true,
            link: `/p/${linkId}`,
            linkCompleto: `https://alicevipz.vercel.app/p/${linkId}`,
            pix: {
                qrCode: qrCode,
                codigoCopiaCola: codigoPix || paymentId
            },
            paymentId: paymentId
        });

    } catch (error) {
        console.error('❌ Erro:', error.response?.data || error.message);
        res.status(400).json({
            success: false,
            error: error.response?.data?.message || 'Erro ao gerar cobrança'
        });
    }
};
