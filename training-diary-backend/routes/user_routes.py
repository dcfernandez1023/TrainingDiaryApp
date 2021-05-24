from flask import request, make_response, Blueprint
from controllers import AppController
from models import User


USER_BLUEPRINT = Blueprint("USER_BLUEPRINT", __name__)
CONTROLLER = AppController.AppController()
ENDPOINTS = [
    "get",
    "create",
    "update",
    "delete"
]


@USER_BLUEPRINT.route("/api/user/<func_name>", methods=["GET", "POST", "PUT", "DELETE"])
def call_api(func_name):
    try:
        if func_name not in ENDPOINTS:
            message = "No such endpoint " + "'" + func_name + "'"
            return make_response({"message": message}, 404)
        request_body = request.get_json()
        model = User.User()
        params = CONTROLLER.deconstruct_request_body(request_body)
        params.update({"model": model, "function_name": func_name})
        return CONTROLLER.execute_model_logic(**params)
    except Exception as e:
        return make_response({"message": "Internal Error: " + str(e)}, 500)
