
# opening the file in read mode
with open(r"C:\Users\henri\OneDrive\Documents\Programming\Hobby\js\learnreact\synomono\src\savedwordsforSong.txt", "r") as my_file:
  
    # reading the file
    data = my_file.read()
    
    # replacing end of line('/n') with ' ' and
    # splitting the text it further when '.' is seen.
    data_into_list = data.split("\n")
    
    # printing the data
    print(data_into_list)
    # my_file.close()