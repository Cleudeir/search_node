import express from 'express'
import cors from 'cors'
// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();
const port = process.env.PORT

class Server {
    public express

    public constructor() {
        this.express  = express()
        this.middleware()
    }

    private middleware() : void {
        this.express.use(express.json())
        this.express.use(cors())
        this.express.listen(port || 3335, () => {
            console.log(`iniciados na porta ${port || 3335}`)
        })
    }
}
export default new Server().express