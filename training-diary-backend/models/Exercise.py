from models import DataAccess
import uuid 


class Exercise:
    
    SCHEMA = {
        "exercise_id": str, 
        "user_id": str, 
        "name": str, 
        "category": str, 
        "sets": int, 
        "reps": int, 
        "amount": int, 
        "units": str, 
        "description": str
    }

    def __init__(self):
        self.__protected_fields = [
            "_id",
            "exercise_id",
            "user_id"
        ]
        self.__collection = "exercises"
        self.__db = DataAccess.DataAccess()

    def get(self, user_id):
        return self.__db.get({"user_id": user_id}, self.__collection)

    def get_one(self, exercise_id):
        res = self.__db.get({"_id": exercise_id}, self.__collection)
        if len(res) > 1 or len(res) == 0:
            return None
        return res[0]

    def create(self, user_id, data):
        if self.__validate_data(data):
            exercise_id = "exercise" + str(uuid.uuid1())
            data.update({
                "_id": exercise_id,
                "exercise_id": exercise_id,
                "user_id": user_id
            })
            self.__db.write_one(data, self.__collection)
            return data
        return None

    def update(self, data):
        if self.__validate_data(data):
            # Prevent protected fields from being updated
            current_data = self.__db.get({"_id": data["exercise_id"]}, self.__collection)
            if len(current_data) == 0:
                return None
            current_exercise = current_data[0]
            for field in self.__protected_fields:
                if current_exercise.get(field) != data.get(field):
                    return None
            self.__db.update_one({"_id": data["exercise_id"]}, data, self.__collection)
            return data
        return None

    def delete(self, user_id, exercise_id):
        self.__db.delete_one({"_id": exercise_id, "user_id": user_id}, self.__collection)
        self.__db.delete_many({"_id": user_id, "exercise_id": exercise_id}, "exercise_entries")
        return exercise_id

    def __validate_data(self, data):
        for key in self.SCHEMA:
            if key not in data or not isinstance(data[key], self.SCHEMA[key]):
                return False
        return True
