// {student-id} - {student-name}
import * as service from "../services-$id/service.js"
import express from "express"

const router = express.Router()

router.get("/", async (req, res) => {
    const objects = await service.getAllObjects()
    res.json("Please write your code for build json response as specification")
})

router.get("/:id", async (req, res) => {
    const id = req.params.id
    const object = await service.getObject(id)
    res.json("Please write your code for build json response as specification")
})

router.post("/", async (req, res) => {
    const object = req.body
    const result = await service.createObject(object)
    res.json({result})
})
router.put("/:id", async (req, res) => {
    const id = req.params.id
    const object = await service.updateObject()
    res.json(object)
})
router.delete("/:id", async (req, res) => {
    const id = req.params.id
    await service.removeObject(id)
    res.end()
})

export default router