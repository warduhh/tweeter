$(document).ready(function() {
  $("textarea").on("input", function (event) {
   
    event.target.value.length;
    //console to check current length
    console.log(event.target.value.length);
    //check for remaining characters in counter
    $(".counter")[0].value = 140 - event.target.value.length;
    if ($(".counter")[0].value < 0) {
      $(".counter").css({ color: "red" });
    } else {
      $(".counter").css({ color: "black" });
    }
  });
});
