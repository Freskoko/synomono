from backendwords import opendict
from backendwords import findsimilarto
from flask import Flask, jsonify
from flask_cors import CORS
import random

app = Flask(__name__)
CORS(app, origins=['http://localhost:3000'])  # Allow requests from the React app running on port 3000

superdict = opendict()

differentguesses = ["cow"]

@app.route("/longlist")
def longlist():
    global superdict
    print("received request")
    randomguess = random.choice(differentguesses)
    print("guess:",randomguess)
    outdict = {"listofwords" : findsimilarto(randomguess,superdict)}
    print(outdict["listofwords"][0:20])
    return jsonify(outdict)

if __name__ == '__main__':
    app.run(debug=True, port=5000)  # Run the Flask app on port 5000


