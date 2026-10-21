// {student-id} - {student-name}
import * as repo from "../repositories-$id/repository.js"
import mapper from "../mappers-$id/entity-dto-mapper.js"

export async function getObject(id) {
    return mapper.map(await repo.findOne(id));
}

export async function getAllObjects() {
    const objects = await repo.findAll()
    return objects
}

export async function updateObject(id, data) {
    return await repo.update(id, data)
}

export async function removeObject(id) {
    return await repo.remove(id)
}

export async function createObject(data) {
    return await repo.create(data)
}
