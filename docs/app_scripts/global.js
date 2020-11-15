console.log('global');

if (!api_ctx)
    var api_ctx = new API_Context(api_base_url);

//put init functions here
function custom_inits() {

    console.log('custom_inits');

    if($('#index')[0]){
        console.log('fuck1');
        init_demo();
    }

    if($('#enroll')[0]){
        console.log('fuck2');
        init_enroll();
    }

    if($('#verify')[0]){
        console.log('fuck3');
        init_verify();
    }
}

function generic_error_callback(error_message){
    console.log(error_message);
}

function setCookie(cname, cvalue, exdays) {
  var d = new Date();
  d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
  var expires = "expires="+d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
  var name = cname + "=";
  var ca = document.cookie.split(';');
  for(var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

