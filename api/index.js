// Proxy requests to the actual server file
// This is the Vercel Serverless Function entry point

import app from '../server/index.cjs';

export const config = {
    api: {
        externalResolver: true,
        bodyParser: false, // Express handles parsing
    },
};

export default function handler(req, res) {
    return app(req, res);
}
