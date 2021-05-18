import uuid

from models import DataAccess


class User:

    SCHEMA = {
        "user_id": str,
        "email": str,
        "first_name": str,
        "last_name": str,
        "birthday": int
    }

    def __init__(self):
        self.__protected_fields = [
            "_id",
            "user_id",
            "email"
        ]
        self.__collection = "users"
        self.__db = DataAccess.DataAccess()

    def get(self, user_id):
        return self.__db.get({"_id": user_id}, self.__collection)

    def create(self, data):
        if self.__validate_data(data) and not self.__does_user_with_this_email_exist(data["email"]):
            uid = "user" + str(uuid.uuid1())
            data.update({
                "_id": uid,
                "user_id": uid
            })
            self.__db.write_one(data, self.__collection)
            return data
        return None

    def update(self, data):
        if self.__validate_data(data):
            # Prevent protected fields from being updated
            current_data = self.__db.get({"_id": data.get("user_id")}, self.__collection)
            if len(current_data) == 0:
                return None
            current_user = current_data[0]
            for field in self.__protected_fields:
                if current_user.get(field) != data.get(field):
                    return None
            # If no protected fields are being updated, then proceed to write
            self.__db.update_one({"_id": data.get("user_id")}, data, self.__collection)
            return data
        return None

    def delete(self, user_id):
        for collection in DataAccess.DataAccess.COLLECTIONS:
            self.__db.delete_many({"_id": user_id}, collection)
        return user_id

    def __validate_data(self, data):
        for key in self.SCHEMA:
            if key not in data or not isinstance(data[key], self.SCHEMA[key]):
                return False
        return True

    def __does_user_with_this_email_exist(self, email):
        user = self.__db.get({"email": email}, "users")
        if len(user) == 0:
            return False
        return True

