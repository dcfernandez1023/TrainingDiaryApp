# Unit tests for Exercise Entry model object

from models import CustomEntry


import time
import datetime

TEST_ENTRY_DATA = {
    "custom_entry_id": "",
    "custom_id": "custom001",
    "user_id": "test_user001",
    "timestamp": int(time.time()),
    "day": datetime.datetime.today().day,
    "month": datetime.datetime.today().month,
    "year": datetime.datetime.today().year,
    "custom_entry": {
        "name": "test",
        "description": "testtttt"
    },
    "notes": "notes"
}


def test_instantiation():
    entry = CustomEntry.CustomEntry()
    assert entry is not None


def test_create():
    entry = CustomEntry.CustomEntry()
    custom_entry_id = entry.create(TEST_ENTRY_DATA["user_id"], TEST_ENTRY_DATA)["custom_entry_id"]
    TEST_ENTRY_DATA["custom_entry_id"] = custom_entry_id
    TEST_ENTRY_DATA["custom_entry_id"] = custom_entry_id
    res = entry.create(TEST_ENTRY_DATA["user_id"], TEST_ENTRY_DATA)
    TEST_ENTRY_DATA.update({"custom_entry_id": res["custom_entry_id"]})
    assert res is not None


def test_get_one():
    entry = CustomEntry.CustomEntry()
    res = entry.get_one(TEST_ENTRY_DATA["custom_entry_id"])
    assert res is not None and res == TEST_ENTRY_DATA


def test_get_many():
    entry = CustomEntry.CustomEntry()
    res = entry.get(TEST_ENTRY_DATA["user_id"])
    assert res is not None and isinstance(res, list)


def test_update():
    entry = ExerciseEntry.ExerciseEntry()
    copy = dict(TEST_ENTRY_DATA)
    copy.update({
        "timestamp": int(time.time()),
        "day": datetime.datetime.today().day,
        "month": datetime.datetime.today().month,
        "year": datetime.datetime.today().year,
        "notes": "Update"
    })
    res = entry.update(copy)
    assert res is not None


def test_update_protected_fields():
    entry = CustomEntry.CustomEntry()
    copy = dict(TEST_ENTRY_DATA)
    copy.update({
        "user_id": "test",
        "custom_entry_id": "test",
        "custom_entry_id": "test"
    })
    res = entry.update(copy)
    assert res is None


def test_update_invalid_data_types():
    entry = CustomEntry.CustomEntry()
    copy = dict(TEST_ENTRY_DATA)
    copy.update({
        "timestamp": "test",
        "day": "test",
        "month": "test",
        "year": "test",
        "notes": 123
    })
    print(copy)
    res = entry.update(copy)
    assert res is None


def test_delete():
    entry = CustomEntry.CustomEntry()
    entry.delete(TEST_ENTRY_DATA["user_id"], TEST_ENTRY_DATA["custom_entry_id"])
    assert entry.get_one(TEST_ENTRY_DATA["custom_entry_id"]) is None

