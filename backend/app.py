from backendwords import opendict
from backendwords import findsimilarto
from flask import Flask, jsonify
from flask_cors import CORS
import random

app = Flask(__name__)
CORS(app, origins=['http://localhost:3000'])  # Allow requests from the React app running on port 3000

superdict = opendict()

#------------

# app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///similars.db'
# db = SQLAlchemy(app)

# class SimilarWord(db.Model):
#     id = db.Column(db.Integer, primary_key=True)
#     word = db.Column(db.String, nullable=False)
#     similar_to = db.Column(db.String, nullable=False)
# db.create_all()

# @app.route('/add_similar_words', methods=['POST'])
# def add_similar_words():
#     word = request.form['word']
#     similar_words = findsimilarto(word, _dict)

#     for similar_word in similar_words:
#         new_entry = SimilarWord(word=similar_word, similar_to=word)
#         db.session.add(new_entry)

#     db.session.commit()
#     return jsonify({"message": "Successfully added similar words to the database."})

# @app.route('/get_similar_words', methods=['GET'])
# def get_similar_words():
#     word = request.args.get('word')
#     similar_words = SimilarWord.query.filter_by(similar_to=word).all()
#     result = [similar_word.word for similar_word in similar_words]
#     return jsonify(result)

#------------



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


