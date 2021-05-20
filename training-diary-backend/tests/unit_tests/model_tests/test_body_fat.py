# Unit tests for Body Fat model object

import time
import datetime

from models import BodyFat

TEST_BF_DATA = {
    "bf_id": "",
    "user_id": "test_user001",
    "timestamp": int(time.time()),
    "day": datetime.datetime.today().day,
    "month": datetime.datetime.today().month,
    "year": datetime.datetime.today().year,
    "percentage": 15,
    "notes": "Testing"
}


def test_instantiation():
    bf = BodyFat.BodyFat()
    assert bf is not None


def test_create():
    bf = BodyFat.BodyFat()
    res = bf.create(TEST_BF_DATA["user_id"], TEST_BF_DATA)
    TEST_BF_DATA.update({"bf_id": res["bf_id"]})
    assert res is not None


def test_get_one():
    bf = BodyFat.BodyFat()
    res = bf.get_one(TEST_BF_DATA["bf_id"])
    assert res is not None and res == TEST_BF_DATA


def test_get_many():
    bf = BodyFat.BodyFat()
    res = bf.get(TEST_BF_DATA["user_id"])
    assert res is not None and isinstance(res, list)


def test_update():
    bf = BodyFat.BodyFat()
    copy = dict(TEST_BF_DATA)
    copy.update({
        "weight": 170,
        "notes": "Updated weight"
    })
    res = bf.update(copy)
    assert res is not None


def test_update_protected_fields():
    bf = BodyFat.BodyFat()
    copy = dict(TEST_BF_DATA)
    copy.update({
        "user_id": "test",
        "notes": "Test",
        "bf_id": "test"
    })
    res = bf.update(copy)
    assert res is None


def test_update_invalid_data_types():
    bf = BodyFat.BodyFat()
    copy = dict(TEST_BF_DATA)
    copy.update({
        "weight": "this is not an int",
        "notes": 123,
    })
    res = bf.update(copy)
    assert res is None


def test_delete():
    bf = BodyFat.BodyFat()
    bf.delete(TEST_BF_DATA["user_id"], TEST_BF_DATA["bf_id"])
    assert bf.get_one(TEST_BF_DATA["bf_id"]) is None

