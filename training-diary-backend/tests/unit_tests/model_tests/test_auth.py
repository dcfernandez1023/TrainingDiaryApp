from models import Auth, User
import pytest


# Unit tests for Auth model object

TEST_USER_DATA = {
    "user_id": "",
    "email": "user1@gmail.com",
    "first_name": "Bob",
    "last_name": "Smith",
    "birthday": 972284400000
}


def test_instantiation():
    auth = Auth.Auth()


def test_register():
    user = User.User()
    res = user.create(TEST_USER_DATA)
    auth = Auth.Auth()
    password = "password"
    api_token = auth.register(res["user_id"], password)
    TEST_USER_DATA.update({"user_id": res["user_id"]})
    assert api_token is not None


def test_login():
    auth = Auth.Auth()
    api_token = auth.login(TEST_USER_DATA["email"], "password")
    assert api_token is not None


def test_login_with_incorrect_password():
    auth = Auth.Auth()
    assert auth.login(TEST_USER_DATA["email"], "incorrect password") == False


def test_login_with_incorrect_email():
    auth = Auth.Auth()
    assert auth.login("incorrect_email@gmail.com", "password") is None


def test_refresh_api_token():
    auth = Auth.Auth()
    api_token = auth.login(TEST_USER_DATA["email"], "password")["token"]
    new_token = auth.refresh_api_token(api_token, TEST_USER_DATA["user_id"])
    assert new_token is not None


def test_register_user_already_exists():
    auth = Auth.Auth()
    password = "password"
    with pytest.raises(Exception):
        auth.register(TEST_USER_DATA["user_id"], password)
    User.User().delete(TEST_USER_DATA["user_id"])


def test_registration_with_invalid_data():
    auth = Auth.Auth()
    data_copy = dict(TEST_USER_DATA)
    data_copy.update({"email": 123})
    password = 123
    with pytest.raises(Exception):
        auth.register(data_copy, password)
