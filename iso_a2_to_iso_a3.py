import csv, json, codecs, urllib2
from bs4 import BeautifulSoup

url = urllib2.urlopen('http://www.nationsonline.org/oneworld/country_code_list.htm')
soup = BeautifulSoup(url)
tables = soup.find_all('table')

a2val = ''
a3val = ''
results = {}

for table in tables:
	if table.get('id') == 'codelist':
		trs = table.find_all('tr')
		for tr in trs:
			tds = tr.find_all('td')
			for td in tds:
				if tds.index(td) == 2:
					a2val = td.string.strip()

				if tds.index(td) == 3:
					a3val = td.string.strip()
					break
			results[a2val] = a3val

			
fOutput = open('iso_a2_to_a3.json','wb')
fOutput.write(json.dumps(results))
fOutput.close()
