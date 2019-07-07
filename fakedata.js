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

  //appending to the file, read first then write. 
//   fs.readFile('myjsonfile.json', 'utf8', function readFileCallback(err, data){
//     if (err){
//         console.log(err);
//     } else {
//     obj = JSON.parse(data); //now it an object
//     obj.table.push({id: 2, square:3}); //add some data
//     json = JSON.stringify(obj); //convert it back to json
//     fs.writeFile('myjsonfile.json', json, 'utf8', callback); // write it back 
// }});