import express from "express";
import dotenv from "dotenv";
import pkg from "agora-access-token"; // ✅ Fix: Import CommonJS module correctly

const { RtcTokenBuilder, RtcRole } = pkg;

dotenv.config();

const app = express();

const APP_ID = process.env.APP_ID;
const APP_CERTIFICATE = process.env.APP_CERTIFICATE;

app.get("/rtc/:channelName/:role/:uid", (req, res) => {
  const { channelName, role, uid } = req.params;

  if (!APP_ID || !APP_CERTIFICATE) {
    return res.status(500).json({ error: "Missing Agora credentials in .env" });
  }

  if (!channelName || !role || !uid) {
    return res.status(400).json({ error: "Missing required parameters" });
  }

  const agoraRole = role === "publisher" ? RtcRole.PUBLISHER : RtcRole.SUBSCRIBER;

  const expirationTimeInSeconds = 3600;
  const currentTimestamp = Math.floor(Date.now() / 1000);
  const privilegeExpireTime = currentTimestamp + expirationTimeInSeconds;

  const token = RtcTokenBuilder.buildTokenWithUid(
    APP_ID,
    APP_CERTIFICATE,
    channelName,
    parseInt(uid),
    agoraRole,
    privilegeExpireTime
  );

  return res.json({ token });
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`Agora token server running on port ${PORT}`);
});
