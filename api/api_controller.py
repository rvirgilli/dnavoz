from DNAdaVoz import DNAdaVoz
import pandas as pd
import pickle
import numpy as np
import uuid
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
        self.pickles_folder = './pickles'
        self.dv = DNAdaVoz()

        if os.path.exists(users_csv):
            dtypes_users = {
                'email': str,
                'name': str,
                'status': int
            }
            self.users = pd.read_csv(users_csv, index_col='email', dtype=dtypes_users)
        else:
            dtypes_users = np.dtype([
                ('email', str),
                ('name', str),
                ('status', int)
            ])
            users_df = np.empty(0, dtype=dtypes_users)
            self.users = pd.DataFrame(users_df).set_index('email')
            self.users.to_csv(users_csv)

        if os.path.exists(audios_csv):
            dtypes_audios = {
                'file_name': str,
                'email': str,
                'content_type': str,
                'verification': int,
                'confirmation': int,
            }
            self.audios = pd.read_csv(audios_csv, index_col='file_name', dtype=dtypes_audios)
        else:
            dtypes_audios = np.dtype([
                ('file_name', str),
                ('email', str),
                ('content_type', str),
                ('verification', int),
                ('confirmation', int)
            ])

            #todo identify device by cookie (to compare same user from different devices)

            audios_df = np.empty(0, dtype=dtypes_audios)

            self.audios = pd.DataFrame(audios_df).set_index('file_name')
            self.audios.to_csv(audios_csv)

    def save_users_csv(self):
        self.users.to_csv(self.users_csv)

    def save_audios_csv(self):
        self.audios.to_csv(self.audios_csv)

    def add_user(self, email, name):
        self.users.loc[email, 'name'] = name
        if name == "":
            self.users.loc[email, 'status'] = int(0)
        else:
            self.users.loc[email, 'status'] = int(1)
        self.save_users_csv()
        return True

    def check_user(self, email):
        if email not in self.users.index:
            self.add_user(email, "")
        dct = self.users.loc[email].to_dict()
        dct['status'] = int(dct['status'])
        self.save_users_csv()
        return dct

    def process_audio(self, email, content_type, audio_data):
        filename = uuid.uuid4().hex
        if audio_data.content_type == 'audio/ogg; codecs=opus':
            ext = '.ogg'
        elif audio_data.content_type == 'wav':
            ext = '.wav'
        else:
            raise Exception('audio type not recognized')

        audio_data.save(os.path.join(self.audios_folder, filename + ext))
        embeddings = self.dv. predict_embeddings(os.path.join(self.audios_folder, filename + ext))
        with open(os.path.join(self.pickles_folder, filename + '.pickle'), "wb") as output_file:
            pickle.dump(embeddings, output_file)

        self.audios.loc[filename, 'email'] = email
        self.audios.loc[filename, 'content_type'] = content_type

        if content_type == "verification":
            verification = self.verify_embedding(email, embeddings)
        else:
            verification = 0

        self.audios.loc[filename, 'verification'] = int(verification)
        self.audios.loc[filename, 'confirmation'] = int(0)
        self.save_audios_csv()
        return {
            'verification': verification,
            'id': filename
        }

    def verify_embedding(self, email, verification_embeddings):
        ref_ids = list(self.audios.loc[(self.audios['email'] == 'rvirgilli@gmail.com') &
                                       (self.audios['content_type'] == 'speech')].index)

        #with open(os.path.join(self.pickles_folder, ref_ids[0] + '.pickle'), "rb") as emb_file:
        #    ref_embeddings = pickle.load(emb_file)

        #concatenate all ref embeddings

        #calculate similarity and give an answer

        #must return -1 (negative) or 1 (positive)
        return 1

    def set_confirmation(self, file_id, value):
        self.audios.loc[file_id, 'confirmation'] = int(value)
        self.save_audios_csv()
        return value

    def update_enrollment_status(self, email, status):
        self.users.loc[email, 'status'] = status
        self.save_users_csv()
        return status
