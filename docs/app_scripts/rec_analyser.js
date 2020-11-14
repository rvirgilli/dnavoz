var c, ctx, c_width, c_height;

function init_analyser_animation(id) {

    initBinCanvas(id);

    //start updating
    rafID = window.requestAnimationFrame( updateVisualization );

    onWindowResize();

    // loop
    function renderFrame() {
        var array = new Uint8Array(audio_ctx.analyser.frequencyBinCount);
        audio_ctx.analyser.getByteFrequencyData(array);

        //do some stuff
        requestAnimationFrame(renderFrame);
    }
    renderFrame();
};

function start_timer(id){
    if(id == 6) {
        qid = '#rec1';
    } else {
        var qid = '#rec' + id;
    }

    // Set the date we're counting down to
    var countMilis = dict_lengths[id];

    // Update the count down every 50 milliseconds
    var x = setInterval(function() {

        countMilis -= 50;

        $(qid + ' #timer').text(pad((countMilis/1000).toFixed(2), 5))

        if(countMilis == 0){
            clearInterval(x);
        }
    }, 50);
}

function pad(num, size) {
    var s = num+"";
    while (s.length < size) s = "0" + s;
    return s;
}

function initBinCanvas (id) {

    //add new canvas
    "use strict";
    var qid = '#rec' + id + ' #freq'
    c = $(qid)[0]
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
}

function onWindowResize() {
    ctx.canvas.width  = c_width;
    ctx.canvas.height = c_height;
}

function updateVisualization () {

    // get the average, bincount is fftsize / 2
    if (audio_ctx.hasSetupUserMedia) {
        var array = new Uint8Array(audio_ctx.analyser.frequencyBinCount);
        audio_ctx.analyser.getByteFrequencyData(array);

        drawBars(array);
    }

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
    var radius = -145;

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

function kill_analyser_animation() {
    window.cancelAnimationFrame(rafID);
}