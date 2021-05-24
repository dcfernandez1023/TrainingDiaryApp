import datetime
import hashlib
import os
import uuid
import jwt

from models import DataAccess


class Auth:

    SCHEMA = {
        "user_id": str,
        "hash": bytes
    }

    def __init__(self):
        self.__protected_fields = []
        self.__collection = "user_creds"
        self.__db = DataAccess.DataAccess()
        self.__secret_key = os.getenv("TD_API_AUTH")

    def register(self, user_id, password):
        # If user is already registered, don't add credentials
        if self.__is_user_registered(user_id):
            raise Exception("User Already Exists")
        password_hash = self.__hash_password(password)
        cred_data = {
            "_id": user_id,
            "user_id": user_id,
            "hash": password_hash
        }
        if self.__validate_data(cred_data):
            self.__db.write_one(cred_data, self.__collection)
            return self.__encode_api_token(user_id)
        else:
            # delete user if failed to register
            self.__db.delete_one({"_id": user_id}, "users")
            raise Exception("Invalid Registration Data")

    def login(self, email, password):
        user = self.__get_user_by_email(email)
        if user is None:
            raise Exception("No Such User Exists")
        if self.__verify_password(user["user_id"], password):
            return dict(token=self.__encode_api_token(user["user_id"]), user_id=user["user_id"])
        else:
            raise Exception("Incorrect Password")

    def refresh_api_token(self, token, user_id):
        decode = self.__decode_api_token(token)
        if decode is not None and decode == user_id:
            return self.__encode_api_token(user_id)
        return None

    def __validate_data(self, data):
        for key in self.SCHEMA:
            if key not in data or not isinstance(data[key], self.SCHEMA[key]):
                return False
        return True

    def __hash_password(self, password):
        salt = os.urandom(32)
        key = hashlib.pbkdf2_hmac('sha256', password.encode('utf-8'), salt, 100000)
        password_hash = salt + key
        return password_hash

    def __verify_password(self, user_id, password):
        user_cred = self.__db.get({"_id": user_id}, self.__collection)[0]
        salt = user_cred["hash"][:32]
        actual_hash = user_cred["hash"][32:]
        compare_hash = hashlib.pbkdf2_hmac('sha256', password.encode('utf-8'), salt, 100000)
        if compare_hash == actual_hash:
            return True
        return False

    def __encode_api_token(self, user_id):
        try:
            payload = {
                'exp': datetime.datetime.utcnow() + datetime.timedelta(days=10),
                'iat': datetime.datetime.utcnow(),
                'sub': user_id
            }
            return jwt.encode (
                payload,
                self.__secret_key,
                algorithm="HS256"
            )
        except Exception:
            return None

    def __decode_api_token(self, token):
        try:
            payload = jwt.decode(token, self.__secret_key, algorithms="HS256")
            return payload["sub"]
        except Exception:
            return None

    def __is_user_registered(self, user_id):
        user_cred = self.__db.get({"_id": user_id}, self.__collection)
        if len(user_cred) == 0:
            return False
        return True

    def __get_user_by_email(self, email):
        user = self.__db.get({"email": email}, "users")
        if len(user) == 0:
            return None
        return user[0]
