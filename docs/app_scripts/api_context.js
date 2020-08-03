class API_Context{
    constructor(api_url) {
        this.api_url = api_url;
        this.enroll_url = this.api_url + '/enroll'
        this.check_email_url = this.api_url + "/email"
        this.name_url = this.api_url + "/name"
        this.xhr = new XMLHttpRequest();
        this.xhr.responseType = 'json'
        this.xhr.onerror = function() { // only triggers if the request couldn't be made at all
            console.log(`Network Error`);
        };
    }

    check_user(user_email, success_callback, error_callback){
        this.xhr.onload = function() {
            if (this.readyState == 4 && this.status == 200){
                var resp = this.response["email_bool"];
                if (resp){
                    success_callback(resp);
                } else{
                    error_callback();
                }
            }
        };

        var fd = new FormData();
        fd.append("user_email", user_email)
        this.xhr.open("POST", this.check_email_url,true);
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
        this.xhr.open("POST", this.name_url,true);
        this.xhr.send(fd);
    }

    upload_blob(user_email, blob, success_callback, error_callback){
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

        var fd=new FormData();
        fd.append("user_email", user_email)
        fd.append("audio_data",blob, "audio");
        this.xhr.open("POST", this.enroll_url,true);
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