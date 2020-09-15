from api_controller import ApiController
from celery import Celery

app = Celery('tasks', broker='pyamqp://guest@localhost//')

users_csv = './csvs/users.csv'
audios_csv = './csvs/audios.csv'
audios_folder = './audios'

ctl = ApiController(users_csv=users_csv, audios_csv=audios_csv, audios_folder=audios_folder)

@app.task
def get_name_by_email(email):
    return ctl.get_name_by_email(email)

@app.task
def update_name(email, name):
    return ctl.update_name(email, name)