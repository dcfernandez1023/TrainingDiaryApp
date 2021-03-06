import inspect

from flask import make_response
from models import Auth


class AppController:
    def __init__(self):
        self.__auth = Auth.Auth()

    # Dynamically executes a model object's function
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
            # get and delete model object methods take in a single parameter
            res = function_to_execute(**params)
            # If res is None, the data that came through was a bad request
            if res is None:
                return make_response({"message": "Bad Request"}, 400)
            return make_response({"message": "Success", "data": res}, 200)
        except Exception as e:
            return make_response({"message": "Internal Error: " + str(e)}, 500)

    # Deconstructs dictionary into parameters to be passed to execute_model_logic
    def deconstruct_request_body(self, request_body, model, func_name):
        params = {}
        # get list of model object function's parameters
        model_func_param_list = list(inspect.signature(getattr(model, func_name)).parameters)
        for param_name in model_func_param_list:
            params.update({param_name: request_body.get(param_name)})
        # all request bodies come with a token and a user_id (except GET requests b/c they have no body)
        token = request_body.get("token")
        user_id = request_body.get("user_id")
        return dict(token=token, user_id=user_id, params=params)
