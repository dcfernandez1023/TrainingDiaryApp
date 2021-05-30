# Unit tests for Exercise Entry model object

from models import ExerciseEntry, Exercise


import time
import datetime

TEST_ENTRY_DATA = {
    "exercise_entry_id": "",
    "exercise_id": "",
    "user_id": "test_user001",
    "timestamp": int(time.time()),
    "day": datetime.datetime.today().day,
    "month": datetime.datetime.today().month,
    "year": datetime.datetime.today().year,
    "notes": "Test"
}

TEST_EXERCISE_DATA = {
    "exercise_id": "",
    "user_id": "test_user001",
    "name": "Bench-press",
    "category": "weight-lifting",
    "sets": 4,
    "reps": 8,
    "amount": 235,
    "units": "lbs",
    "description": "Testing"
}


def test_instantiation():
    entry = ExerciseEntry.ExerciseEntry()
    assert entry is not None


def test_create():
    entry = ExerciseEntry.ExerciseEntry()
    exercise = Exercise.Exercise()
    exercise_id = exercise.create(TEST_EXERCISE_DATA["user_id"], TEST_EXERCISE_DATA)["exercise_id"]
    TEST_ENTRY_DATA["exercise_id"] = exercise_id
    TEST_EXERCISE_DATA["exercise_id"] = exercise_id
    res = entry.create(TEST_ENTRY_DATA["user_id"], TEST_ENTRY_DATA["exercise_id"], TEST_ENTRY_DATA)
    TEST_ENTRY_DATA.update({"exercise_entry_id": res["exercise_entry_id"]})
    assert res is not None


def test_get_one():
    entry = ExerciseEntry.ExerciseEntry()
    res = entry.get_one(TEST_ENTRY_DATA["exercise_entry_id"])
    assert res is not None and res == TEST_ENTRY_DATA


def test_get_many():
    entry = ExerciseEntry.ExerciseEntry()
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
    entry = ExerciseEntry.ExerciseEntry()
    copy = dict(TEST_ENTRY_DATA)
    copy.update({
        "user_id": "test",
        "exercise_entry_id": "test",
        "exercise_id": "test"
    })
    res = entry.update(copy)
    assert res is None


def test_update_invalid_data_types():
    entry = ExerciseEntry.ExerciseEntry()
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
    entry = ExerciseEntry.ExerciseEntry()
    entry.delete(TEST_ENTRY_DATA["user_id"], TEST_ENTRY_DATA["exercise_entry_id"])
    exercise = Exercise.Exercise()
    exercise.delete(TEST_EXERCISE_DATA["user_id"], TEST_EXERCISE_DATA["exercise_id"])
    assert entry.get_one(TEST_ENTRY_DATA["exercise_entry_id"]) is None

