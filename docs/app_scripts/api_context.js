class API_Context{
    constructor(api_url) {
        this.api_url = api_url;
        this.upload_audio_url = this.api_url + '/upload_audio'
        this.check_user_url = this.api_url + "/check_user"
        this.add_user_url = this.api_url + "/add_user"
        this.xhr = new XMLHttpRequest();
        this.xhr.responseType = 'json'
        this.xhr.onerror = function() { // only triggers if the request couldn't be made at all
            console.log(`Network Error`);
        };
    }

    check_user(user_email, success_callback, error_callback){
        this.xhr.onload = function() {
            if (this.readyState == 4 && this.status == 200){
                var resp = this.response;
                if (resp){
                    success_callback(resp);
                } else{
                    error_callback();
                }
            }
        };

        var fd = new FormData();
        fd.append("user_email", user_email)
        this.xhr.open("POST", this.check_user_url,true);
        this.xhr.send(fd);
    }

    update_name(user_email, user_name, success_callback, error_callback){
        this.xhr.onload = function() {
            if (this.readyState == 4 && this.status == 200){
                var resp = this.response["name_bool"];
                if (resp){
                    success_callback();
                } else{
                    error_callback();
                }
            }
        };

        var fd = new FormData();
        fd.append("user_email", user_email)
        fd.append("user_name", user_name)
        this.xhr.open("POST", this.add_user_url,true);
        this.xhr.send(fd);
    }

    upload_blob(user_email, blob, rec_id, success_callback, error_callback){
        this.xhr.onload = function() {
            if (this.readyState == 4 && this.status == 200){
                var resp = this.response["enroll_bool"];
                if (resp){
                    success_callback();
                } else{
                    error_callback();
                }
            }
        };

        var content_type;

        if (rec_id == 1 || rec_id == 2 || rec_id == 3)
            content_type = "speech";
        else if (rec_id == 4)
            content_type = "keyword";
        else if (rec_id == 5)
            content_type = "noise";
        else
            console.log('update_blob rec_id error')

        var fd=new FormData();
        fd.append("user_email", user_email);
        fd.append("content_type", content_type);
        fd.append("status", rec_id + 1);
        fd.append("enrollment", true);
        fd.append("audio_data",blob, "audio");
        this.xhr.open("POST", this.upload_audio_url,true);
        this.xhr.send(fd);
    }

    verify_blob(user_email, blob, success_callback, error_callback){
        this.xhr.onload = function() {
            if (this.readyState == 4 && this.status == 200){
                var resp = this.response["enroll_bool"];
                if (resp){
                    success_callback();
                } else{
                    error_callback();
                }
            }
        };

        var content_type;

        var fd=new FormData();
        fd.append("user_email", user_email);
        fd.append("content_type", "verification");
        fd.append("status", -1);
        fd.append("enrollment", false);
        fd.append("audio_data",blob, "audio");
        this.xhr.open("POST", this.upload_audio_url,true);
        this.xhr.send(fd);
    }

    send_hello(){
        this.xhr.onload=function(e) {
            if(this.xhr.readyState === 4) {
                console.log("Server returned: ",e.target.responseText);
            }
        };
        var fd=new FormData();
        this.xhr.open("GET", this.api_url,true);
        this.xhr.send();
    }
}