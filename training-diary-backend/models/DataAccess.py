import pymongo


class DataAccess:
    def __init__(self):
        self.__collections = ["users", "diet", "body_weight", ]
        self.__client = pymongo.MongoClient("mongodb://localhost:27017/")

    def close_connection(self):
        self.__client.close()

    def get(self, id, collection):
        return

    def __init_training_diary_db(self):
        # Check if database exists
        if "training-diary-db" in self.__client.list_database_names():
            # Check if collection exists
            return