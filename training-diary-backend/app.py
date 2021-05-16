from flask import Flask
from models import DataAccess


app = Flask(__name__)


@app.route('/')
def hello():
    return "Hello"


if __name__ == "__main__":
    app.run(debug=True, host='0.0.0.0')
