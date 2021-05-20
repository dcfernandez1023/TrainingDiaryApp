# Unit tests for BodyWeight model object

import time
import datetime

from models import Exercise

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
    exercise = Exercise.Exercise()
    assert exercise is not None


def test_create():
    exercise = Exercise.Exercise()
    res = exercise.create(TEST_EXERCISE_DATA["user_id"], TEST_EXERCISE_DATA)
    TEST_EXERCISE_DATA.update({"exercise_id": res["exercise_id"]})
    assert res is not None


def test_get_one():
    exercise = Exercise.Exercise()
    res = exercise.get_one(TEST_EXERCISE_DATA["exercise_id"])
    assert res is not None and res == TEST_EXERCISE_DATA


def test_get_many():
    exercise = Exercise.Exercise()
    res = exercise.get(TEST_EXERCISE_DATA["user_id"])
    assert res is not None and isinstance(res, list)


def test_update():
    exercise = Exercise.Exercise()
    copy = dict(TEST_EXERCISE_DATA)
    copy.update({
        "amount": 255,
        "sets": 5,
        "reps": 5,
        "units": "lbs",
        "description": "Update"
    })
    res = exercise.update(copy)
    assert res is not None


def test_update_protected_fields():
    exercise = Exercise.Exercise()
    copy = dict(TEST_EXERCISE_DATA)
    copy.update({
        "user_id": "test",
        "notes": "Test",
        "exercise_id": "test"
    })
    res = exercise.update(copy)
    assert res is None


def test_update_invalid_data_types():
    exercise = Exercise.Exercise()
    copy = dict(TEST_EXERCISE_DATA)
    copy.update({
        "amount": "this is not an int",
        "description": 123,
    })
    res = exercise.update(copy)
    assert res is None


def test_delete():
    exercise = Exercise.Exercise()
    exercise.delete(TEST_EXERCISE_DATA["user_id"], TEST_EXERCISE_DATA["exercise_id"])
    assert exercise.get_one(TEST_EXERCISE_DATA["exercise_id"]) is None

