// index.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { RtcTokenBuilder, RtcRole } = require('agora-access-token');

const app = express();
app.use(cors());

// ENV Variables
const PORT = process.env.PORT || 5000;
const APP_ID = process.env.AGORA_APP_ID;
const APP_CERTIFICATE = process.env.AGORA_APP_CERTIFICATE;

// Helper function to generate token
function generateToken(channelName, uid, role, expireTime = 3600) {
  if (!APP_ID || !APP_CERTIFICATE) {
    throw new Error("Missing Agora credentials in environment variables.");
  }

  const expirationTimeInSeconds = Math.floor(Date.now() / 1000) + expireTime;
  return RtcTokenBuilder.buildTokenWithUid(
    APP_ID,
    APP_CERTIFICATE,
    channelName,
    uid,
    role,
    expirationTimeInSeconds
  );
}

// Health Check Endpoint
app.get('/ping', (req, res) => {
  res.send('✅ Agora Token Server is live!');
});

// Query Parameters Endpoint
app.get('/rtc/token', (req, res) => {
  const channelName = req.query.channelName;
  const uid = parseInt(req.query.uid) || 0;
  const role = req.query.role === 'subscriber' ? RtcRole.SUBSCRIBER : RtcRole.PUBLISHER;

  if (!channelName) {
    return res.status(400).json({ error: 'channelName is required' });
  }

  try {
    const token = generateToken(channelName, uid, role);
    return res.json({ token });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Path Parameters Endpoint
app.get('/rtc/:channelName/:role/:tokentype/:uid', (req, res) => {
  const channelName = req.params.channelName;
  const uid = parseInt(req.params.uid);
  const role = req.params.role === 'subscriber' ? RtcRole.SUBSCRIBER : RtcRole.PUBLISHER;

  try {
    const token = generateToken(channelName, uid, role);
    return res.json({ token });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`✅ Agora Token Server running on port ${PORT}`);
});
