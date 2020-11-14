//script for demo.html

function init_demo(){
    //ajax for send email
    var sendEmailButton = document.getElementById("sendEmailButton");
    sendEmailButton.addEventListener("click", check_user);
}

function check_user(){
    var user_email = $('#emailForm > input').val()
    api_ctx.check_user(user_email, function (resp){
        setCookie('email', user_email, 365);
        setCookie('name', resp['name'], 365);
        setCookie('status', resp['status'], 365);
        setCookie('n_audios', resp['n_audios'], 365);

        var status = resp['status']
        var name = resp['name']

        //cadastro completo
        if (status == 6) {
            $('#h1_name').html("Olá, " + name);
            $('#complete').showMenu();
        }
        //cadastro não iniciado
        else if (status == 0) {
            $('#signup > div > h3').text('Novo cadastro')
            $('#signup > div > p').text("Vamos fazer o cadastro? Não leva nem 1 minuto.")
            $('#signup').showMenu();
        }
        //cadastro iniciado
        else if (status > 0 && status < 6) {
            $('#signup > div > h3').text('Cadastro incompleto')
            $('#signup > div > p').text("Vamos continuar o cadastro? Não leva nem 1 minuto.")
            $('#signup').showMenu();
        }
        //erro
        else {
            console.log('check_user status error')
        }

    }, function(){
        console.log('check_user error');
    })
}