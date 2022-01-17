const express = require('express')
require('./db/mongoose')
const userRouter = require('./routes/user')
const moduleRouter = require('./routes/module')
const swaggerJsDoc = require('swagger-jsdoc')
const swaggerUI = require('swagger-ui-express')
const app = express()
const port = process.env.PORT || 3000
const swaggerOptions = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Auth Api",
            version: "1.0.0",
            description: "A simple Express Auth Api",
        },
        servers: [
            {
                url: "http://localhost:3000",
            },
        ],
    },
    apis: ["./src/routes/*.js"],
}
const swaggerDocs = swaggerJsDoc(swaggerOptions)

app.use(express.json())
app.use(userRouter)
app.use(moduleRouter)
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerDocs))


app.listen(port, '192.168.68.119', () => { console.log('listening on port' + port) })

