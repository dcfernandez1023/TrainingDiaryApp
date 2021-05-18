import time
import datetime

from models import Diet, User


# Unit tests for Diet model object


TEST_DIET_DATA = {
    "diet_id": "",
    "user_id": "",
    "timestamp": int(time.time()),
    "day": datetime.datetime.today().day,
    "month": datetime.datetime.today().month,
    "year": datetime.datetime.today().year,
    "calories": 2500,
    "protein": 175,
    "carbs": 225,
    "fat": 75,
    "notes": "Test notes section"
}

TEST_USER_DATA = {
    "user_id": "",
    "email": "user@gmail.com",
    "first_name": "Bob",
    "last_name": "Smith",
    "birthday": 972284400000
}

user = User.User()
user_data = user.create(TEST_USER_DATA)
TEST_USER_DATA = dict(user_data)
TEST_DIET_DATA.update({"user_id": TEST_USER_DATA["user_id"]})
print(TEST_DIET_DATA)


def test_instantiation():
    diet = Diet.Diet()
    assert diet is not None


def test_create_diet():
    diet = Diet.Diet()
    res = diet.create(TEST_USER_DATA["user_id"], TEST_DIET_DATA)
    print(res)
    TEST_DIET_DATA.update({"diet_id": res["diet_id"]})
    assert res is not None


def test_get_one():
    diet = Diet.Diet()
    res = diet.get_one(TEST_DIET_DATA["diet_id"])
    assert res is not None


def test_get_many():
    diet = Diet.Diet()
    res = diet.get(TEST_USER_DATA["user_id"])
    assert res is not None and isinstance(res, list)


def test_update_diet():
    diet = Diet.Diet()
    copy = dict(TEST_DIET_DATA)
    copy.update({
        "calories": 3000,
        "notes": "Updated notes section",
        "year": datetime.datetime.today().year - 1
    })
    res = diet.update(copy)
    assert res is not None and res == copy


def test_update_protected_fields():
    diet = Diet.Diet()
    copy = dict(TEST_DIET_DATA)
    copy.update({
        "user_id": "new user id",
        "diet_id": "new diet_id",
        "year": datetime.datetime.today().year - 1
    })
    res = diet.update(copy)
    assert res is None


def test_update_with_invalid_data_types():
    diet = Diet.Diet()
    copy = dict(TEST_DIET_DATA)
    copy.update({
        "calories": "this is a string",
        "notes": 100,
        "year": "this should be an int"
    })
    res = diet.update(copy)
    assert res is None


def test_delete():
    diet = Diet.Diet()
    res = diet.delete(TEST_USER_DATA["user_id"], TEST_DIET_DATA["diet_id"])
    actual = diet.get_one(TEST_DIET_DATA["diet_id"])
    user.delete(TEST_USER_DATA["user_id"])
    assert res == TEST_DIET_DATA["diet_id"] and actual is None

