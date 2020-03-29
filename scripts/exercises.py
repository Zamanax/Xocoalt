import csv
import json
import re

existingLanguages = {
    "english": "eng",
    "français": "fra",
}

with open('sentences.csv', mode="r", encoding="utf8") as sen:
    csv_reader = csv.reader(sen, delimiter='	')
    lcnt = 0
    match = 0
    y=[]
    W = input("Choose the word you want to work with.\n")
    nbLign = int(input("Choose the number of lines to process (or 0 to process them all!).\n"))
    nbMatch = int(input("Choose the number of match you desire.\n"))
    if nbMatch == 0:
        nbMatch = -1
    for k,v in existingLanguages.items():
        print(k+": "+v)
    chosenLanguage = input("And finally, choose the language desired.\n")
    for row in csv_reader:
        lang = row[1]
        text = row[2].lower()
        if lang == chosenLanguage and bool(re.search( "(?:^|\W)"+W+"(?=$|\W)", text)):
            x = text.replace(W,"_____")
            y.append(x)
            # print(x)
            match += 1
        lcnt += 1
        percent = int(lcnt/ nbLign)*100 if nbLign>0 else  int(lcnt/ 8208251)*100
        print("Match: " + str(match) + " - " + str(percent) + "%", end="\r")
        if lcnt == nbLign or (nbMatch == match):
            break
    print()
    with open("json/" + W +'.json', 'w') as f:
        f.write(json.dumps(y, indent=4))
    print(f'Processed {lcnt} lines.')