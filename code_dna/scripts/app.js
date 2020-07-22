//config constants
const blob_url = "http://127.0.0.1:5000/audio"


//page index
if($('#index')[0]){
    //ajax for send email
    var sendEmailButton = document.getElementById("sendEmailButton");
    sendEmailButton.addEventListener("click", function(event){
        var xhr=new XMLHttpRequest();
        xhr.responseType = 'json';

        xhr.onload = function() {
            if (xhr.status == 200){
                var resp = xhr.response["email_bool"];
                if (resp){
                    $('#h1_name').html("Olá, " + resp);
                    $('#email-true').showMenu();
                } else{
                    new_email = $('#emailForm > input')[0].value

                    $('#email-false > div > a')[0].href += '?email=' + new_email
                    $('#email-false').showMenu();

                    //usuário não cadastrado
                    //var user_mail = document.getElementById("mail").value
                    //document.getElementById("mail2").value = user_mail

                    //email_div = document.getElementById("email_div")
                    //email_div.style.display = "none"

                    //enroll_div = document.getElementById("enrollment");
                    //enroll_div.style.display = "inline";
                }
            }
            //alert(`Loaded: ${xhr.status} ${xhr.response}`);
        };

        xhr.onerror = function() { // only triggers if the request couldn't be made at all
            alert(`Network Error`);
        };

        var emailForm = document.getElementById("emailForm");

        if (!emailForm.checkValidity()){
            //alert user about wrong email
            return
        }

        var fd = new FormData(emailForm);

        //fd.append("user_email","teste@teste");
        xhr.open("POST","http://127.0.0.1:5000/email",true);
        xhr.send(fd);
    });
}

