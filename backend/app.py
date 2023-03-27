from backendwords import opendict
from backendwords import findsimilarto
from flask import Flask, jsonify, request
from flask_cors import CORS
import random   
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.sql.expression import func

app = Flask(__name__)
CORS(app, origins=['http://localhost:3000'])  # Allow requests from the React app running on port 3000

superdict = opendict()

#------------

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///words.db'  # Use SQLite database file named words.db
db = SQLAlchemy(app)

class Word(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    word = db.Column(db.String, unique=True, nullable=False)
    similar_words = db.relationship('SimilarWord', backref='word', lazy=True)

class SimilarWord(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    word_id = db.Column(db.Integer, db.ForeignKey('word.id'), nullable=False)
    similar_word = db.Column(db.String, nullable=False)

with app.app_context():
    db.create_all()

@app.route("/addword", methods=["POST"])
def add_word():
    data = request.get_json()
    word = data.get("word")
    print(f"received word {word}")
    print("finding similar words (this could take some time)")
    similar_words_list = findsimilarto(word,superdict)
    print(f"found similar words to {word}")

    if not word:
        return jsonify({"error": "Word missing"}), 400
    
    print(f"adding to database for word {word}")

    new_word = Word(word=word)
    db.session.add(new_word)
    db.session.commit()

    for similar_word in similar_words_list:
        new_similar_word = SimilarWord(word_id=new_word.id, similar_word=similar_word)
        db.session.add(new_similar_word)
    db.session.commit()

    return jsonify({"message": "Word and similar words added successfully"}), 201


@app.route("/getwordandlist")
def getwordandlist():
    # Get a random word from the database
    random_word = Word.query.order_by(func.random()).first()

    # Get the corresponding long list of similar words
    similar_words = SimilarWord.query.filter_by(word_id=random_word.id).all()

    # Extract the similar words into a list
    word_list = [similar_word.similar_word for similar_word in similar_words]

    print(random_word)

    return jsonify({"randomword": random_word.word, "wordlist": word_list}), 200

@app.route("/cleardb")
def cleardb():
    Word.query.delete()
    SimilarWord.query.delete()

    # Commit the changes to the database
    db.session.commit()

    return "database cleared"


#--------------

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


