import express from 'express';
import speakeasy from 'speakeasy';
import qrcode from 'qrcode';
import qrcodeTerminal from 'qrcode-terminal';
import 'dotenv/config';
import mongoose from 'mongoose';
import Secret from './models/Secret.js';
import cors from 'cors'
const app = express();
app.use(express.json());
app.use(cors());
let secret;

mongoose.connect(
  process.env.BD_OTP, { useNewUrlParser: true, useUnifiedTopology: true }
);

app.get('/', async (req, res) => {
  return res.send("WORKING");
});

app.post('/generate-qr', async (req, res) => {
  const {email, empresa} = req.body;
  secret = speakeasy.generateSecret({ length: 20 });
  console.log("secret: ", secret)
  const otpauthUrl = speakeasy.otpauthURL({
    secret: secret.base32,
    label: `app:${email}`,
    issuer: `${empresa}`,
    encoding: 'base32'
  });
  console.log("otpauthUrl: ", otpauthUrl);

  //TODO: Guardar secret en BD
  try {

    const existeSecret = await Secret.findOne({email:email});

    if(existeSecret){
      existeSecret.secret = secret.base32;
      existeSecret.empresa = empresa;
      existeSecret.otpauthUrl = otpauthUrl;
      existeSecret.updatedAt = Date.now()
      await existeSecret.save();
      console.log('Secret actualizado')
    }else{   
      const newSecret = new Secret({
        email:email,
        empresa:empresa,
        secret: secret.base32,
        otpauthUrl: otpauthUrl
      });
      
      await newSecret.save() //db save
      console.log("Secret guardado en DB")
    }


    
      qrcodeTerminal.generate(otpauthUrl, { small: true }, function (qrcode) {
        console.log('QR');
        console.log(qrcode);
      });
      
      qrcode.toDataURL(otpauthUrl, (err, data_url) => {
        if (err) {
          res.status(500).json({ error: 'Error generando QR' });
        } else {
          res.json({ secret: secret.base32, qrcode: data_url });
        }
      });

  } catch (error) {
    console.error('Error al guardar los datos', error);
    res.status(500).send('Error al guardar el secret')

  }
  
});



app.post('/verify-totp', (req, res) => {
  const { token } = req.body;

  if (!secret) {
    return res.status(400).send('Secret no definido. Generar QR primero.');
  }

  const verified = speakeasy.totp.verify({
    secret: secret.base32,
    encoding: 'base32',
    token: token
  });

  if (verified) {
    res.send('🤙🏼🤙🏼🤙🏼🤙🏼');
  } else {
    res.status(400).send('👎🏼👎🏼👎🏼👎🏼');
  }
});

app.get('/generate-totp', (req, res) => {
  if (!secret) {
    return res.status(400).send('Secret no definido. Generar QR primero.');
  }
  const token = speakeasy.totp({ secret: secret.base32, encoding: 'base32' });
  res.json({ token });
});

app.listen(3000, () => console.log('Server en port 3000...'));
