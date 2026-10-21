import express from 'express'
import brandRouter from './routes/brand-route.js'
import productLineRouter from "./routes/productline-route.js";
import productRouter from "./routes/product-route.js";

import {errorHandler} from "./middlewares/error-handler.js";
import {queryParser} from "./middlewares/pagination-middleware.js";

const STUDENT_ID = '67130500004'
const app = express()
app.use(express.json())
app.use(queryParser())
// Test queryParser
app.get('/', (req, res) => {
    console.log(req.pagination)
    res.json(req.pagination)
})

app.get(`/api/${STUDENT_ID}/student-info`, (req, res) =>
    res.json(
        {
            success: true,
            data: {
                studentId: STUDENT_ID,
                name: "Kittithat Yotkh",
                secretKey: "30KiYo"
            },
            "timestamp": "2026-10-08T15:00:00.000Z"
        }
    )
)
app.use(`/api/${STUDENT_ID}/brands`, brandRouter)
// app.use(`/api/${STUDENT_ID}/offices`, officeRouter)
app.use(`/api/${STUDENT_ID}/productlines`, productLineRouter)
app.use(`/api/${STUDENT_ID}/products`, productRouter)

app.listen(3000, () => {
    console.log('Example app listening on port 3000')
})

app.use(errorHandler)