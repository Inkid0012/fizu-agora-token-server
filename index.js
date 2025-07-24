const express = require("express");
const { RtcTokenBuilder, RtcRole } = require("agora-access-token");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.get("/rtc/:channelName/:role/:uid", (req, res) => {
  const appID = process.env.APP_ID;
  const appCertificate = process.env.APP_CERTIFICATE;

  const channelName = req.params.channelName;
  const uid = req.params.uid;
  const role = req.params.role === "publisher" ? RtcRole.PUBLISHER : RtcRole.SUBSCRIBER;

  const expirationTimeInSeconds = 3600;
  const currentTimestamp = Math.floor(Date.now() / 1000);
  const privilegeExpiredTs = currentTimestamp + expirationTimeInSeconds;

  const token = RtcTokenBuilder.buildTokenWithUid(
    appID,
    appCertificate,
    channelName,
    parseInt(uid),
    role,
    privilegeExpiredTs
  );

  return res.json({ token });
});

app.listen(PORT, () => {
  console.log(`Agora token server running on port ${PORT}`);
});
