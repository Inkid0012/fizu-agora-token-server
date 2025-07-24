# Fizu Agora Token Server

This is a simple Node.js server that generates Agora AccessTokens using AccessToken2 for Fizu voice/video calling.

## Endpoints

- `GET /ping` – Health check
- `GET /rtc/token?channelName=fizu-calling&uid=123&role=publisher` – Query param token
- `GET /rtc/fizu-calling/publisher/uid/123` – Path param token

Make sure to configure your Agora App ID and Certificate in environment variables.
