const axios = require('axios');

const dc4 = axios.create({
  baseURL: 'http://localhost:59017/api/',
});

// Localhost
// baseURL: 'http://localhost:59017/api/',
// BRi
// baseURL: 'http://10.16.33.90:126/api/',
exports.dc4 = dc4;