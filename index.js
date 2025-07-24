const express = require("express");
const { RtcTokenBuilder, RtcRole } = require("agora-access-token");
const dotenv = require("dotenv");
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.get("/ping", (req, res) => {
  res.send("pong");
});

app.get("/rtc/token", (req, res) => {
  const { channelName, uid, role } = req.query;

  if (!channelName || !uid || !role) {
    return res.status(400).json({ error: "Missing required parameters" });
  }

  const rtcRole = role === "publisher" ? RtcRole.PUBLISHER : RtcRole.SUBSCRIBER;
  const expirationTimeInSeconds = 3600;
  const currentTimestamp = Math.floor(Date.now() / 1000);
  const privilegeExpiredTs = currentTimestamp + expirationTimeInSeconds;

  const token = RtcTokenBuilder.buildTokenWithUid(
    process.env.AGORA_APP_ID,
    process.env.AGORA_APP_CERTIFICATE,
    channelName,
    parseInt(uid),
    rtcRole,
    privilegeExpiredTs
  );

  return res.json({ token });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
