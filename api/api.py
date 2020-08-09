# -*- coding: utf-8 -*-
import flask
from flask import request, jsonify
from flask_cors import CORS, cross_origin

from api_controller import ApiController


app = flask.Flask(__name__)
CORS(app, origins=['http://localhost:63342', 'https://rvirgilli.github.io'])
app.config["DEBUG"] = True
#app.config['CORS_HEADERS'] = 'Content-Type'

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
    j = jsonify({'email_bool': ctl.get_name_by_email(email)})
    return j

@app.route('/name', methods=['POST'])
@cross_origin()
def name():
    email = request.form['user_email']
    name = request.form['user_name']
    j = jsonify({'name_bool': ctl.update_name(email, name)})
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

users_csv = './csvs/users.csv'
audios_csv = './csvs/audios.csv'
audios_folder = './audios'

if __name__ == "__main__":
    ctl = ApiController(users_csv=users_csv, audios_csv=audios_csv, audios_folder=audios_folder)
    app.run()