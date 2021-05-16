import pymongo


class DataAccess:

    COLLECTIONS = [
        "users",
        "user_creds",
        "diet",
        "body_weight",
        "body_fat",
        "exercises",
        "exercise_entries"
        "custom",
        "custom_entries"
    ]

    # Constructor instantiates database client and database object. Initializes
    # database 'training-diary-db' if it does not exist, as well as the necessary
    # collections.
    def __init__(self):
        self.__client = pymongo.MongoClient("mongodb://localhost:27017/")
        self.__db = None
        self.__init_training_diary_db()

    # Closes connection
    def close_connection(self):
        self.__client.close()

    # Given a dictionary of filters, this will return a list of all objects/documents
    # matching the filters.
    def get(self, filters, collection_name):
        documents = []
        cursor = self.__db[collection_name].find(filters)
        for document in cursor:
            documents.append(document)
        return documents

    # Given a dictionary and collection_name, this will write the dictionary as a
    # document to the specified collection.
    def write_one(self, data, collection_name):
        self.__db[collection_name].insert_one(data)
        return data

    def write_many(self, data_list, collection_name):
        self.__db[collection_name].insert_many(data_list)
        return data_list

    def update_one(self, filters, data, collection_name):
        self.__db[collection_name].replace_one(filters, data)
        return data

    def delete_one(self, filters, collection_name):
        self.__db[collection_name].delete_one(filters)

    def delete_many(self, filters, collection_name):
        self.__db[collection_name].delete_many(filters)

    def __init_training_diary_db(self):
        # Ensure that training-diary-db exists
        self.__db = self.__client["training-diary-db"]
        collection_list = self.__db.list_collection_names()
        # Create collections that don't exist and initialize them
        for collection in self.COLLECTIONS:
            if collection not in collection_list:
                new_collection = self.__db[collection]
                new_collection.insert({"_id": "init"})

