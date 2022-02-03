import { Router } from 'express';
const APIInfo = Router();

APIInfo.get('/', (req, res) => {
    res.send({
        status: 'Success', message: {
            processId: process.pid,
            platform: process.platform,
            version: process.version,
            memory: process.memoryUsage(),
            path: process.execPath,
            folder: process.cwd()
    }})
})

export default APIInfo;