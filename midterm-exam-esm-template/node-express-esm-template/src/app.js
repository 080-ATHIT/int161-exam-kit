// {student-id} - {student-name}
import express from 'express'
import productRouter from "./routes-$id/route.js";

const app = express()
app.use(express.json())

app.use('/', productRouter)

app.listen(3000, () => {
    // {student-id} - {student-name}
    console.log('Example app listening on port 3000')
})

app.use((err,req, res, next) => {})