from models import DataAccess
import uuid


class BodyFat:

    SCHEMA = {
        "bf_id": str,
        "user_id": str,
        "timestamp": int,
        "day": int,
        "month": int,
        "year": int,
        "percentage": int,
        "notes": str
    }

    def __init__(self):
        self.__protected_fields = [
            "_id",
            "bf_id",
            "user_id"
        ]
        self.__collection = "body_fat"
        self.__db = DataAccess.DataAccess()

    def get(self, user_id):
        return self.__db.get({"user_id": user_id}, self.__collection)

    def get_one(self, bf_id):
        res = self.__db.get({"_id": bf_id}, self.__collection)
        if len(res) > 1 or len(res) == 0:
            return None
        return res[0]

    def create(self, user_id, data):
        if self.__validate_data(data):
            bf_id = "body_fat" + str(uuid.uuid1())
            data.update({
                "_id": bf_id,
                "bf_id": bf_id,
                "user_id": user_id
            })
            self.__db.write_one(data, self.__collection)
            return data
        return None

    def update(self, data):
        if self.__validate_data(data):
            # Prevent protected fields from being updated
            current_data = self.__db.get({"_id": data["bf_id"]}, self.__collection)
            if len(current_data) == 0:
                return None
            current_bf = current_data[0]
            for field in self.__protected_fields:
                if current_bf.get(field) != data.get(field):
                    return None
            self.__db.update_one({"_id": data["bf_id"]}, data, self.__collection)
            return data
        return None

    def delete(self, user_id, bf_id):
        self.__db.delete_one({"_id": bf_id, "user_id": user_id}, self.__collection)
        return bf_id

    def __validate_data(self, data):
        for key in self.SCHEMA:
            if key not in data or not isinstance(data[key], self.SCHEMA[key]):
                return False
        return True

