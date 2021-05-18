# Unit tests for BodyWeight model object

import time
import datetime

from models import BodyWeight

TEST_BW_DATA = {
    "bw_id": "",
    "user_id": "test_user001",
    "timestamp": int(time.time()),
    "day": datetime.datetime.today().day,
    "month": datetime.datetime.today().month,
    "year": datetime.datetime.today().year,
    "weight": 174,
    "units": "lbs",
    "notes": "Testing"
}


def test_instantiation():
    bw = BodyWeight.BodyWeight()
    assert bw is not None


def test_create():
    bw = BodyWeight.BodyWeight()
    res = bw.create(TEST_BW_DATA["user_id"], TEST_BW_DATA)
    TEST_BW_DATA.update({"bw_id": res["bw_id"]})
    assert res is not None


def test_get_one():
    bw = BodyWeight.BodyWeight()
    res = bw.get_one(TEST_BW_DATA["user_id"], TEST_BW_DATA["bw_id"])
    assert res is not None and res == TEST_BW_DATA


def test_get_many():
    bw = BodyWeight.BodyWeight()
    res = bw.get(TEST_BW_DATA["user_id"])
    assert res is not None and isinstance(res, list)



