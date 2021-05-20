# Unit tests for Exercise model object

from models import Custom

TEST_CUSTOM_DATA = {
    "custom_id": "",
    "user_id": "test_user001",
    "custom_schema": {
        "name": "text",
        "description": "number"
    },
}


def test_instantiation():
    custom = Custom.Custom()
    assert custom is not None


def test_create():
    custom = Custom.Custom()
    res = custom.create(TEST_CUSTOM_DATA["user_id"], TEST_CUSTOM_DATA)
    TEST_CUSTOM_DATA.update({"custom_id": res["custom_id"]})
    assert res is not None


def test_get_one():
    custom = Custom.Custom()
    res = custom.get_one(TEST_CUSTOM_DATA["custom_id"])
    assert res is not None and res == TEST_CUSTOM_DATA


def test_get_many():
    custom = Custom.Custom()
    res = custom.get(TEST_CUSTOM_DATA["user_id"])
    assert res is not None and isinstance(res, list)


def test_update():
    custom = Custom.Custom()
    copy = dict(TEST_CUSTOM_DATA)
    copy.update({
        "custom_schema": {
            "name": "text",
            "description": "number",
            "test_field": "text"
        }
    })
    res = custom.update(copy)
    assert res is not None


def test_update_protected_fields():
    custom = Custom.Custom()
    copy = dict(TEST_CUSTOM_DATA)
    copy.update({
        "user_id": "test",
        "custom_id": "test"
    })
    res = custom.update(copy)
    assert res is None


def test_update_without_default_schema():
    custom = Custom.Custom()
    copy = dict(TEST_CUSTOM_DATA)
    copy.update({
        "custom_schema": {
            "test_field": "this is not a supported data type"
        }
    })
    res = custom.update(copy)
    assert res is None


def test_update_invalid_data_types():
    custom = Custom.Custom()
    copy = dict(TEST_CUSTOM_DATA)
    copy.update({
        "custom_schema": {
            "name": "text",
            "description": "number",
            "test_field": "this is not a supported data type"
        }
    })
    res = custom.update(copy)
    assert res is None


def test_delete():
    custom = Custom.Custom()
    custom.delete(TEST_CUSTOM_DATA["user_id"], TEST_CUSTOM_DATA["custom_id"])
    assert custom.get_one(TEST_CUSTOM_DATA["custom_id"]) is None

