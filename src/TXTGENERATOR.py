import os
import urllib.request
from scipy import spatial
from sklearn.manifold import TSNE
import numpy as np
import enchant
d = enchant.Dict("en_US")
import re
import functools
import random
import unicodedata

#TODO WRAP IN FUNCTION, RUN MANY TIMES WITH MANY WORDS, SAVE IN TXT?

def find_similar_word(word, emmbedes, limit,emmbed_dict):
    try:
        nearest = sorted(emmbed_dict.keys(), key=lambda w: spatial.distance.euclidean(emmbed_dict[w], emmbedes))
        return nearest[:limit]
    except Exception as e:

        nearest = sorted(emmbed_dict.keys(), key=lambda w: spatial.distance.euclidean(emmbed_dict[w], emmbedes))
        return nearest[:limit]

print("hey2")

def has_numbers(inputString):
    inputString = unicodedata.normalize('NFKD', inputString).encode('ascii', 'ignore').decode('utf-8')
    return bool(re.search(r'\d', inputString))


def opendict():
    print("hey0")
    emmbed_dict = {}
    with open("glove.6B.300d.txt",'r', encoding="utf-8") as f:
        for line in f:
            values = line.strip().split() # split the line into a list of values

            try: 
                if len(values) != 301: # check if the list has the expected length
                    print(f"Ignoring line: {line}") # print warning message and ignore line if values list has a different length
                else:
                    word = values[0]
                    vector = np.asarray(values[1:], dtype='float32')
                    emmbed_dict[word] = vector
            except Exception as e:
                pass
        return emmbed_dict
    
superdict = opendict()


def findsimilarto(ThisWord,emmbed_dict):
    similarwords = find_similar_word(ThisWord, emmbed_dict[ThisWord], limit=9000000, emmbed_dict=emmbed_dict)
    filtered_words = [i for i in similarwords if d.check(i) == True and has_numbers(i) == False and len(i) < 12 and len(i) > 3]


    print(f"hey3 {ThisWord}")
    # print(filtered_words)
    print(len(filtered_words))  

    with open (f"savedwordsfor{ThisWord}","w") as f:
        for i in filtered_words:
            f.writelines(f"{i}\n")

findsimilarto("cow",superdict)
findsimilarto("apple",superdict )
findsimilarto("person",superdict )