from flask import Flask, jsonify, request

app = Flask(__name__)

@app.route("/")
def home():
    return jsonify({"message": "Hello from Flask on Vercel!"})

@app.route("/hello")
def hello():
    name = request.args.get("name", "world")
    return jsonify({"message": f"Hello, {name}!"})
