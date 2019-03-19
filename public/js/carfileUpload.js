////////////// file preview /////////////////
function readURL(input) {
  if (input.files && input.files[0]) {

    var reader = new FileReader();

    reader.onload = function (e) {
      $('.image-upload-wrap').hide();

      $('.file-upload-image').attr('src', e.target.result);
      $('.file-upload-content').show();

      $('.image-title').html(input.files[0].name);
    };

    reader.readAsDataURL(input.files[0]);
    // console.log(reader);

  } else {
    removeUpload();
  }
}

function removeUpload() {
  $('.file-upload-input').replaceWith($('.file-upload-input').clone());
  $('.file-upload-content').hide();
  $('.image-upload-wrap').show();
  $("#profile").val('');
}

$('.image-upload-wrap').bind('dragover', function () {
  $('.image-upload-wrap').addClass('image-dropping');
});
$('.image-upload-wrap').bind('dragleave', function () {
  $('.image-upload-wrap').removeClass('image-dropping');
});

function isEmpty(obj) {
  for (var key in obj) {
    if (obj.hasOwnProperty(key))
      return false;
  }
  return true;
}

// file upload [Ajax using axios]
document.getElementById('upload_file').addEventListener("click", function () {

  var profile = document.getElementById('profile').files;

  var formData = new FormData();

  for (var i = 0; i < profile.length; i++) {
    formData.append("profile", profile[i]);
  }

  var contentType = {
    headers: {
      "content-type": "multipart/form-data"
    }
  };

  axios.post('/cars/upload', formData, contentType)
    .then(function (response) {

      var errField = document.getElementById('danger_msg');
      var successField = document.getElementById('success_msg');

      if (typeof response.data.msg != 'undefined') {
        $('#success_msg').addClass('d-block').removeClass("d-none");
        console.log("d");
        successField.innerHTML = response.data.msg;
        $('#danger_msg').addClass('d-none').removeClass("d-block");
        window.location.href = "http://localhost:4545/cars";
      } else if (response.data.errMsg == 'Error: No File Selected!') {
        $('#danger_msg').addClass('d-block').removeClass("d-none");
        errField.innerHTML = response.data.errMsg;
        console.log("a");
        $('#success_msg').addClass('d-none').removeClass("d-block");
      } else if (response.data.errMsg.message == 'File too large') {
        $('#danger_msg').addClass('d-block').removeClass("d-none");
        errField.innerHTML = "Error: " + response.data.errMsg.message;
        console.log("b");
        $('#success_msg').addClass('d-none').removeClass("d-block");
      } else if (response.data.errMsg == 'Error: Images Only!') {
        $('#danger_msg').addClass('d-block').removeClass("d-none");
        errField.innerHTML = response.data.errMsg;
        console.log("c");
        $('#success_msg').addClass('d-none').removeClass("d-block");
      }
    })
    .catch(function (error) {
      console.log("EEE", error);
    });

});

// file uploads ends