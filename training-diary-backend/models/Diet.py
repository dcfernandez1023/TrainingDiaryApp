from models import DataAccess


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
            "diet_id",
            "user_id"
        ]
        self.__collection = "diet"
        self.__db = DataAccess.DataAccess()

    def get(self, user_id):
        return self.__db.get({"_id": user_id}, self.__collection)

    def create(self, user_id, data):
        return

    def __validate_data(self, data):
        for key in self.SCHEMA:
            if key not in data or not isinstance(data[key], self.SCHEMA[key]):
                return False
        return True