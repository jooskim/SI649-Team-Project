import csv, json, codecs, urllib2, time, os, errno
from bs4 import BeautifulSoup

def loansPerTeam(teams, sector):
	teams = list(set(teams))
	
	for team in teams:
		link = 'http://api.kivaws.org/v1/teams/'+str(team)+'/loans.json'
		url = urllib2.urlopen(link)
		soup = BeautifulSoup(url)
		jsonContainer = json.loads(str(soup))
		totalPages = jsonContainer['paging']['pages']
		if(totalPages > 100):
			totalPages = 100
		time.sleep(0.61)
		print totalPages

		for page in range(1,totalPages+1):
			link = 'http://api.kivaws.org/v1/teams/'+ str(team) +'/loans.json?page='+str(page)
			time.sleep(0.61)
			print link
			url = urllib2.urlopen(link)
			soup = BeautifulSoup(url)
			
			try:
				os.makedirs('data/'+sector+'/teams/'+str(team))
			except OSError as exception:
				if exception.errno != errno.EEXIST:
					raise

			f = open('data/'+sector+'/teams/'+str(team)+'/'+str(page)+'.json', 'wb')
			f.write(str(soup))
			f.close()

# Me		
loansPerTeam([9059,253,28412],'agriculture')