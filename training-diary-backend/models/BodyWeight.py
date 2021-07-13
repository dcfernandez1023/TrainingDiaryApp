from models import DataAccess
import uuid


class BodyWeight:

    SCHEMA = {
        "bw_id": str,
        "user_id": str,
        "type": str,
        "timestamp": int,
        "day": int,
        "month": int,
        "year": int,
        "weight": int,
        "units": str,
        "notes": str
    }

    def __init__(self):
        self.__protected_fields = [
            "_id",
            "bw_id",
            "user_id"
        ]
        self.__collection = "body_weight"
        self.__db = DataAccess.DataAccess()

    def get(self, user_id):
        return self.__db.get({"user_id": user_id}, self.__collection)

    def get_one(self, bw_id):
        res = self.__db.get({"_id": bw_id}, self.__collection)
        if len(res) > 1 or len(res) == 0:
            return None
        return res[0]

    def create(self, user_id, data):
        if self.__validate_data(data):
            bw_id = "body_weight" + str(uuid.uuid1())
            data.update({
                "_id": bw_id,
                "bw_id": bw_id,
                "user_id": user_id
            })
            self.__db.write_one(data, self.__collection)
            return data
        return None

    def update(self, data):
        if self.__validate_data(data):
            # Prevent protected fields from being updated
            current_data = self.__db.get({"_id": data["bw_id"]}, self.__collection)
            if len(current_data) == 0:
                return None
            current_bw = current_data[0]
            for field in self.__protected_fields:
                if current_bw.get(field) != data.get(field):
                    return None
            self.__db.update_one({"_id": data["bw_id"]}, data, self.__collection)
            return data
        return None

    def delete(self, user_id, bw_id):
        print(bw_id)
        self.__db.delete_one({"_id": bw_id, "user_id": user_id}, self.__collection)
        return bw_id

    def __validate_data(self, data):
        for key in self.SCHEMA:
            if key not in data or not isinstance(data[key], self.SCHEMA[key]):
                return False
        return True

