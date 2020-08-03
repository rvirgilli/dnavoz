//script for demo.html

function init_demo(){
    //ajax for send email
    var sendEmailButton = document.getElementById("sendEmailButton");
    sendEmailButton.addEventListener("click", check_user);
}

function check_user(){
    var user_email = $('#emailForm > input').val()
    api_ctx.check_user(user_email, function (name){
        $('#h1_name').html("Olá, " + name);
        $('#email-true').showMenu();
    }, function (){
        $('#email-false > div > a')[0].href += '?email=' + user_email
        $('#email-false').showMenu();
    })
}