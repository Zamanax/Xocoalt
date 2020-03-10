import csv
import json
import re
import random as ran

with open('sentences.csv', mode="r", encoding="utf8") as sen:
    csv_reader = csv.reader(sen, delimiter='	')
    lcnt = 0
    dis = ["é","è","e"]
    y=[]
    W = input("Choose the word you want to work with.\n")
    for row in csv_reader:
        lang = row[1]
        text = row[2].lower()
        if lang == 'eng' and bool(re.search( "(?:^|\W)"+W+"(?=$|\W)", text)):
            x = text.replace(W,"_____")
            y.append(x)
            print(x)
        lcnt += 1
        if lcnt == 5000:
            break
    with open("jsone/" + W +'.json', 'w') as f:
        f.write(json.dumps(y, indent=4))
    print(f'Processed {lcnt} lines.')