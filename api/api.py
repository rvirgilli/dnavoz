# -*- coding: utf-8 -*-
import flask
from flask import request, jsonify
from flask_cors import CORS, cross_origin
from tasks import check_user, add_user, process_audio, update_status, set_confirmation

app = flask.Flask(__name__)
CORS(app, origins=['http://localhost:63342', 'https://rvirgilli.github.io'])
app.config["DEBUG"] = True
app.config['CORS_HEADERS'] = 'Content-Type'

@app.after_request
def after_request_func(response):
    response.headers['Access-Control-Allow-Origin'] = '*'
    print("after_request is running!")
    return response

@app.route("/")
#@cross_origin()
def hello():
    return "Hello world from api.py"

@app.route('/test', methods=['GET'])
def test():
    return "test"

@app.route('/check_user', methods=['POST'])
@cross_origin()
def checkuser():
    email = request.form['user_email']
    j = jsonify(check_user(email))
    return j

@app.route('/add_user', methods=['POST'])
@cross_origin()
def adduser():
    email = request.form['user_email']
    name = request.form['user_name']
    j = jsonify({'name_bool': add_user(email, name)})
    return j


@app.route('/upload_audio', methods=['POST'])
@cross_origin()
def upload_audio():
    email = request.form['user_email']
    content_type = request.form['content_type']
    status = int(request.form['status'])
    audio_data = request.files['audio_data']

    resp = process_audio(email, content_type, audio_data)

    if status >= 0: #not a verification
        update_status(email, status)

    j = jsonify(resp)
    return j

@app.route('/set_confirmation', methods=['POST'])
@cross_origin()
def confirmation():
    file_id = request.form['file_id']
    value = request.form['confirmation_value']
    confirmation_bool = set_confirmation(file_id, value)
    j = jsonify({'confirmation_bool': confirmation_bool})
    return j

if __name__ == "__main__":
    app.run()