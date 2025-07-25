import express from "express";
import { RtcTokenBuilder, RtcRole } from "agora-access-token";
import dotenv from "dotenv";

dotenv.config();

const app = express();

const APP_ID = process.env.APP_ID;
const APP_CERTIFICATE = process.env.APP_CERTIFICATE;

app.get("/rtc/:channelName/:role/:uid", (req, res) => {
  const channelName = req.params.channelName;
  const uid = req.params.uid;
  const role = req.params.role;

  if (!channelName || !uid || !role) {
    return res.status(400).json({ error: "Missing required parameters" });
  }

  let agoraRole;
  if (role === "publisher") {
    agoraRole = RtcRole.PUBLISHER;
  } else if (role === "subscriber") {
    agoraRole = RtcRole.SUBSCRIBER;
  } else {
    return res.status(400).json({ error: "Invalid role" });
  }

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

  return res.json({ token: token });
});

const port = process.env.PORT || 10000;
app.listen(port, () => {
  console.log(`Agora token server running on port ${port}`);
});
