# -*- coding: utf-8 -*-
import flask
from flask import request, jsonify
from flask_cors import CORS

#from api_controller import ApiController


app = flask.Flask(__name__)
CORS(app)
app.config["DEBUG"] = True

@app.route("/")
def hello():
    return "Hello world from api.py"

@app.route('/test', methods=['GET'])
def test():
    return "test"

@app.route('/email', methods=['POST'])
def email():
    email = request.form['user_email']
    j = "" #jsonify({'email_bool': db.check_email(email)})
    return j

@app.route('/enroll', methods=['POST', 'GET'])
def enroll():
    audios = request
    audio_data = request.files['audio_data']
    audio_data.save(audio_data.filename)
    return False

def enrollment():
    return True

wavs_path = './audios'
csv_path = './db.csv'

if __name__ == "__main__":
    #db = ApiController(csv_path, wavs_path)
    app.run()