from models import User


# Unit tests for User model object

TEST_USER_DATA = {
    "user_id": "",
    "email": "user@gmail.com",
    "first_name": "Bob",
    "last_name": "Smith",
    "birthday": 972284400000
}


def test_instantiation():
    user = User.User()
    assert user is not None


def test_create_user():
    user = User.User()
    actual = user.create(TEST_USER_DATA)
    TEST_USER_DATA.update({"user_id": actual.get("user_id")})
    assert actual == TEST_USER_DATA


def test_get_user():
    user = User.User()
    actual = user.get(TEST_USER_DATA.get("user_id"))
    assert actual[0] == TEST_USER_DATA


def test_update_user():
    user = User.User()
    TEST_USER_DATA.update({
        "first_name": "Dom",
        "last_name": "Fernandez"
    })
    user.update(TEST_USER_DATA)
    actual = user.get(TEST_USER_DATA.get("user_id"))
    assert actual[0] == TEST_USER_DATA


def test_update_user_protected_fields():
    user = User.User()
    curr_id = TEST_USER_DATA.get("user_id")
    curr_email = TEST_USER_DATA.get("email")
    # Try to update user_id and email
    TEST_USER_DATA.update({
        "user_id": "user01",
        "email": "new@gmail.com"
    })
    res = user.update(TEST_USER_DATA)
    TEST_USER_DATA.update({
        "user_id": curr_id,
        "email": curr_email
    })
    # Expecting it to return none when protected fields are attempted to be updated
    assert res is None


def test_delete_user():
    user = User.User()
    res = user.delete(TEST_USER_DATA.get("user_id"))
    actual = user.get(TEST_USER_DATA.get("user_id"))
    assert res == TEST_USER_DATA.get("user_id")
    assert len(actual) == 0
