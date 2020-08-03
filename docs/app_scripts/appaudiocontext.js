class AppAudioContext{
    constructor(fftSize, record_as_wav) {
        this.record_as_wav = record_as_wav;
        this.context = null;
        this.hasSetupUserMedia = false;
        this.fftSize = fftSize;
        this.audio_blob = null;
        this.chunks = [];
    }

    get self(){
        return this;
    }

    get_audio_authorization(callback) {
        this.context = new (AudioContext || webkitAudioContext)();
        navigator.mediaDevices.getUserMedia({ audio: true, video: false }).then(stream => this.init_audio_objects(stream, callback));
    }

    init_audio_objects(stream, callback){
        this.hasSetupUserMedia = true;
        this.source = this.context.createMediaStreamSource(stream);
        this.merger = this.context.createChannelMerger(this.source.channelCount);
        this.source.connect(this.merger)
        this.dest = this.context.createMediaStreamDestination();
        this.analyser = this.context.createAnalyser();
        this.analyser.fftSize = this.fftSize;
        this.merger.connect(this.analyser);
        this.analyser.connect(this.dest);

        if (this.record_as_wav){
            this.mediaRecorder = new Recorder(this.source,{numChannels:1});
        } else {
            this.mediaRecorder = new MediaRecorder(this.dest.stream, {
                  mimeType : 'audio/webm;codecs=opus'
            });

            this.mediaRecorder.ondataavailable = function(evt) {
                // push each chunk (blobs) in an array
                this.chunks.push(evt.data);
            }.bind(this);

            this.mediaRecorder.onstop = function(evt) {
                // Make blob out of our blobs, and open it.
                this.audio_blob = new Blob(this.chunks, { 'type' : 'audio/ogg; codecs=opus' });
            }.bind(this);
        }
        callback();
    }

    start_recording() {
        if (this.record_as_wav) {
            this.mediaRecorder.record();
        }
        else {
            this.mediaRecorder.start();
        }
    }

    stop_recording(callback) {
        this.mediaRecorder.stop();
        if (this.record_as_wav) {
            this.mediaRecorder.exportWAV(function (blob){
                this.audio_blob = blob;
            });
        };
        var wait_for_blob = setInterval(function (){
            if(this.audio_blob){
                clearInterval(wait_for_blob);
                callback(this.audio_blob);
            }
        }.bind(this), 100);
    }
}