import sys, json, codecs, urllib2, time, os, errno
from bs4 import BeautifulSoup

f = open(sys.argv[1]+'/1.json', 'rU')
jsonData = json.loads(f.read())
totalPages = jsonData['paging']['pages'];
if(totalPages > 100):
	totalPages = 100
f.close()

results = []

for page in range(1,totalPages+1):
	print "processing file: " + str(page)
	fileName = str(page)+'.json'
	elem = open(sys.argv[1]+'/'+fileName, 'rU')
	elemJSON = json.loads(elem.read())
	
	for loan in elemJSON['loans']:
		results.append(loan)

fOutput = open(sys.argv[1]+'/concatenated.json','wb')
fOutput.write(json.dumps(results))
fOutput.close()
