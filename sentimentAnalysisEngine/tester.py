import nltk, json

testReviews = open('C:/Users/gaura/295B/testReviews.txt', 'w')
testRatings = open('C:/Users/gaura/295B/testRatings.txt', 'w')

fileObj = open('C:/Users/gaura/295B/Books_5.json')
counter = 0
for i, line in enumerate(fileObj):
    # print "file opened"
    if i in range(50000, 60000):
        print i
        parsed_json = json.loads(line)
        text = parsed_json['reviewText']
        summary = parsed_json['summary']
        textSummary = text + " " + summary
        rating = parsed_json['overall']
        testReviews.write(textSummary)
        testReviews.write('\n')
        testRatings.write(str(rating))
        testRatings.write('\n')
    elif i > 60000:
        break

# f.close
testReviews.close()
testRatings.close()
