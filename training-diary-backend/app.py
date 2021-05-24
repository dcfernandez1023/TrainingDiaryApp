from flask import Flask
from routes import auth_routes, user_routes


app = Flask(__name__)


@app.route('/')
def index():
    return "<h1> 404 Not Found </h1>"


if __name__ == "__main__":
    app.register_blueprint(auth_routes.AUTH_BLUEPRINT)
    app.register_blueprint(user_routes.USER_BLUEPRINT)
    app.run(debug=True, host='0.0.0.0', port=5000)
