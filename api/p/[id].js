const cobrancas = require('../cobrancas.js');

module.exports = async (req, res) => {
    const { id } = req.query;
    const cobranca = cobrancas[id];

    if (!cobranca) {
        return res.status(404).send(`
            <!DOCTYPE html>
            <html>
            <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>404</title>
            <style>body{background:#111;color:#ccc;font-family:Arial;display:flex;justify-content:center;align-items:center;height:100vh;margin:0}</style>
            </head>
            <body><div style="background:#1a1a1a;padding:24px;border-radius:8px;border:1px solid #2a2a2a;text-align:center">Cobrança não encontrada</div></body>
            </html>
        `);
    }

    const html = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <title>Pagamento</title>
            <style>
                *{margin:0;padding:0;box-sizing:border-box}
                body{background:#111;color:#ccc;font-family:Arial;display:flex;justify-content:center;align-items:center;min-height:100vh;padding:20px}
                .container{max-width:400px;width:100%}
                .card{background:#1a1a1a;border-radius:8px;padding:24px;border:1px solid #2a2a2a;text-align:center}
                .valor{font-size:28px;color:#fff;margin:12px 0}
                .status{color:#ffd43b;font-size:14px;margin:12px 0}
                .status.pago{color:#4ade80}
                .qr{background:#fff;padding:12px;border-radius:6px;display:inline-block;margin:10px auto}
                .qr img{max-width:160px;display:block}
                .pix-code{display:flex;gap:8px;margin:12px 0}
                .pix-code input{flex:1;padding:8px;border-radius:6px;border:1px solid #2a2a2a;background:#0d0d0d;color:#ddd;font-size:12px;font-family:monospace}
                .pix-code button{background:#2a2a2a;border:none;padding:8px 16px;border-radius:6px;color:#fff;cursor:pointer}
                .pix-code button:hover{background:#333}
            </style>
        </head>
        <body>
            <div class="container">
                <div class="card">
                    <div style="color:#888;font-size:14px">${cobranca.descricao || 'Cobrança'}</div>
                    <div class="valor">R$ ${cobranca.valor.toFixed(2)}</div>
                    <div class="status" id="statusPix">Aguardando pagamento...</div>
                    <div class="qr"><img id="qrCodeImage" src="${cobranca.qrCode || ''}" alt="QR" /></div>
                    <div class="pix-code">
                        <input type="text" id="codigoPix" value="${cobranca.codigoPix || ''}" readonly />
                        <button onclick="copiar()">Copiar</button>
                    </div>
                </div>
            </div>
            <script>
                const paymentId = '${cobranca.paymentId}';
                function copiar() {
                    const input = document.getElementById('codigoPix');
                    input.select();
                    navigator.clipboard.writeText(input.value);
                    alert('Copiado');
                }
                let tentativas = 0;
                const statusEl = document.getElementById('statusPix');
                const intervalo = setInterval(async () => {
                    tentativas++;
                    try {
                        const response = await fetch('/api/verificar-pagamento?id=' + paymentId);
                        const data = await response.json();
                        if (data.status === 'paid') {
                            clearInterval(intervalo);
                            statusEl.textContent = 'PAGAMENTO CONFIRMADO';
                            statusEl.className = 'status pago';
                        } else if (tentativas > 20) {
                            clearInterval(intervalo);
                            statusEl.textContent = 'Se já pagou, aguarde alguns minutos';
                        }
                    } catch {}
                }, 5000);
            </script>
        </body>
        </html>
    `;

    res.setHeader('Content-Type', 'text/html');
    res.status(200).send(html);
};