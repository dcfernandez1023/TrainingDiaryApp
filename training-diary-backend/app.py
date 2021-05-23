from flask import Flask
from models import DataAccess
from controllers import auth_controller


app = Flask(__name__)


@app.route('/')
def index():
    return "404 Not Found"


if __name__ == "__main__":
    app.register_blueprint(auth_controller.AUTH_BLUEPRINT)
    app.run(debug=True, host='0.0.0.0', port=5000)
