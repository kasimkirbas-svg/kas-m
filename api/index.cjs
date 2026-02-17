// Proxy requests to the actual server file
// This is the Vercel Serverless Function entry point

const app = require('../server/index.cjs');
module.exports = app;
