from models import Auth, User
from flask import make_response, request, Blueprint


AUTH_BLUEPRINT = Blueprint("auth_blueprint", __name__)


@AUTH_BLUEPRINT.route("/api/auth/register")
def register():
    try:
        # Create user
        request_body = request.get_json()
        user_data = request_body.get("user_data")
        password = request_body.get("password")
        new_user = User.User().create(user_data)
        # If new user could not be created, the request data was bad
        if new_user is None:
            return make_response({"message": "Bad request"}, 400)
        # Register newly created user
        token = Auth.Auth().register(new_user["user_id"], password)
        return make_response({"token": token, "message": "Success"}, 200)
    except Exception as e:
        return make_response({"message": str(e)}, 500)

