 //the readability of JOI is a large selling point
// export the validation to an external function 

function validateform() {
  var name = document.myform.name.value;
  var password = document.myform.password.value;

  if (name == null || name == "") {
    alert("Name can't be blank");
    return false;
  } else if (password.length < 6) {
    alert("Password must be at least 6 characters long.");
    return false;
  }
}

function validate() {
  var num = document.myform.num.value;
  if (isNaN(num)) {
    document.getElementById("numloc").innerHTML = "Enter Numeric value only";
    return false;
  } else {
    return true;
  }
}

function validateemail() {
  var x = document.myform.email.value;
  var atposition = x.indexOf("@");
  var dotposition = x.lastIndexOf(".");
  if (atposition < 1 || dotposition < atposition + 2 || dotposition + 2 >= x.length) {
    alert("Please enter a valid e-mail address \n atpostion:" + atposition + "\n dotposition:" + dotposition);
    return false;
  }
}


// strip certain values

const schema = Joi.object({
    username: Joi.string(),
    password: Joi.string().strip()
});

// can be used in the validation callback when creating a new object from the validated data 

schema.validate({ username: 'test', password: 'hunter2' }, (err, value) => {
    // value = { username: 'test' }
});

const schema = Joi.array().max(10).items(Joi.string(), Joi.any().strip());


schema.validate(['one', 'two', true, false, 1, 2], (err, value) => {
    // value = ['one', 'two']
});

/******************************/

// custom error message 
// the label from the callback error variable
var schema = Joi.object().keys({
    firstName: Joi.string().min(5).max(10).required().label("Your error message in here"),
    lastName: Joi.string().min(5).max(10).required()
  });
