from models import Auth, User
from flask import make_response


def register(request_body):
    try:
        # Create user
        user_data = request_body.get("user_data")
        password = request_body.get("password")
        new_user = User.User().create(user_data)
        # If new user could not be created, the request data was bad
        if new_user is None:
            return make_response({"message": "Bad request"}, 400)
        # Register newly created user
        token = Auth.Auth().register(new_user["user_id"], password)
        return make_response({"token": token, "user_id": new_user["user_id"], "message": "Success"}, 200)
    except Exception as e:
        return make_response({"message": str(e)}, 500)


def login(request_body):
    try:
        email = request_body.get("email")
        password = request_body.get("password")
        data = Auth.Auth().login(email, password)
        if data is None:
            return make_response({"message": "No such user with email " + "'" + email + "'"}, 400)
        if not data:
            return make_response({"message": "Incorrect password"}, 401)
        return make_response({"data": data, "message": "Success"}, 200)
    except Exception as e:
        return make_response({"message": str(e)}, 500)


def refresh(request_body):
    try:
        token = request_body.get("token")
        user_id = request_body.get("user_id")
        data = Auth.Auth().refresh_api_token(token, user_id)
        if token is None:
            return make_response({"message": "Unauthorized"}, 401)
        return make_response({"token": data, "message": "Success"}, 200)
    except Exception as e:
        return make_response({"message": str(e)}, 500)
