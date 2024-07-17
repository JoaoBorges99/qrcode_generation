const express = require('express');
const https = require('https');

const server = express();

const port = 2311;

server.use(express.json());

server.listen(port, () =>{
    console.log('Api rodando');
});

server.post('/qr_wifi', (req, res) => {
    if(req.body === undefined){
        res.status(400).send('Body vazio');
    }else{
        const nomeRede = req.body.nome;
        const senhaRede = req.body.senha;
        const seguranca = 'WPA2'
        const wifiData = `WIFI:T:${seguranca};S:${nomeRede};P:${senhaRede};`;
        generateQrCode(wifiData, (err, qrCodeData) => {
            if (err) {
                res.status(500).send({"error": err});
                return;
            }

            res.writeHead(200, { 'Content-Type': 'image/png' });
            res.end(Buffer.from(qrCodeData, 'binary'), 'binary');
        });        
    }

});

function generateQrCode (dados, retorno){
    const urlQrApi = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(dados)}`;

    https.get(
        urlQrApi, 
        (res) => {
            if(res.statusCode !== 200){
                retorno(new Error('Falha ao gerar Qr code !'));
                return;
            }

            let rawData = '';
            res.setEncoding('binary');
            res.on('data', (chunk) => rawData += chunk);
            res.on('end', () => retorno(null, rawData));
        }
    )
    .on('error', (e) => {
        retorno(e);
    });

}