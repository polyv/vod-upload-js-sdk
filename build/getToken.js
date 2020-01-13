const md5 = require('md5');

// TODO
const userid = 'your userid';
const secretkey = 'your secretkey';
const writeToken = 'your writeToken';

const ts = Date.now();
const hash = md5(ts + writeToken);
const sign = md5(secretkey + ts);

module.exports = {
  ts,
  hash,
  sign,
  userid,
};
