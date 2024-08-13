import { Form, Input, Button, message } from 'antd';
import axios from 'axios';
import { useState } from 'react';
import './App.css'

function App() {
  const [generateForm] = Form.useForm();
  const [verifyForm] = Form.useForm();
  const [qrCodeUrl, setQrCodeUrl] = useState(null);
  const [otpCode, setOtpCode] = useState(null);

  const onFinishGenerate = async (values) => {
    const { empresa, email } = values;
    try {
      const { data } = await axios.post('http://localhost:3000/generate-qr', { empresa, email });
      message.success('QR Generado');
      setQrCodeUrl(data.qrcode);
    } catch (error) {
      message.error('Error al generar');
      console.error('Hubo un problema', error);
    }
  };

  const onFinishVerify = async (values) => {
    const { token } = values;

    try {
      const { data } = await axios.post('http://localhost:3000/verify-totp', { token });
      message.success('Código Correcto');
      setOtpCode('Código Correcto'); // Cambiar según la respuesta real del backend
    } catch (error) {
      message.error('Codigo incorrecto');
    }
  };

  return (
    <div className="App" style={containerStyle}>
      <div style={cardStyle}>
        <h2 style={titleStyle}>Generar QR</h2>
        <Form
          form={generateForm}
          name="generate-qr"
          onFinish={onFinishGenerate}
          style={formStyle}
        >
          <Form.Item
            name="email"
            label="Email"
            rules={[{ required: true, message: 'Por favor ingresa un email' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="empresa"
            label="Empresa"
            rules={[{ required: true, message: 'Por favor ingresa una Empresa' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" style={buttonStyle}>
              Generar QR
            </Button>
          </Form.Item>
        </Form>
      </div>

      {qrCodeUrl && (
        <div style={qrContainerStyle}>
          <div style={qrCardStyle}>
            <h3 style={qrTitleStyle}>QR generado</h3>
            <img src={qrCodeUrl} alt="Código QR" style={qrImageStyle} />
          </div>
        </div>
      )}

      <div style={cardStyle}>
        <h2 style={titleStyle}>Comprobar Código</h2>
        <Form
          form={verifyForm}
          name="verify-totp"
          onFinish={onFinishVerify}
          style={formStyle}
        >
          <Form.Item
            name="token"
            label="Token"
            rules={[{ required: true, message: 'Por favor ingresa el token' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" style={buttonStyle}>
              Verificar Código
            </Button>
          </Form.Item>
        </Form>
      </div>

      {otpCode && (
        <div style={qrContainerStyle}>
          <div style={qrCardStyle}>
            <h3 style={qrTitleStyle}>Resultado</h3>
            <h3 style={qrTitleStyle}>{otpCode}</h3>
          </div>
        </div>
      )}
    </div>
  );
}

const containerStyle = {
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  minHeight: '100vh',
  background: '#05F2F2',
  padding: 20,
};

const cardStyle = {
  width: '100%',
  maxWidth: 400,
  padding: 30,
  background: '#fff',
  borderRadius: 10,
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
  textAlign: 'center',
  marginBottom: 20,
};

const qrContainerStyle = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  marginTop: 20,
};

const qrCardStyle = {
  padding: 20,
  background: '#fff',
  borderRadius: 10,
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
  textAlign: 'center',
};

const qrTitleStyle = {
  marginBottom: 10,
  color: '#333',
};

const qrImageStyle = {
  width: '100%',
  height: 'auto',
};

const titleStyle = {
  marginBottom: 20,
  color: '#F28705',
};

const formStyle = {
  width: '100%',
};

const buttonStyle = {
  width: '100%',
};

export default App;
