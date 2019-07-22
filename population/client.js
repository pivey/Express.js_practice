const path = 'http://localhost:3001';
const queryInput = document.querySelector('.queryInput'); 
const form = document.querySelector('.userForm');
const outputDiv = document.querySelector('.output');

form.addEventListener('submit', (e) => {
    const formValue = queryInput.value; 
    e.preventDefault();
    console.log(e.target); 
    console.log('button pressed'); 
    console.log(queryInput.value); 
    axios.get(path + `/api/population/${formValue}`)
    .then((res) => {
        outputDiv.innerHTML = JSON.stringify(res.data);
        console.log(res); 
    }).catch((err) => {
        console.log(err); 
    });
    queryInput.value = ''; 
});

