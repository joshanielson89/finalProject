from session_store import SessionStore
from http import cookies
from http.server import BaseHTTPRequestHandler, HTTPServer
import random
import json
import urllib.parse 
from clicker_DB import * 
import sys
from passlib.hash import bcrypt
import os

gSessionStore = SessionStore()

gAnswerCountA = 0
gAnswerCountB = 0
gAnswerCountC = 0
gAnswerCountD = 0
gSessionID = 12113  #something unguessable
gSessionCount = 0
gCurrentQuestion = {}


#application/x-www-form-urlencoded

class MyRequestHandler(BaseHTTPRequestHandler):
	def do_OPTIONS(self):
		self.load_session()
		self.send_response(200)
		self.send_header("Access-Control-Allow-Origin", '*')
		self.send_header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		self.send_header("Access-Control-Allow-Headers", "Content-type")
		self.end_headers()

	def do_GET(self):
		self.load_session()
		parsedPath = splitPath(self.path)
		# This is for LIST

		#serves html, css, js to client
		self.serveStatic()

		if parsedPath[0] == "admin":
			self.handleAdminLIST()
		elif parsedPath[0] == "currentQuestion":
			self.handleReturnQuestion()
		elif parsedPath[0] == "topics":
			self.handleTopicLIST()
		# if the question has an id??
		elif parsedPath[0] == "setQuestion":
			self.handleSetCurrentQuestion(parsedPath[1])
		elif parsedPath[0] == "getQuestion":
			self.handleGetCurrentQuestion()
		elif parsedPath[0] == "questions":
			self.handleQuestionList(parsedPath[1])
		elif parsedPath[0] == "getAnswers":
			self.handleAnswerReturn()
		elif parsedPath[1] == "cSessionID":
			self.handleGetSessionID()
		else:
			self.send404()
		return

	def do_POST(self):
		self.load_session()
		## Create a new admin
		if self.path =="/admin":
			self.handleAdminPOST()
		## Create a new question
		elif self.path == "/topics":
			self.handleTopicPOST()
		elif self.path == "/answer":
			self.handleAnswerPOST()
		elif self.path == "/question":
			self.handleQuestionPOST()
		elif self.path == "/session":
			self.handleLogin()

		## otherwise, not found
		else:
			self.send404()
		return

	def do_DELETE(self):
		self.load_session()
		parsedPath = splitPath(self.path)
		if parsedPath[0] == "admin":
			db = adminDB()
			if db.getRecord(parsedPath[1]):
				self.handleAdminDELETE(parsedPath)
			else:
				self.send404()
		elif parsedPath[0] == "topics":
			db = questionDB()
			if db.getTopic(parsedPath[1]):
				self.handleTopicDELETE(parsedPath)
			else:
				self.send404()
		elif parsedPath[0] == "question":
			db = questionDB()
			if db.getQuestion(parsedPath[1]):
				self.handleQuestionDELETE(parsedPath)
			else:
				self.send404()
		else:
			self.send404()

	def do_PUT(self): ## UPDATE
		self.load_session()
		parsedPath = splitPath(self.path)
		## find the path and if ID exists in the collection
		if parsedPath[0] == "admin" and parsedPath[1] is not None:  
			self.handleAdminPUT(parsedPath)
		elif parsedPath[0] == "topics" and parsedPath[1] is not None:
			self.handleQuestionPUT(parsedPath)
		elif splitPath(self.path)[1] == "reset":
			self.handleChangePassword()
		## or send not found
		else:
			self.send404()
		return


	# ******* ADMINISTRATOR REQUEST HANDLERS **********
	def handleAdminLIST(self):
		db = adminDB()
		#response code here
		self.getInit()
		lines = db.getAllRecords()
		lines = json.dumps(lines)
		self.wfile.write(bytes(lines, "utf-8"))
		return

	def handleAdminRETRIEVE(self, parsedPath):
		db = clickerDB()
		#response code here
		lines = db.getRecord(parsedPath[1])
		if lines != None:
			self.getInit()
			lines = json.dumps(lines)
			self.wfile.write(bytes(lines, "utf-8"))
		else:
			self.send404()
			return
		return

	def handleAdminPOST(self):
		db = adminDB()
		#what to do when a post comes to server
		length = int(self.headers["Content-length"]) #every header describes the content and it's length
		body = self.rfile.read(length).decode("utf-8")
		parsed_body = dict(urllib.parse.parse_qsl(body))
		print("body is: ", body)
		print("parsed body is: ", parsed_body)

		fname = parsed_body["fName"]
		lname = parsed_body["lName"]
		username = parsed_body["username"]
		password = bcrypt.encrypt(parsed_body["password"])
		print(len(db.checkUsername(username)))
		if len(db.checkUsername(username)) == 0:
			print("starting new admin....")
			rowId = db.createNewRecord(fname, lname, username, password)

			self.session["userId"] = rowId

			self.send_response(201)
			self.send_cookie()
			self.send_header('Access-Control-Allow-Origin', '*')
			self.send_header('Access-Control-Allow-Credentials', 'true')
			self.send_header("Content-Type", "text/plain")
			self.end_headers()
			self.wfile.write(bytes(str(fname) + str(lname) + "was registered successfully.", "utf-8"))
		else:
			print("hit admin else")
			self.send_response(422)
			self.send_cookie()
			self.send_header('Access-Control-Allow-Origin', '*')
			self.send_header('Access-Control-Allow-Credentials', 'true')
			self.send_header("Content-Type", "text/plain")
			self.end_headers()
			self.wfile.write(bytes("This email is already registered.", "utf-8"))
		return

	def handleAdminDELETE(self, parsedPath):
		db = adminDB()
		db.deleteRecord(int(parsedPath[1]))
		self.send_response(200) #200 means "ok"
		self.send_cookie()
		self.send_header('Access-Control-Allow-Origin', '*')
		self.send_header('Access-Control-Allow-Credentials', 'true')
		self.send_header("Content-type", "application/json")
		# self.send_header("Access-Control-Allow-Origin",'*')
		self.end_headers()
		return

	def handleAdminPUT(self, parsedPath):
		db = adminDB()
		length = int(self.headers["Content-length"]) #every header describes the content and it's length
		body = self.rfile.read(length).decode("utf-8")
		parsed_body = dict(urllib.parse.parse_qsl(body))
		print("body is: ", body)
		print("parsed body is: ", parsed_body)

		#this is what the user input
		fName = parsed_body["fName"]
		lName = parsed_body["lName"]
		username = parsed_body["username"]
		thisId = parsed_body["uid"]

		arr = db.checkUsername(username)
		print(db.checkUsername(username))
		if len(arr) > 0:
			print(arr)
			arr = arr[0]
			userData = {
				'id': arr['uid'],
				'FirstName': arr['fName'],
				'LastName': arr['lName'],
				'username': arr['username'],
				'Password': arr['password']
			}

			db.updateRecord(fName, lName, username, userData['Password'], userData['id'])
		else:
			print("fist if")
			self.handle401()

	# ****** QUESTION REQUEST HANDLERS *************
	def handleTopicLIST(self):
		db = questionDB()
		#response code here
		self.getInit()
		lines = db.getAllTopics()
		lines = json.dumps(lines)
		self.wfile.write(bytes(lines, "utf-8"))
		return

	def handleQuestionList(self, topicId):
		db = questionDB()
		#response code here
		self.getInit()
		lines = db.getAllQuestions(topicId)
		print(lines)
		lines = json.dumps(lines)
		print(lines)
		self.wfile.write(bytes(lines, "utf-8"))
		return

	def handleTopicPOST(self):
		db = questionDB()
		#what to do when a post comes to server
		length = int(self.headers["Content-length"]) #every header describes the content and it's length
		body = self.rfile.read(length).decode("utf-8")
		parsed_body = dict(urllib.parse.parse_qsl(body))
		print("body is: ", body)
		print("parsed body is: ", parsed_body)

		question = parsed_body["question"]
		
		db.createNewTopic(question)
		self.send_response(201) #201 means "created"
		self.send_cookie()
		self.send_header('Access-Control-Allow-Origin', '*')
		self.send_header('Access-Control-Allow-Credentials', 'true')
		#self.send_header("Access-Control-Allow-Origin", "*")
		self.end_headers()
		return

	def handleQuestionPOST(self):
		db = questionDB()
		#what to do when a post comes to server
		length = int(self.headers["Content-length"]) #every header describes the content and it's length
		body = self.rfile.read(length).decode("utf-8")
		parsed_body = dict(urllib.parse.parse_qsl(body))
		print("body is: ", body)
		print("parsed body is: ", parsed_body)

		question = parsed_body["question"]
		topic = parsed_body["topic"]
		choice1 = parsed_body["choiceA"]
		choice2 = parsed_body["choiceB"]
		choice3 = parsed_body["choiceC"]
		choice4 = parsed_body["choiceD"]

		
		db.createNewQuestion(question, topic, choice1, choice2, choice3, choice4)
		self.send_response(201) #201 means "created"
		self.send_cookie()
		self.send_header('Access-Control-Allow-Origin', '*')
		self.send_header('Access-Control-Allow-Credentials', 'true')
		#self.send_header("Access-Control-Allow-Origin", "*")
		self.end_headers()
		return

	def handleTopicDELETE(self, parsedPath):
		db = questionDB()
		db.deleteTopic(int(parsedPath[1]))
		self.send_response(200) #200 means "ok"
		self.send_cookie()
		self.send_header('Access-Control-Allow-Origin', '*')
		self.send_header('Access-Control-Allow-Credentials', 'true')
		self.send_header("Content-type", "application/json")
		#self.send_header("Access-Control-Allow-Origin", "*")
		self.end_headers()
		return

	def handleQuestionDELETE(self, parsedPath):
		db = questionDB()
		db.deleteQuestion(int(parsedPath[1]))
		self.send_response(200) #200 means "ok"
		self.send_cookie()
		self.send_header('Access-Control-Allow-Origin', '*')
		self.send_header('Access-Control-Allow-Credentials', 'true')
		self.send_header("Content-type", "application/json")
		#self.send_header("Access-Control-Allow-Origin", "*")
		self.end_headers()
		return

	# ****** Other Handlers ********
	# This will return a question
	def handleProjectQuesion(self):
		db = questionDB()
		#response code here
		self.getInit()
		line = db.getQuestion()
		line = json.dumps(line)
		global gCurrentQuestion
		global gAnswerCountA
		global gAnswerCountB
		global gAnswerCountC
		global gAnswerCountD
		gAnswerCountA = 0
		gAnswerCountB = 0
		gAnswerCountC = 0
		gAnswerCountD = 0
		gCurrentQuestion = line
		self.wfile.write(bytes(lines, "utf-8"))

	def handleSetCurrentQuestion(self, qID):
		db = questionDB()
		#response code here
		self.getInit()
		# change the session id
		changeSessionID()
		lines = db.getQuestion(qID)
		global gCurrentQuestion
		lines = json.dumps(lines)
		gCurrentQuestion = lines
		print("response: " , gCurrentQuestion)
		self.wfile.write(bytes(lines, "utf-8"))
		return 

	def handleGetCurrentQuestion(self):
		#response code here
		self.getInit()
		global gCurrentQuestion
		print(gCurrentQuestion)
		lines = json.dumps(gCurrentQuestion)
		self.wfile.write(bytes(lines, "utf-8"))
		return 

	def handleGetSessionID(self):
		#response code here
		self.getInit()
		global gSessionID
		lines = json.dumps(gSessionID)
		self.wfile.write(bytes(lines, "utf-8"))
		return 

	def handleReturnQuestion(self):
		self.getInit()
		global gCurrentQuestion
		if gCurrentQuestion != {}:
			line = gCurrentQuestion
		self.wfile.write(bytes(line, "utf-8"))

	def handleAnswerReturn(self):
		self.getInit()
		global gAnswerCountA
		global gAnswerCountB
		global gAnswerCountC
		global gAnswerCountD
		answers = {}
		answers["A"] = gAnswerCountA
		answers["B"] = gAnswerCountB
		answers["C"] = gAnswerCountC
		answers["D"] = gAnswerCountD
		answers = json.dumps(answers)
		self.wfile.write(bytes(answers, "utf-8"))
		gAnswerCountA = 0
		gAnswerCountB = 0
		gAnswerCountC = 0
		gAnswerCountD = 0

	def handleAnswerPOST(self):
		length = int(self.headers["Content-length"]) #every header describes the content and it's length
		body = self.rfile.read(length).decode("utf-8")
		parsed_body = dict(urllib.parse.parse_qsl(body))
		print("body is: ", body)
		print("parsed body is: ", parsed_body)

		answer = parsed_body["answer"]
		global gAnswerCountA
		global gAnswerCountB
		global gAnswerCountC
		global gAnswerCountD

		if answer == "A":
			gAnswerCountA += 1
		elif answer == "B":
			gAnswerCountB += 1
		elif answer == "C":
			gAnswerCountC += 1
		else:
			gAnswerCountD += 1

		print("A: " + str(gAnswerCountA) + "\n" + "B: " + str(gAnswerCountB) + "\n" + "C: " + str(gAnswerCountC) + "\n" + "D: " + str(gAnswerCountD) + "\n")
		self.send_response(201) #201 means "created"
		self.send_cookie()
		self.send_header('Access-Control-Allow-Origin', '*')
		self.send_header('Access-Control-Allow-Credentials', 'true')
		#self.send_header("Access-Control-Allow-Origin", "*")
		self.end_headers()
		return


	def handleLogin(self):
		db = adminDB()
		length = int(self.headers["Content-length"]) #every header describes the content and it's length
		body = self.rfile.read(length).decode("utf-8")
		parsed_body = dict(urllib.parse.parse_qsl(body))
		print("body is: ", body)
		print("parsed body is: ", parsed_body)

		#this is what the user input
		username = parsed_body["username"]
		password = parsed_body["password"]

		arr = db.checkUsername(username)
		print(db.checkUsername(username))
		if len(arr) > 0:
			print(arr)
			arr = arr[0]
			userData = {
				'id': arr['uid'],
				'FirstName': arr['fname'],
				'LastName': arr['lname'],
				'username': arr['username'],
				'Password': arr['password']
			}

			if bcrypt.verify(password, userData['Password']): 
				print("second if")
				self.session["userId"] = userData["id"]
				self.send_response(200)
				self.send_cookie()
				self.send_header('Access-Control-Allow-Origin', '*')
				self.send_header('Access-Control-Allow-Credentials', 'true')
				self.send_header("Content-Type", "text/plain")
				self.end_headers()
				self.wfile.write(bytes(str(userData["FirstName"]) + " " + str(userData["LastName"]) + " logged in successfully.", "utf-8"))
			else:
				self.handle401()
		else:
			print("fist if")
			self.handle401()

	def handleChangePassword(self):
		db = adminDB()
		length = int(self.headers["Content-length"]) #every header describes the content and it's length
		body = self.rfile.read(length).decode("utf-8")
		parsed_body = dict(urllib.parse.parse_qsl(body))
		print("body is: ", body)
		print("parsed body is: ", parsed_body)

		#this is what the user input
		username = parsed_body["username"]
		password = parsed_body["password"]
		newPassword = bcrypt.encrypt(parsed_body["newPassword"])

		arr = db.checkUsername(username)
		print(db.checkUsername(username))
		if len(arr) > 0:
			print(arr)
			arr = arr[0]
			userData = {
				'id': arr['ID'],
				'FirstName': arr['fname'],
				'LastName': arr['lname'],
				'username': arr['username'],
				'Password': arr['password']
			}

			if bcrypt.verify(password, userData['Password']): 
				print("second if")
				self.session["userId"] = userData["id"]
				self.send_response(200)
				db.updateRecord(userData['FirstName'], userData['LastName'], userData['username'], newPassword, userData['id'])
				self.send_cookie()
				self.send_header('Access-Control-Allow-Origin', '*')
				self.send_header('Access-Control-Allow-Credentials', 'true')	
				self.send_header("Content-Type", "text/plain")
				self.end_headers()
				self.wfile.write(bytes("User has been updated" , "utf-8"))
			else:
				print("second Else")
				self.handle401()
		else:
			print("fist if")
			self.handle401()


	def handleSessionCreate(self):
		sessionId = gSessionStore.createSession()
		self.cookie["sessionId"] = sessionId
		self.session = gSessionStore.getSession(sessionId)

	def load_session(self):
		self.load_cookie()
		if "sessionId" in self.cookie:
			sessionId = self.cookie["sessionId"].value
			sessionData = gSessionStore.getSession(sessionId)
			if sessionData is not None:
				self.session = sessionData
			else:
				self.handleSessionCreate()
		else:
			self.handleSessionCreate()

	def load_cookie(self):
		if "Cookie" in self.headers:
			self.cookie = cookies.SimpleCookie(self.headers["Cookie"])
		else:
			self.cookie = cookies.SimpleCookie()

	def send_cookie(self):
		# This code is called just before endHeaders() in every request
		for attribute in self.cookie.values():
			self.send_header("Set-Cookie", attribute.OutputString())

	def getInit(self):
		self.send_response(200) #200 means "ok"
		self.send_header("Content-type", "application/json")
		self.send_cookie()
		self.send_header('Access-Control-Allow-Origin', '*')
		self.send_header('Access-Control-Allow-Credentials', 'true')# "*" means anyone can access it
		#self.send_header("Access-Control-Allow-Origin", "*")
		self.end_headers()
		return

	def send404(self):
		self.send_response(404)
		self.send_cookie()
		self.send_header('Access-Control-Allow-Origin', '*')
		self.send_header('Access-Control-Allow-Credentials', 'true')
		self.end_headers()
		self.wfile.write(bytes("Content not found", "utf-8"))
		return


	def handle401(self):
		self.send_response(401)
		self.send_cookie()
		self.send_header('Access-Control-Allow-Origin', '*')
		self.send_header('Access-Control-Allow-Credentials', 'true')
		self.send_header("Content-Type", "text/plain")
		self.end_headers()
		self.wfile.write(bytes("You are not authorized for this request.", "utf-8"))

	def serveStatic(self):
		if self.path == "/":
			self.send_response(200)
			self.send_header("Content-type", "text/html")
			self.end_headers()
			file = open('public/index.html','rb')
			self.wfile.write(file.read())
			return
		elif self.path == "/style.css":
			self.send_response(200)
			self.send_header("Content-Type", "text/css")
			self.end_headers()
			file = open('public/style.css', 'rb')
			self.wfile.write(file.read())
			return
		elif self.path == "/login.js":
			self.send_response(200)
			self.send_header("Content-Type", "text/javascript")
			self.end_headers()
			file = open('public/login.js','rb')
			self.wfile.write(file.read())
			return 
		elif self.path == "/easytimer.min.js":
			self.send_response(200)
			self.send_header('Content-Type', 'text/javascript')
			self.end_headers()
			file = open('public/easytimer.min.js', 'rb')
			self.wfile.write(file.read())
			return
		elif self.path == "/favicon.ico":
			self.send_response(200)
			self.end_headers()
			return

def changeSessionID():
	global gSessionID
	randNum = random.randrange(1000,10000)
	gSessionID = randNum
	print (gSessionID)
	return

def splitPath(path):
	newList = path.split("/")
	newList = newList[1:]
	return newList


def main():
	admindb = adminDB()
	questiondb = questionDB()
	admindb.createAdminTable()
	questiondb.createTopicTable()
	questiondb.createQuestionTable()
	admindb = None
	questiondb = None

	port = 8080
	if len(sys.argv) > 1:
		port = int(sys.argv[1])

	# public_dir = os.path.join(os.path.dirname(__file__),'public')
	# os.chdir(public_dir)

	listen = ("0.0.0.0", port)
	server = HTTPServer(listen ,MyRequestHandler)

	print("Listening...")
	server.serve_forever()

main()

