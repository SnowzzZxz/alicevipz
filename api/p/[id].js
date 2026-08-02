const axios = require('axios');

module.exports = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    try {
        const { valor, descricao, cliente } = req.body;

        if (!valor || valor <= 0) {
            return res.status(400).json({ error: 'Valor inválido' });
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

        // 🔥 O LINK USA O paymentId DA ZPAY
        res.status(200).json({
            success: true,
            link: `/p/${paymentId}`,
            linkCompleto: `https://alicevipz.vercel.app/p/${paymentId}`,
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
