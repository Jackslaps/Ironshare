document.addEventListener('DOMContentLoaded', () => {

  console.log('IronGenerator JS imported successfully!');

}, false);


// $("#admin-create-user-form").css('display', 'none')

// $(document).ready(function(){
  $("#create-user-button").click(function(){
    $("#admin-create-user-form").toggle();
  });
// });