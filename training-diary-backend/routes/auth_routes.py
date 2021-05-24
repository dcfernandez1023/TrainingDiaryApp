from flask import request, Blueprint
from controllers import auth_controller as controller


AUTH_BLUEPRINT = Blueprint("AUTH_BLUEPRINT", __name__)


@AUTH_BLUEPRINT.route("/api/auth/register", methods=["POST"])
def register():
    request_body = request.get_json()
    return controller.register(request_body)


@AUTH_BLUEPRINT.route("/api/auth/login", methods=["POST"])
def login():
    request_body = request.get_json()
    return controller.login(request_body)


@AUTH_BLUEPRINT.route("/api/auth/refresh", methods=["POST"])
def refresh():
    request_body = request.get_json()
    return controller.refresh(request_body)
