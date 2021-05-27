from models import DataAccess
import uuid


class ExerciseEntry:

    SCHEMA = {
        "exercise_entry_id": str,
        "exercise_id": str,
        "user_id": str,
        "timestamp": int,
        "day": int,
        "month": int,
        "year": int,
        "notes": str,
    }

    def __init__(self):
        self.__protected_fields = [
            "_id",
            "exercise_entry_id",
            "exercise_id",
            "user_id"
        ]
        self.__collection = "exercise_entries"
        self.__db = DataAccess.DataAccess()

    def get(self, user_id):
        return self.__db.get({"user_id": user_id}, self.__collection)

    def get_one(self, exercise_entry_id):
        res = self.__db.get({"_id": exercise_entry_id}, self.__collection)
        if len(res) > 1 or len(res) == 0:
            return None
        return res[0]

    def create(self, user_id, exercise_id, data):
        if self.__validate_data(data) and self.__does_exercise_exist(exercise_id):
            exercise_entry_id = "exercise_entry" + str(uuid.uuid1())
            data.update({
                "_id": exercise_entry_id,
                "exercise_entry_id": exercise_entry_id,
                "exercise_id": exercise_id,
                "user_id": user_id
            })
            self.__db.write_one(data, self.__collection)
            return data
        return None

    def create_many(self, data):
        for entry in data:
            if self.__validate_data(entry) and self.__does_exercise_exist(data["exercise_id"]):
                exercise_entry_id = "exercise_entry" + str(uuid.uuid1())
                entry.update({
                    "_id": exercise_entry_id,
                    "exercise_entry_id": exercise_entry_id
                })
            else:
                return None
        return data

    def update(self, data):
        if self.__validate_data(data) and self.__does_exercise_exist(data["exercise_id"]):
            # Prevent protected fields from being updated
            current_data = self.__db.get({"_id": data["exercise_entry_id"]}, self.__collection)
            if len(current_data) == 0:
                return None
            current_entry = current_data[0]
            for field in self.__protected_fields:
                if current_entry.get(field) != data.get(field):
                    return None
            self.__db.update_one({"_id": data["exercise_entry_id"]}, data, self.__collection)
            return data
        return None

    def delete(self, user_id, exercise_entry_id):
        self.__db.delete_one({"_id": exercise_entry_id, "user_id": user_id}, self.__collection)
        return exercise_entry_id

    def __validate_data(self, data):
        for key in self.SCHEMA:
            if key not in data or not isinstance(data[key], self.SCHEMA[key]):
                return False
        return True

    def __does_exercise_exist(self, exercise_id):
        res = self.__db.get({"_id": exercise_id}, "exercises")
        if len(res) != 1:
            return False
        return True

