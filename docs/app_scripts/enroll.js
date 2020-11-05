//page first-time
var audio_ctx, user_email, red_id, owl;

var steps = ['email', 'rec1', 'rec2', 'rec3', 'rec4', 'rec5', 'final'];

function init_enroll(){
    console.log('init_enroll')
    owl = $('.owl-carousel');
    owl.trigger('to.owl.carousel', [1]);

    //get user infos from cookie
    user_email = getCookie('email');
    user_name = getCookie('name');
    user_status = getCookie('status');
    user_n_audios = getCookie('n_audios');

    audio_ctx = new AppAudioContext(fftSize, record_as_wav);

    start_at_step(user_status);
}

function move_to_start_step(){
    var user_status = getCookie('status');
    owl = $('.owl-carousel');
    owl.trigger('to.owl.carousel', [user_status]);
}

function start_at_step(start_step){
    if (start_step == 0)
        init_step_email();
    else if (start_step == 1){
        //1o audio de referencia
        owl.trigger('to.owl.carousel', [1]);
        init_recorder(1);
    }
    else if (start_step == 2){
        //2o audio de referencia
        owl.trigger('to.owl.carousel', [2]);
        init_recorder(2);
    }
    else if (start_step == 3){
        //3o audio de referencia
        owl.trigger('to.owl.carousel', [3]);
        init_recorder(3);
    }
    else if (start_step == 4){
        //keyword
        owl.trigger('to.owl.carousel', [4]);
        init_recorder(4);
    }
    else if (start_step == 5){
        //silêncio
        owl.trigger('to.owl.carousel', [5]);
        init_recorder(5);
    }
    else if (start_step == 6){
        //fim
        owl.trigger('to.owl.carousel', [6]);
    }
}

/*
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
*/

function update_name(){
    var user_name = $('#name_form [name="user_name"]').val()
    api_ctx.update_name(user_email, user_name, function (){
        init_recorder(1);
        owl.trigger('to.owl.carousel', [1]);
    }, function (){
        //todo: properly handle name update error
        generic_error_callback('update_name error')
    });
}

function init_step_email() {
    $('input#user_email').val(user_email);
    $('#name_ok').on('click', update_name);
    owl.trigger('to.owl.carousel', [0]);
}

function init_recorder(rec_id){
    //initBinCanvas();
    $('#rec' + rec_id + ' #timer').text(pad((dict_lengths[rec_id]/1000).toFixed(2), 5))
    if (!audio_ctx.hasSetupUserMedia){
        $('#modal-acesso').showMenu();
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
                api_ctx.upload_blob(user_email, blob, rec_id, function (){
                    switch (rec_id){
                        case 1:
                            record1_success();
                            break;
                        case 2:
                            record2_success();
                            break;
                        case 3:
                            record3_success();
                            break;
                        case 4:
                            record4_success();
                            break;
                        case 5:
                            record5_success();
                            break;
                        default:
                            console.log('recorder error: out of range');
                            break;
                    }
                }, function (){
                    generic_error_callback('recorder ' + red_id + ' error');
                });
            })
            $('#rec' + rec_id + ' .checkmark').css("visibility", "visible");
            kill_analyser_animation();
        }, dict_lengths[rec_id]);
    })
}

function record1_success(){
    $('#rec1-success > a').on('click', function (){
        init_recorder(2);
        $('#rec1-success').hideMenu()
        owl.trigger('to.owl.carousel', [2]);
    })
    $('#rec1-success').showMenu()
}

function record2_success(){
    $('#rec2-success > a').on('click', function (){
        init_recorder(3);
        $('#rec2-success').hideMenu()
        owl.trigger('to.owl.carousel', [3]);
    })
    $('#rec2-success').showMenu()
}

function record3_success(){
    $('#rec3-success > a').on('click', function (){
        init_recorder(4);
        $('#rec3-success').hideMenu()
        owl.trigger('to.owl.carousel', [4]);
    })
    $('#rec3-success').showMenu()
}

function record4_success(){
    $('#rec4-success > a').on('click', function (){
        init_recorder(5);
        $('#rec4-success').hideMenu()
        owl.trigger('to.owl.carousel', [5]);
    })
    $('#rec4-success').showMenu()
}

function record5_success(){
    owl.trigger('to.owl.carousel', [6]);
}

//$.fn.showMenu = function() {$(this).addClass('menu-active'); $('#footer-bar').addClass('footer-menu-hidden');setTimeout(function(){$('.menu-hider').addClass('menu-active');},250);};
//$.fn.hideMenu = function() {$(this).removeClass('menu-active'); $('#footer-bar').removeClass('footer-menu-hidden');$('.menu-hider').removeClass('menu-active');};
