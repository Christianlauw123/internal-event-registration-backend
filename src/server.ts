import http from 'http';
import { app } from './app.js';

const PORT = process.env.PORT || 8000;
const server = http.createServer(app)

async function serverStart() {
    server.listen(PORT, () => {
        console.log(`Listening to port ${PORT}`)
    })
}

serverStart();