# -*- coding: utf-8 -*-
import flask
from flask import request, jsonify
from flask_cors import CORS, cross_origin
from tasks import check_user, add_user, enroll_audio

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
#@cross_origin()
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


@app.route('/enroll', methods=['POST'])
#@cross_origin()
def enroll():
    email = request.form['user_email']
    audio_content = request.form['audio_content']
    audio_data = request.files['audio_data']

    a = enroll_audio(email, audio_content, audio_data)

    #todo create method to validate and save audio

    j = jsonify({'enroll_bool': True})
    return j

def enrollment():
    return True

if __name__ == "__main__":
    app.run()