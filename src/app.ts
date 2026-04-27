import express from 'express';
import type { Request } from 'express';

import cors from 'cors';
import morgan from 'morgan'
import { v1Router } from './routes/v1.router.js';
import helmet from 'helmet';
import { errorMiddleware } from './middleware/error_middleware.js';

const app = express();

app.use(helmet())
app.use((req, res, next) => {
    const start = Date.now();
    next()
    const end = Date.now() - start;
    console.log (`Time difference ${end}ms`)
})

// Cors SETUP
let whitelistOrigin = ['http://localhost:3000']
// app.use(cors({
//     origin: function(origin, callback){
//         if (whitelistOrigin.indexOf(origin) !== -1)
//             callback(null, true)
//         else
//             callback(new Error('Not allowed by CORS'))
//     }
// }))

app.use(cors())
app.use(express.json())

morgan.token("body", (req) => {
  const request = req as Request;
  return JSON.stringify(request.body);
});

app.use(morgan(':remote-addr - :remote-user [:date[iso]] ":method :url HTTP/:http-version" :status :res[content-length] :body ":referrer" ":user-agent"'))

app.use('/api/v1', v1Router)
app.use(errorMiddleware);

export {
    app
}