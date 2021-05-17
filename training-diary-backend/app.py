from flask import Flask


from models import DataAccess


app = Flask(__name__)


@app.route('/')
def test_db_connect():
    try:
        db = DataAccess.DataAccess()
        db.get({"_id": "init"}, "users")
        return "Successfully connected to database"
    except Exception:
        return "Failed to connect to database"


if __name__ == "__main__":
    app.run(debug=True, host='0.0.0.0', port=5000)
