const faker = require('faker');
const fs = require('fs');
const db = './db.json';

const data = fakeData = () => {
    let students = [];
    for(let i = 0; i < 50; i += 1) {
        students.push({
            id: i + 1,
            name: faker.name.firstName(), 
            lastName: faker.name.lastName(), 
            job: faker.name.jobTitle(), 
            city:faker.address.city(), 
            email:faker.internet.email(), 
            address: faker.address.streetAddress(), 
            company: faker.company.companyName()
        })
    }

    return {
        "population": students
    }
}

const json = JSON.stringify(data()); 

fs.writeFile(db, json, 'utf8',  (err) => {
    if (err) throw err;
    console.log('The file has been saved!');
  });