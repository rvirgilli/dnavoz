from api_controller import ApiController
from celery import Celery

app = Celery('tasks', broker='pyamqp://guest@localhost//')

users_csv = './csvs/users.csv'
audios_csv = './csvs/audios.csv'
audios_folder = './audios'

ctl = ApiController(users_csv=users_csv, audios_csv=audios_csv, audios_folder=audios_folder)

@app.task
def check_user(email):
    return ctl.check_user(email)

@app.task
def add_user(email, name):
    return ctl.add_user(email, name)

@app.task
def enroll_audio(email, audio_content, audio_data):
    return ctl.enroll_audio(email, audio_content, audio_data)

@app.task
def update_status(email, status):
    return ctl.update_enrollment_status(email, status)