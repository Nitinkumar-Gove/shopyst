
# coding: utf-8

# In[1]:


from sklearn.feature_extraction.text import CountVectorizer
import pandas as pd
from nltk.stem import WordNetLemmatizer
import numpy as np
from sklearn.svm import SVR

# TODO convert feature vec

fh1 = open('C:/Users/gaura/295B/positives.txt', 'r')
positives = fh1.readlines()
# print type(positives)
# print len(positives)
fh2 = open('C:/Users/gaura/295B/negatives.txt', 'r')
negatives = fh2.readlines()
# print type(negatives)
# print len(negatives)
# exit(25)

trainData = positives+negatives
print len(trainData)
# exit(25)

fh3 = open('C:/Users/gaura/295B/ratings.txt', 'r')
ratings = fh3.readlines()
print len(ratings)
# exit(11)
# for x in ratings:
    # print x
r = map(float, ratings)
# print len(r)
# exit(111)


# In[2]:


# pass analyser to CountVectorizer
wnl = WordNetLemmatizer()
analyzer = CountVectorizer().build_analyzer()

# method for lemmatization
def lemmatized_words(doc):
    return (wnl.lemmatize(w) for w in analyzer(doc))

vectorizer = CountVectorizer(analyzer=lemmatized_words)
train_xformed = vectorizer.fit_transform(trainData)
# print vectorizer.get_feature_names().__sizeof__()

regressor = SVR(C=1.0, epsilon=0.2)
regressor.fit(train_xformed, ratings)
print "fitting done"


# In[3]:


test_xformed = vectorizer.transform(["The book came so fast I could not believe it and it was in perfect condition REALLY fast shipping"])
print (regressor.predict(test_xformed))


# In[34]:


import nltk, json
from itertools import izip
from sklearn.metrics import mean_absolute_error

def test(testFileObj, testRatingsFileObj, numberOfRecords):
    counter = 0
    amazonRatings = []
    reviewTexts = []
    predictedRatingsList = []
    for testData, testRating in izip(testFileObj, testRatingsFileObj):
        if(counter >= numberOfRecords):
            print("inside if")
            break

        reviewTexts.append(testData)
        amazonRatings.append(float(testRating))
        counter = counter + 1
#         print counter
    
#     print reviewTexts
    testMatrix = vectorizer.transform(reviewTexts)
#     print testMatrix
    predictedRatings = regressor.predict(testMatrix)
#     print type(predictedRatings)
    for x in predictedRatings:
        predictedRatingsList.append(x)
    
    print predictedRatingsList
    print("mean error = ", mean_absolute_error(amazonRatings, predictedRatingsList))
    
        
        
    


# In[35]:


testFileObj = open('C:/Users/gaura/295B/testReviews.txt', 'r')
testRatingsFileObj = open('C:/Users/gaura/295B/testRatings.txt', 'r')
test(testFileObj, testRatingsFileObj, 1000)

