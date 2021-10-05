var express = require('express');
const { RtcTokenBuilder, RtcRole } = require('agora-access-token');

const APP_ID = "b727503d55e4445397df20478c05ddf2";
const APP_CERTIFICATE = "b494bcd69f184d19b4342d80096fda47";

var app = express();

const nocache = (req, res, next) => {
  res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
  res.header('Expires', '-1');
  res.header('Pragma', 'no-cache');
  next();
}
const generateAccessToken = (req, res) => {
  res.header('Acess-Control-Allow-Origin', '*');
  const channelName = req.query.channelName;
  if (!channelName) {
    return res.status(500).json({ 'error': 'channel is required' });
  }
  let uid = req.query.uid;
  if (!uid || uid == '') {
    uid = 0;
  }
  let role = RtcRole.SUBSCRIBER
  if (req.query.role == 'publisher') {
    rele = RtcRole.PUBLISHER;
  }
  let expireTime = req.query.expireTime;
  if (!expireTime || expireTime == '') {
    expireTime = 3600;
  } else {
    expireTime = parseInt(expireTime, 10);
  }
  const currentTime = Math.floor(Date.now() / 1000);
  const privilegeExpireTime = currentTime + expireTime;
  const token = RtcTokenBuilder.buildTokenWithUid(APP_ID, APP_CERTIFICATE, channelName, uid, role, privilegeExpireTime);
  return res.json({ 'token': token });
}

app.get('/access_token', nocache, generateAccessToken);

app.listen(3000);
