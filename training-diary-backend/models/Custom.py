from models import DataAccess
import uuid


class Custom:

    SCHEMA = {
        "custom_id": str,
        "user_id": str,
        "custom_schema": dict,
    }

    def __init__(self):
        self.__protected_fields = [
            "custom_id",
            "user_id"
        ]
        self.__collection = "custom"
        self.__db = DataAccess.DataAccess()
        self.__custom_schema_default = {
            "name": str,
            "description": str
        }
        self.__data_types = [
            "text",
            "number"
        ]

    def get(self, user_id):
        return self.__db.get({"_id": user_id}, self.__collection)

    def get_one(self, custom_id):
        res = self.__db.get({"_id": custom_id}, self.__collection)
        if len(res) > 1 or len(res) == 0:
            return None
        return res[0]

    def create(self, user_id, data):
        if self.__validate_data(data) and self.__contains_default_schema(data["custom_schema"]) and self.__is_valid_data_type(data["custom_schema"]):
            custom_id = "custom" + str(uuid.uuid1())
            data.update({
                "_id": custom_id,
                "custom_id": custom_id,
                "user_id": user_id
            })
            self.__db.write_one(data, self.__collection)
            return data
        return None

    def update(self, data):
        if self.__validate_data(data) and self.__contains_default_schema(data["custom_schema"]) and self.__is_valid_data_type(data["custom_schema"]):
            # Prevent protected fields from being updated
            current_data = self.__db.get({"_id": data["custom_id"]}, self.__collection)
            if len(current_data) == 0:
                return None
            current_custom = current_data[0]
            for field in self.__protected_fields:
                if current_custom.get(field) != data.get(field):
                    return None
            self.__db.update_one({"_id": data["custom_id"]}, data, self.__collection)
            return data
        return None

    def delete(self, user_id, custom_id):
        self.__db.delete_one({"_id": custom_id, "user_id": user_id}, self.__collection)
        self.__db.delete_many({"_id": user_id, "custom_id": custom_id}, "custom_entries")
        return custom_id

    def __validate_data(self, data):
        for key in self.SCHEMA:
            if key not in data or not isinstance(data[key], self.SCHEMA[key]):
                return False
        return True

    def __contains_default_schema(self, data):
        print(data)
        for key in self.__custom_schema_default:
            if key not in data:
                return False
        return True

    # Helper function to ensure that the data types entered are supported and can be
    # identified by this application.  The data types a user can define for their
    # custom data are either 'text' or 'number', which resolves to str and int in python
    # and string and number in JavaScript (front-end)
    def __is_valid_data_type(self, custom_schema):
        for key in custom_schema:
            if custom_schema[key] not in self.__data_types:
                return False
        return True
