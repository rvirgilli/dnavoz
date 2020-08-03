var api_ctx = new API_Context(api_base_url)

//put init functions here
function custom_inits() {
    if($('#index')[0]){
        init_demo();
    }

    if($('#enroll')[0]){
        init_enroll();
    }
}

function generic_error_callback(error_message){
    console.log(error_message);
}