//page first-time
if($('#first-time')[0]){

    var context;

	initBinCanvas();

    var c, ctx, analyser, c_width, c_height, source, dest, mediaRecorder, user_email;
    var chunks = [];

    var hasSetupUserMedia = false;

    window.onload = function(){
        var urlParams = new URLSearchParams(window.location.search);
        user_email = urlParams.get('email');
        $('input#user_email').val(user_email);

        $('#modal-acesso').showMenu();
        $('#btn_authorize').on('click', function(){
            context = new (AudioContext || webkitAudioContext)();
            $('#modal-acesso').hideMenu();
            navigator.mediaDevices.getUserMedia({ audio: true, video: false }).then(handleSuccess);
        })
    }

    const handleSuccess = function(stream) {

        hasSetupUserMedia = true;
        source = context.createMediaStreamSource(stream);
        dest = context.createMediaStreamDestination();
        analyser = context.createAnalyser();
        analyser.fftSize = 1024;
        source.connect(analyser);

        mediaRecorder = new MediaRecorder(dest.stream);
        analyser.connect(dest);

        mediaRecorder.ondataavailable = function(evt) {
         // push each chunk (blobs) in an array
            console.log('ondataavailable');
            chunks.push(evt.data);
        };

        mediaRecorder.onstop = function(evt) {
            console.log('stop');
            // Make blob out of our blobs, and open it.
            blob = new Blob(chunks, { 'type' : 'audio/ogg; codecs=opus' });
        };

        $('.container #btn').on('click', function(){
            $(this).prop('disabled', true);
            $(this).prop("onclick", null).off("click");
            mediaRecorder.start();
            start_timer();
            setTimeout(function(){
               //mediaRecorder.requestData();
               mediaRecorder.stop();
            }, 3000);
        })

        initBinCanvas();

		hasSetupUserMedia = true;
	  	//convert audio stream to mediaStreamSource (node)
		microphone = context.createMediaStreamSource(stream);
		//create analyser
		if (analyser === null) analyser = context.createAnalyser();
		//connect microphone to analyser
		microphone.connect(analyser);
		//start updating
		rafID = window.requestAnimationFrame( updateVisualization );

		$("#title").html("Mic");
		$("#album").html("Input");
		$("#artist").html("Using");
		onWindowResize();
		$("#title, #artist, #album").css("visibility", "visible");
		$("#freq, body").addClass("animateHue");

        // loop
        function renderFrame() {
            var array = new Uint8Array(analyser.frequencyBinCount);
            analyser.getByteFrequencyData(array);

            //do some stuff
            requestAnimationFrame(renderFrame);
        }
        renderFrame();
    };



    function initBinCanvas () {

        //add new canvas
        "use strict";
        c = document.getElementById("freq");
        c_width = $(c).parent().width();
        c_height = $(c).parent().height();

        c.width = c_width;
        c.height = c_height;
        //get context from canvas for drawing
        ctx = c.getContext("2d");

        ctx.canvas.width  = c_width;
        ctx.canvas.height = c_height;

        window.addEventListener( 'resize', onWindowResize, false );

        //create gradient for the bins
        //var gradient = ctx.createLinearGradient(0, c.height - 300,0,window.innerHeight - 25);
        //gradient.addColorStop(1,'#00f'); //black
        //gradient.addColorStop(0.75,'#f00'); //red
        //gradient.addColorStop(0.25,'#f00'); //yellow
        //gradient.addColorStop(0,'#ffff00'); //white


        //ctx.fillStyle = "#9c0001";
        $('body .container #btn').on('click', function(e){
            console.log(e);
        })
    }

    function onWindowResize() {
        ctx.canvas.width  = c_width;
        ctx.canvas.height = c_height;

        var containerHeight = $("#song_info_wrapper").height();
        var topVal = $(c).parent().height() / 2 - containerHeight / 2;
        $("#song_info_wrapper").css("top", topVal);

        if($(window).width() <= 500) {
            //TODO: not yet working
            $("#title").css("font-size", "40px");
        }
    }

    function updateVisualization () {

        // get the average, bincount is fftsize / 2
        if (hasSetupUserMedia) {
            var array = new Uint8Array(analyser.frequencyBinCount);
            analyser.getByteFrequencyData(array);

            drawBars(array);
        }
           // setTextAnimation(array);


        rafID = window.requestAnimationFrame(updateVisualization);
    }

    function drawBars (array) {

        //just show bins with a value over the treshold
        var threshold = 0;
        // clear the current state
        ctx.clearRect(0, 0, c.width, c.height);
        //the max count of bins for the visualization
        var maxBinCount = array.length;
        //space between bins
        var space = 3;

        ctx.save();


        ctx.globalCompositeOperation='source-over';

        //console.log(maxBinCount); //--> 1024
        ctx.scale(0.5, 0.5);
        ctx.translate(c_width, c_height);
        ctx.fillStyle = "#37BC9B";

        var bass = Math.floor(array[1]); //1Hz Frequenz
        //var radius = 0.45 * $(window).width() <= 450 ? -(bass * 0.25 + 0.45 * $(window).width()) : -(bass * 0.25 + 450);
        var radius = -150;

        var bar_length_factor = 1;
        if ($(window).width() >= 785) {
            bar_length_factor = 1.0;
        }
        else if ($(window).width() < 785) {
            bar_length_factor = 1.5;
        }
        else if ($(window).width() < 500) {
            bar_length_factor = 20.0;
        }
        console.log($(window).width());
        //go over each bin
        for ( var i = 0; i < maxBinCount; i++ ){

            if (i >= 256){
                ctx.fillStyle = "#2ECC71";
            }

            var value = array[i];
            if (value >= threshold) {
                //draw bin
                //ctx.fillRect(0 + i * space, c.height - value, 2 , c.height);
                            //ctx.fillRect(i * space, c.height, 2, -value);
                            ctx.fillRect(0, radius, $(window).width() <= 450 ? 2 : 3, -value / bar_length_factor);
                            ctx.rotate((180 / 128) * Math.PI/180);
            }
        }
        /*
        for ( var i = 0; i < maxBinCount; i++ ){

            var value = array[i];
            if (value >= threshold) {

                //draw bin
                //ctx.fillRect(0 + i * space, c.height - value, 2 , c.height);
                            //ctx.fillRect(i * space, c.height, 2, -value);
                            ctx.rotate(-(180 / 128) * Math.PI/180);
                            ctx.fillRect(0, radius, $(window).width() <= 450 ? 2 : 3, -value / bar_length_factor);
            }
        }

        for ( var i = 0; i < maxBinCount; i++ ){

            var value = array[i];
            if (value >= threshold) {

                //draw bin
                //ctx.fillRect(0 + i * space, c.height - value, 2 , c.height);
                            //ctx.fillRect(i * space, c.height, 2, -value);
                            ctx.rotate((180 / 128) * Math.PI/180);
                            ctx.fillRect(0, radius, $(window).width() <= 450 ? 2 : 3, -value / bar_length_factor);
            }
        }
        */
        ctx.restore();
    }

    function start_timer(){
        // Set the date we're counting down to
        var countMilis = 10000;

        // Update the count down every 10 milliseconds
        var x = setInterval(function() {

            countMilis -= 10;

            $('#timer').text(pad((countMilis/1000).toFixed(2), 5))

            if(countMilis == 0){
                clearInterval(x);
            }
        }, 10);
    }

    function pad(num, size) {
        var s = num+"";
        while (s.length < size) s = "0" + s;
        return s;
    }

    function upload_blob(){
        var blob = chunks[0];
        var xhr=new XMLHttpRequest();
        xhr.onload=function(e) {
            if(this.readyState === 4) {
                console.log("Server returned: ",e.target.responseText);
            }
        };
        var fd=new FormData();
        fd.append("user_name", user_email)
        fd.append("audio_data",blob, filename);
        xhr.open(blob_url,true);
        xhr.send(fd);

    }
}

