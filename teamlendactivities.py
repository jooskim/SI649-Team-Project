import csv, json, codecs, urllib2, time, os, errno
from bs4 import BeautifulSoup

## SAMPLING SIZE: AT MOST 500 USERS PER TEAM ##
def getTeamActivities(teams, sector):
	teams = list(set(teams))
	
	for team in teams:
		link = 'http://api.kivaws.org/v1/teams/'+str(team)+'/lenders.json'
		url = urllib2.urlopen(link)
		soup = BeautifulSoup(url)
		jsonContainer = json.loads(str(soup))
		totalPages = jsonContainer['paging']['pages']
		if(totalPages > 10):
			totalPages = 10
		time.sleep(0.51)
		print totalPages

		teamComposition = {}

		for page in range(1,totalPages+1):
			link = 'http://api.kivaws.org/v1/teams/'+ str(team) +'/lenders.json?page='+str(page)
			time.sleep(0.51)
			print link
			url = urllib2.urlopen(link)
			soup = BeautifulSoup(url)
			jC = json.loads(str(soup))
			for lender in jC['lenders']:
				if 'country_code' in lender:
					if lender['country_code'] not in teamComposition:
						teamComposition[lender['country_code']] = 1
					else:
						teamComposition[lender['country_code']] += 1
					print lender['country_code'], teamComposition[lender['country_code']]
		
		outputTeamComposition = json.dumps(teamComposition)	
		f = open('data/'+sector+'/teams/'+str(team)+'/'+'teamComposition.json', 'wb')
		f.write(outputTeamComposition)
		f.close()

agriculture = [26781, 2919, 14145, 22284, 107, 394, 26615, 24642, 13726, 616, 337, 283, 6406, 11674, 7549, 150, 9325, 94, 80, 1318, 9059, 253, 28412]
arts = [288, 71, 394, 240, 26687, 19768, 260, 7280, 94, 231, 96, 147, 116, 22708, 981, 7039, 5824, 13515, 3001, 283, 473, 26701, 9325, 42, 3573, 13771, 107, 19180, 890, 196, 1333, 4801, 5544, 19732, 150, 435]
clothing = [147, 283, 22, 19732, 3714, 13726, 27024, 709, 288, 107, 24141, 18182, 111, 13668, 9325, 9214, 22708, 191, 260, 94, 22793, 9632, 5527, 24278, 74, 414, 8900, 909, 9820, 231, 7938, 14256, 1640, 394, 339, 1317, 92]
construction = [709, 107, 178, 257, 394, 11162, 239, 22, 339, 16899, 20393, 1325, 4528, 19732, 283, 260, 12251, 882, 24278, 6695, 12818, 9871, 7280, 890, 3976, 141, 96, 6970, 94, 2172, 1225, 10374, 1525, 1312, 12351, 22668, 312, 9325, 2498, 5585, 2639]
education = [540, 283, 394, 191, 283, 1333, 260, 283, 394, 22, 391, 1751, 41, 109, 9325, 473, 8317, 1318, 283, 709, 94, 24283, 42, 174, 6489, 394, 21207, 28512, 283, 94, 22606, 117, 709, 8834, 1755, 283, 1669, 283, 178, 709, 94, 231, 1098]
entertainment = [94, 889, 19401, 42, 116, 10929, 20979, 222, 15473, 260, 14461, 117, 14543, 7637, 1053, 394, 283, 9368, 2776, 288, 7280, 18077, 13094, 414, 19732, 4398, 96, 107, 94, 283, 18077, 25472, 94, 26974, 42, 4234, 27163, 2252, 21207, 24248, 5522, 11494, 18077, 246]
food = [9325, 394, 28722, 4253, 19732, 9127, 22708, 147, 283, 20182, 22192, 25292, 116, 360, 8048, 4681, 19732, 94, 470, 283, 19732, 6395, 9392, 9325, 4359, 22887, 2450, 260, 473, 107, 16422, 12288, 1600, 7166, 28412, 22708, 111, 94, 591, 191, 178, 25606]
health = [116, 3471, 4513, 109, 260, 1640, 12528, 9409, 17, 24175, 8774, 234, 26855, 4848, 10429, 339, 9325, 394, 16996, 22679, 558, 28412, 84, 2842, 94, 257, 360, 641, 1642, 6896, 260, 94, 752, 28412, 260, 257]
housing = [18592, 283, 116, 709, 132, 94, 21343, 21343, 1913, 116, 132, 94, 942, 147, 5000, 21343, 12351, 4716, 709, 283, 9950, 9325, 18077, 28701, 116, 6509, 709]
manufacturing = [709, 132, 890, 111, 13903, 26958, 116, 22708, 7220, 22158, 11395, 94, 132, 178, 13771, 22279, 31, 163, 87, 16489, 481, 394, 257, 15445, 594, 107, 84, 13771, 18071, 94, 15570, 4278, 117, 21207, 376, 132, 16489, 8095, 239, 3001, 26619, 27350, 283, 8032]
personaluse = [5527, 94, 3032, 1333, 709, 94, 260, 20340, 19878, 20907, 84, 42, 8900, 283, 20783, 25827, 473, 13803, 337, 394, 191, 40, 283, 260, 20783, 257, 394, 28623, 25333, 94, 641, 9770, 5527, 540, 4801, 24233, 394, 312, 117, 394, 12969, 20783, 19180]
retail = [24790, 8912, 94, 24790, 13771, 22708, 283, 18077, 11674, 9325, 260, 13094, 15508, 22028, 18077, 12969, 22708, 1372, 283, 22708, 283, 18077, 283, 18077, 22708, 283, 18077, 10434, 3414, 19732, 12288, 28722, 283, 18077, 18077, 19732, 17, 9127, 19401, 2598, 22708, 283, 4801, 22708, 283, 18077, 9119, 94, 24790, 15734, 18077, 22708, 9127, 283, 19732]
services = [9632, 1504, 4096, 27024, 96, 12375, 11567, 709, 111, 24141, 709, 283, 283, 94, 18805, 3619, 42, 394, 394, 283, 18749, 26823, 24141, 94, 22, 394, 1461, 709, 58, 5987, 709, 394, 107, 25968, 54, 58, 191, 1366, 4096, 222, 709, 94, 9632]
transportation = [94, 473, 330, 19081, 4801, 9325, 22, 27757, 6180, 19821, 473, 709, 15729, 260, 9711, 23086, 709, 15729, 80, 13803, 21207, 394, 9847, 5652, 80, 709, 8557, 1853, 13771, 26627, 709, 283, 1350, 5527, 473, 27578, 21207, 4593, 580, 27829, 2020, 147]
wholesale = [7280, 22102, 18077, 23585, 111, 16265, 21748, 1504, 117, 22, 13562, 23845, 20341, 24460, 283, 9467, 15521, 2838, 13515, 340, 94, 11415, 116, 10166, 334]

# getTeamActivities(agriculture, 'agriculture')
getTeamActivities(arts, 'arts')
getTeamActivities(clothing, 'clothing')
getTeamActivities(construction, 'construction')
getTeamActivities(education, 'education')
getTeamActivities(entertainment, 'entertainment')
getTeamActivities(food, 'food')
getTeamActivities(health, 'health')
getTeamActivities(housing, 'housing')
getTeamActivities(manufacturing, 'manufacturing')
getTeamActivities(personaluse, 'personaluse')
getTeamActivities(retail, 'retail')
getTeamActivities(services, 'services')
getTeamActivities(transportation, 'transportation')
getTeamActivities(wholesale, 'wholesale')