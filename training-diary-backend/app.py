from flask import Flask
from routes import auth_routes, user_routes, exercise_routes, exercise_entry_routes, diet_routes, body_fat_routes, body_weight_routes
from flask_cors import CORS


app = Flask(__name__)


@app.route('/')
def index():
    return "<h1> 404 Not Found </h1>"


if __name__ == "__main__":
    CORS(app, expose_headers=["token"])
    app.register_blueprint(auth_routes.AUTH_BLUEPRINT)
    app.register_blueprint(user_routes.USER_BLUEPRINT)
    app.register_blueprint(exercise_routes.EXERCISE_BLUEPRINT)
    app.register_blueprint(exercise_entry_routes.EXERCISE_ENTRY_BLUEPRINT)
    app.register_blueprint(diet_routes.DIET_BLUEPRINT)
    app.register_blueprint(body_fat_routes.BODY_FAT_BLUEPRINT)
    app.register_blueprint(body_weight_routes.BODY_WEIGHT_BLUEPRINT)
    app.run(debug=True, host='0.0.0.0', port=5000)
