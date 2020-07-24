import pandas as pd
import numpy as np
import hashlib
import os

class ApiController:

    accepted_types = {'audio/wav':'wav', 'audio/ogg':'ogg'}

    def __init__(self, csv_path, wavs_path, mime_type='audio/wav'):
        if mime_type not in self.accepted_types.keys():
            raise Exception('Mime type not suported: ' + mime_type)

        self.wavs_path = wavs_path
        self.mime_type = mime_type

        if os.path.exists(csv_path):
            self.df = pd.read_csv(csv_path)
        else:
            dtypes = np.dtype([
                ('name', str),
                ('email', str),
                ('file_path', str),
                ('enrollment', bool),
                ('self', bool)
            ])

            data = np.empty(0, dtype=dtypes)
            self.df = pd.DataFrame(data)
            self.df.to_csv(csv_path, index=False)

    def save_file(self, blob, email, enrollment, self_voice):

        #define file name
        filename

        folder = os.path.join(self.wavs_path, folder_name, "self" if self_voice else "other")

        file_name = str(len(os.listdir(folder))).zfill(5) + ".wav"

        audio_data.save(os.path.join(folder, file_name))

        #salvar o arquivo
        file_path = os.path.join()

    def add_row(self, name, email):
        return


    def hash_string(text):
        return hashlib.md5(text.encode('utf-8')).hexdigest()[:16]

    def get_name_by_email(self, email):
        users = self.df.groupby(['email']).first()
        if email in users.index:
            return users.loc[email]['name']
        else:
            return False