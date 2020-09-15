# -*- coding: utf-8 -*-
import flask
from flask import request, jsonify
from flask_cors import CORS, cross_origin
from tasks import get_name_by_email, update_name

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

@app.route('/email', methods=['POST'])
#@cross_origin()
def email():
    email = request.form['user_email']
    j = jsonify({'email_bool': get_name_by_email(email)})
    return j

@app.route('/name', methods=['POST'])
@cross_origin()
def name():
    email = request.form['user_email']
    name = request.form['user_name']
    j = jsonify({'name_bool': update_name(email, name)})
    return j


@app.route('/enroll', methods=['POST', 'GET'])
#@cross_origin()
def enroll():
    email = request.form['user_email']
    audio_data = request.files['audio_data']

    #todo create method to validate and save audio

    audio_data.save(audio_data.filename)
    j = jsonify({'enroll_bool': True})
    return j

def enrollment():
    return True

if __name__ == "__main__":
    app.run()