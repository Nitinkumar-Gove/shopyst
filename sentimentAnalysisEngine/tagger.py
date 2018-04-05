import nltk, json
from nltk.tag import pos_tag, map_tag


# text = nltk.word_tokenize("And now for something completely different")
# taggedPos = nltk.pos_tag(text)
# simplifiedTags = [(word, map_tag('en-ptb', 'universal', tag)) for word, tag in taggedPos]
# print(simplifiedTags)

# positives = open('C:/Users/gaura/295B/positives.txt', 'w')
negatives = open('C:/Users/gaura/295B/negatives.txt', 'w')
pc = 0 # positive counter
nc = 0 # negative counter

with open('C:/Users/gaura/295B/Books_5.json') as f:

    for line in f:
        # print line
        # break
        # if pc >= 5000 and nc >= 5000:
        parsed_json = json.loads(line)
        text = parsed_json['reviewText']
        summary = parsed_json['summary']
        textSummary = nltk.word_tokenize(text + " " + summary)
        # print textSummary
        taggedPos = nltk.pos_tag(textSummary)
        simplifiedTags = [(word, map_tag('en-ptb', 'universal', tag)) for word, tag in taggedPos]
        # print simplifiedTags
        cleanText = ""
        for word in simplifiedTags:
            if word[1] != 'X' and word[1] != '.' and word[1] != 'PRON' and word[1] != 'PRT' and word[1] != 'DET' and word[1] != 'ADP':
                cleanText = cleanText + (word[0]) + " "

        # if parsed_json['overall'] == 4.0 or parsed_json['overall'] == 5.0:
        #     if pc <= 5000:
        #         positives.write(cleanText)
        #         positives.write('\n')
        #         pc = pc + 1
        #         print ("pc = ", pc)
        #     continue
        if parsed_json['overall'] == 1.0 or parsed_json['overall'] == 2.0:
            if nc <= 5000:
                negatives.write(cleanText)
                negatives.write('\n')
                nc = nc + 1
                print ("nc = ", nc)
            continue

# positives.close()
negatives.close()
