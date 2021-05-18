from models import DataAccess
import uuid


class Diet:

    SCHEMA = {
        "diet_id": str,
        "user_id": str,
        "timestamp": int,
        "day": int,
        "month": int,
        "year": int,
        "calories": int,
        "protein": int,
        "carbs": int,
        "fat": int,
        "notes": str
    }

    def __init__(self):
        self.__protected_fields = [
            "_id",
            "diet_id",
            "user_id"
        ]
        self.__collection = "diet"
        self.__db = DataAccess.DataAccess()

    def get(self, user_id):
        return self.__db.get({"_id": user_id}, self.__collection)

    def get_one(self, diet_id):
        res = self.__db.get({"_id": diet_id}, self.__collection)
        if len(res) > 1 or len(res) == 0:
            return None
        return res[0]

    def create(self, user_id, data):
        if self.__validate_data(data):
            entry_today = self.__db.get({
                "user_id": user_id,
                "day": data["day"],
                "month": data["month"],
                "year": data["year"]
            }, self.__collection)
            # If there has already been a diet entry entered on a given date, then update it instead of creating
            # a new one
            if len(entry_today) == 1:
                self.__db.update_one({"diet_id": entry_today["diet_id"]}, data, self.__collection)
                return data
            # Otherwise, create a new entry
            elif len(entry_today) > 1:
                raise Exception("Duplicate Diet Entries")
            else:
                diet_id = "diet" + str(uuid.uuid1())
                data.update({
                    "_id": diet_id,
                    "user_id": user_id,
                    "diet_id": diet_id
                })
                self.__db.write_one(data, self.__collection)
                return data
        return None

    def update(self, data):
        if self.__validate_data(data):
            # Prevent protected fields from being updated
            current_data = self.__db.get({"_id": data["diet_id"]}, self.__collection)
            if len(current_data) == 0:
                return None
            current_diet = current_data[0]
            for field in self.__protected_fields:
                if current_diet.get(field) != data.get(field):
                    return None
            self.__db.update_one({"_id": data["diet_id"]}, data, self.__collection)
            return data
        return None

    def delete(self, user_id, diet_id):
        self.__db.delete_one({"_id": diet_id, "user_id": user_id}, self.__collection)
        return diet_id

    def __validate_data(self, data):
        for key in self.SCHEMA:
            if key not in data or not isinstance(data[key], self.SCHEMA[key]):
                return False
        return True
