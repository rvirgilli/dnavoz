//page first-time
var audio_ctx, user_email, red_id, owl;

function init_verify(){
    user_email = getCookie('email');

    console.log('init_verify')
    owl = $('.owl-carousel');

    //get user infos from cookie
    audio_ctx = new AppAudioContext(fftSize, record_as_wav);
    init_recorder(1);
}


function init_recorder(rec_id){
    //initBinCanvas();
    $('#rec' + rec_id + ' #timer').text(pad((dict_lengths[rec_id]/1000).toFixed(2), 5))
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

    $('#rec' + rec_id + ' .container #btn' + rec_id).on('click', function(){
        //$(this).prop('disabled', true);
        //$(this).prop("onclick", null).off("click");
        audio_ctx.start_recording();
        start_timer(rec_id);
        setTimeout(function(){
            audio_ctx.stop_recording(function (blob){
                api_ctx.upload_blob(user_email, blob, -2, function (resp){
                    console.log(resp)

                    //
                    record1_success();
                }, function (){
                    generic_error_callback('recorder ' + red_id + ' error');
                });
            });
            $('#rec' + rec_id + ' .checkmark').css("visibility", "visible");
            //kill_analyser_animation();
        }, verify_length);
    })
}

function record1_success(){
    $('#rec1-success > a').on('click', function (){
        $('#rec1-success').hideMenu()
        owl.trigger('to.owl.carousel', [1]);
    })
    $('#rec1-success').showMenu()
}


//$.fn.showMenu = function() {$(this).addClass('menu-active'); $('#footer-bar').addClass('footer-menu-hidden');setTimeout(function(){$('.menu-hider').addClass('menu-active');},250);};
//$.fn.hideMenu = function() {$(this).removeClass('menu-active'); $('#footer-bar').removeClass('footer-menu-hidden');$('.menu-hider').removeClass('menu-active');};
