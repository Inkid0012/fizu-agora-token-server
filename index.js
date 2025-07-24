const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { RtcTokenBuilder, RtcRole } = require("agora-access-token");

dotenv.config();

const app = express();
app.use(cors());

app.get("/ping", (req, res) => {
  res.send("pong");
});

app.get("/rtc/token", (req, res) => {
  const { channelName, uid, role } = req.query;

  if (!channelName || !uid || !role) {
    return res.status(400).json({ error: "Missing required parameters" });
  }

  const expirationTimeInSeconds = 3600;
  const currentTimestamp = Math.floor(Date.now() / 1000);
  const privilegeExpiredTs = currentTimestamp + expirationTimeInSeconds;

  const token = RtcTokenBuilder.buildTokenWithUid(
    process.env.AGORA_APP_ID,
    process.env.AGORA_APP_CERTIFICATE,
    channelName,
    parseInt(uid),
    role === "publisher" ? RtcRole.PUBLISHER : RtcRole.SUBSCRIBER,
    privilegeExpiredTs
  );

  return res.json({ token });
});

app.get("/rtc/:channelName/:role/uid/:uid", (req, res) => {
  const { channelName, role, uid } = req.params;

  const expirationTimeInSeconds = 3600;
  const currentTimestamp = Math.floor(Date.now() / 1000);
  const privilegeExpiredTs = currentTimestamp + expirationTimeInSeconds;

  const token = RtcTokenBuilder.buildTokenWithUid(
    process.env.AGORA_APP_ID,
    process.env.AGORA_APP_CERTIFICATE,
    channelName,
    parseInt(uid),
    role === "publisher" ? RtcRole.PUBLISHER : RtcRole.SUBSCRIBER,
    privilegeExpiredTs
  );

  return res.json({ token });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Agora token server listening on port ${PORT}`);
});
