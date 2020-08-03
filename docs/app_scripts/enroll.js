//page first-time
var audio_ctx, user_email, red_id, owl;

function init_enroll(){
    owl = $('.owl-carousel');
    audio_ctx = new AppAudioContext(fftSize, record_as_wav);
    var urlParams = new URLSearchParams(window.location.search);
    user_email = urlParams.get('email');
    $('input#user_email').val(user_email);
    $('#name_ok').on('click', update_name);

    $()
}

function listener(event) {
  var l = document.createElement("li");
  switch(event.type) {
    case "animationstart":
      l.innerHTML = "Started: elapsed time is " + event.elapsedTime;
      break;
    case "animationend":
      l.innerHTML = "Ended: elapsed time is " + event.elapsedTime;
      break;
    case "animationiteration":
      l.innerHTML = "New loop started at time " + event.elapsedTime;
      break;
  }
  document.getElementById("output").appendChild(l);
}

function update_name(){
    var user_name = $('#name_form [name="user_name"]').val()
    api_ctx.update_name(user_email, user_name, function (){
        red_id = 1;
        init_recorder();
        owl.trigger('to.owl.carousel', [1]);
    }, function (){
        //todo: properly handle name update error
        generic_error_callback('update_name error')
    });
}

function init_recorder(){
    //initBinCanvas();
    $('#rec' + red_id + ' #timer').text(pad((utterance_length/1000).toFixed(2), 5))
    if (!audio_ctx.hasSetupUserMedia){
        $('#modal-acesso').showMenu();
        $('#btn_authorize').on('click', function(){
            audio_ctx.get_audio_authorization(function (){
                init_analyser_animation(red_id);
                $('#modal-acesso').hideMenu();
            });
        })
    }

    $('#rec' + red_id + ' .container #btn' + red_id).on('click', function(){
        //$(this).prop('disabled', true);
        //$(this).prop("onclick", null).off("click");
        audio_ctx.start_recording();
        start_timer(red_id);
        setTimeout(function(){
            audio_ctx.stop_recording(function (blob){
                api_ctx.upload_blob(user_email, blob, function (){
                    switch (red_id){
                        case 1:
                            record1_success();
                            break;
                        case 2:
                            record2_success();
                            break;
                        case 3:
                            record3_success();
                        default:
                            console.log('recorder error: out of range');
                    }
                }, function (){
                    generic_error_callback('recorder ' + red_id + ' error');
                });
            })
            $('#rec' + red_id + ' .checkmark').css("visibility", "visible");
            kill_analyser_animation();
        }, utterance_length);
    })
}

function record1_success(){
    $('#rec1-success > a').on('click', function (){
        red_id = 2
        init_recorder();
        init_analyser_animation(2);
        $('#rec1-success').hideMenu()
        owl.trigger('to.owl.carousel', [2]);
    })
    $('#rec1-success').showMenu()
}

function record2_success(){
    $('#rec2-success > a').on('click', function (){
        red_id = 3;
        init_recorder();
        init_analyser_animation(3);
        $('#rec2-success').hideMenu()
        owl.trigger('to.owl.carousel', [3]);
    })
    $('#rec2-success').showMenu()
}

function record3_success(){
    owl.trigger('to.owl.carousel', [4]);
}

//$.fn.showMenu = function() {$(this).addClass('menu-active'); $('#footer-bar').addClass('footer-menu-hidden');setTimeout(function(){$('.menu-hider').addClass('menu-active');},250);};
//$.fn.hideMenu = function() {$(this).removeClass('menu-active'); $('#footer-bar').removeClass('footer-menu-hidden');$('.menu-hider').removeClass('menu-active');};
