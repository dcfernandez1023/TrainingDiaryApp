from flask import make_response, request, Blueprint
from models import Auth


class AppController:
    def __init__(self):
        self.__auth = Auth.Auth()

    # Executes a model object's function
    # @param token must be valid in order to execute the function
    # @param params is a dictionary of parameters to pass to the model's function
    def execute_model_logic(self, token, user_id, model, function_name, params):
        try:
            # Check if token is valid
            new_token = self.__auth.refresh_api_token(token, user_id)
            if new_token is None:
                return make_response({"message": "Unauthorized"}, 401)
            # Dynamically execute model object function
            function_to_execute = getattr(model, function_name)
            res = function_to_execute(**params)
            # If res is None, the data that came through was a bad request
            if res is None:
                return make_response({"message": "Bad Request"}, 400)
            return make_response({"message": "Success", "data": res}, 200)
        except Exception as e:
            return make_response({"message": "Internal Error: " + str(e)}, 500)

    # Deconstructs dictionary into parameters to be passed to execute_model_logic
    def deconstruct_request_body(self, request_body):
        token = request_body.get("token")
        user_id = request_body.get("user_id")
        params = request_body.get("data")
        return dict(token=token, user_id=user_id, params=params)
