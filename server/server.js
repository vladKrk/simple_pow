const express = require('express')
const app = express()
const port = 3001
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const router = require("./routes/message");
const cors = require("cors");

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'PoW message check',
            version: '1.0.0',
        },
    },
    servers: [
        {
            url: 'http://localhost:3001',
            description: 'Development server',
        },
    ],
    apis: ['./routes/*.js'], // files containing annotations as above
};

const openapiSpecification = swaggerJsdoc(options);

app.use(express.json());
app.use(cors({
    origin: '*'
}));
app.use('/docs', swaggerUi.serve, swaggerUi.setup(openapiSpecification));
app.use('/', router);

app.listen(port, () => {
    console.log(`Server starting on port: ${port}`)
})