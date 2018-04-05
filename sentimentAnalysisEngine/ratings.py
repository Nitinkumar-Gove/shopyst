import nltk, json
from nltk.tag import pos_tag, map_tag

ratings = open('C:/Users/gaura/295B/ratings.txt', 'w')
counter1 = 0

f = open('C:/Users/gaura/295B/Books_5.json')

for line in f:
    parsed_json = json.loads(line)
    overall = parsed_json['overall']
    # print overall
    if counter1 < 5000:
        if overall == 4.0 or overall == 5.0:
            ratings.write(str(overall)+'\n')
            counter1 = counter1 + 1
            # ratings.write('\n')
        print ("c1",counter1)
    else : break

counter2 = 0

for line in f:
    parsed_json = json.loads(line)
    overall = parsed_json['overall']
    # print overall
    if counter2 < 4999:
        print ("c2", counter2)
        if overall == 1.0 or overall == 2.0:
            ratings.write(str(overall)+ '\n')
            # ratings.write('\n')
            counter2 = counter2 + 1
    else:break

ratings.close()