// {student-id} - {student-name}
import * as service from './services-$id/office-service.js';

// const subjects = await service.getAllObjects()
// console.log(subjects)
const data = {
    // id: 21,
    subject_code: 'INT 099',
    subject_title: 'IT Fundamentals',
    credit: 3
}

// console.log(await service.getObject(parseInt(Math.random() * 20)))

// const subject = await service.createObject(data)
// console.log(subject)

// const subject = await service.updateObject(26,data)
// console.log(subject)

await service.removeObject(26)
console.log(await service.getObject(26))