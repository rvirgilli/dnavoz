import pandas as pd
import numpy as np
import hashlib
import os

class ApiController:

    accepted_types = {'audio/wav':'wav', 'audio/ogg':'ogg'}

    def __init__(self, users_csv, audios_csv, audios_folder, mime_type='audio/wav'):
        if mime_type not in self.accepted_types.keys():
            raise Exception('Mime type not suported: ' + mime_type)

        self.mime_type = mime_type
        self.audios_folder = audios_folder
        self.users_csv = users_csv
        self.audios_csv = audios_csv

        if os.path.exists(users_csv):
            self.users = pd.read_csv(users_csv, index_col='email')
        else:
            dtypes = np.dtype([
                ('email', str),
                ('name', str),
                ('status', int),
                ('n_audios', int)
            ])

            users_df = np.empty(0, dtype=dtypes)
            self.users = pd.DataFrame(users_df).set_index('email')
            self.users.to_csv(users_csv)

        if os.path.exists(audios_csv):
            self.audios = pd.read_csv(audios_csv)
        else:
            dtypes = np.dtype([
                ('email', str),
                ('file_name', str),
                ('enrollment', bool),
                ('owner_voice', bool)
            ])

            #todo identify device by cookie (to compare same user from different devices)

            audios_df = np.empty(0, dtype=dtypes)
            self.audios = pd.DataFrame(audios_df)
            self.audios.to_csv(audios_csv, index=False)

    def save_users_csv(self):
        self.users.to_csv(self.users_csv)


    def save_file(self, audio_data, email, enrollment, owner_voice):

        #define file name
        filename

        folder = os.path.join(self.wavs_path, folder_name, "self" if self_voice else "other")

        file_name = str(len(os.listdir(folder))).zfill(5) + ".wav"

        audio_data.save(os.path.join(folder, file_name))

        #salvar o arquivo
        file_path = os.path.join()

    def update_name(self, email, name):
        if name and email in self.users.index:
            self.users.loc[email, 'name'] = name
            self.save_users_csv()
            return True
        else:
            return False

    def hash_string(text):
        return hashlib.md5(text.encode('utf-8')).hexdigest()[:16]

    def get_name_by_email(self, email):
        if email in self.users.index:
            return self.users.loc[email, 'name']
        else:
            return False