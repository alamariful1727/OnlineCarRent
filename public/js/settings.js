// var getTest = "<%= user.description  %>";  //var test is now assigned to getTest which will only work on browsers
// console.log(getTest);  // successfully prints 101 on browser
// document.getElementById('dob').value = "<%= user.dob  %>";
// var date = new Date();
// var currentDate = date.toISOString().slice(0, 10);
// var currentTime = date.getHours() + ':' + date.getMinutes();
// // console.log(document.getElementById('dob').value);
// // document.getElementById('dob').value = "<%= user.dob  %>";

// function readDate(input) {
//   console.log(input.value);
// }


// cleave.js
var cleave = new Cleave('.input-phone', {
  phone: true,
  phoneRegionCode: 'BD'
});
$('#select-country').change(function () {
  cleave.setPhoneRegionCode(this.value);
  // cleave.setRawValue('');
});

var cleave1 = new Cleave('.cardNumber', {
  creditCard: true,
  onCreditCardTypeChanged: function (type) {
    if (type != 'unknown') {
      document.querySelector('.card-label').innerHTML = '<i class="fab fa-cc-' + type + ' fa-2x"></i>';
    } else {
      document.querySelector('.card-label').innerHTML = '';
    }
  }
});