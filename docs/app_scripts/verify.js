//page first-time
var audio_ctx, user_email, red_id, owl;

function init_verify(){
    user_email = getCookie('email');

    console.log('init_verify');
    owl = $('.owl-carousel');

    //get user infos from cookie
    audio_ctx = new AppAudioContext(fftSize, record_as_wav);
    init_recorder_verify();
}


function init_recorder_verify(){
    //initBinCanvas();
    $('#rec1 #timer').text(pad((dict_lengths[6]/1000).toFixed(2), 5))
    if (!audio_ctx.hasSetupUserMedia){
        $('#modal-acesso').showMenu();
        owl = $('.owl-carousel');
        owl.trigger('to.owl.carousel', [0]);
        $('#btn_authorize').on('click', function(){
            audio_ctx.get_audio_authorization(function (){
                //init_analyser_animation(rec_id);
                $('#modal-acesso').hideMenu();
            });
        })
    }

    $('#rec1 .container #btn1').on('click', function(){
        //$(this).prop('disabled', true);
        //$(this).prop("onclick", null).off("click");
        audio_ctx.start_recording();
        start_timer(6);
        setTimeout(function(){
            audio_ctx.stop_recording(function (blob){
                api_ctx.upload_blob(user_email, blob, -2, function (resp){
                    console.log(resp)
                    //
                    verification_success(resp);
                }, function (){
                    console.log('recorder verification error');
                });
            });
            $('#rec1 .checkmark').css("visibility", "visible");
            //kill_analyser_animation();
        }, dict_lengths[6]);
    })
}

function verification_success(resp){
    verification_id = resp['id'];
    verification_value = resp['verification'];
    $('#verification_id').val(verification_value)

    if (verification_value == 1) {
        $('#confirm-verification > h1').text("É a sua voz!");
        $('#confirm-verification').showMenu();
    } else if (verification_value == -1) {
        $('#confirm-verification > h1').text("Não é a sua voz!");
        $('#confirm-verification').showMenu();
    } else {
        console.log('verification_value error');
    }

    $('#confirm-verification a').first().on('click', function (){
        api_ctx.set_confirmation(verification_id, 1, function(){
            //todo: give positive answer
            console.log('thanks');
        }, function(){
            console.log('set_confimation error')
        });
    });

    $('#confirm-verification a').last().on('click', function (){
        api_ctx.set_confirmation(verification_id, -1, function(){
            //todo: give positive answer
            console.log('apology');
        }, function(){
            console.log('set_confimation error');
        });
    });

}


//$.fn.showMenu = function() {$(this).addClass('menu-active'); $('#footer-bar').addClass('footer-menu-hidden');setTimeout(function(){$('.menu-hider').addClass('menu-active');},250);};
//$.fn.hideMenu = function() {$(this).removeClass('menu-active'); $('#footer-bar').removeClass('footer-menu-hidden');$('.menu-hider').removeClass('menu-active');};
