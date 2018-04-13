import psycopg2
import psycopg2.extras
import urllib.parse
import os
#  wont need this later


class adminDB:
	def __init__(self):
		urllib.parse.uses_netloc.append("postgress")
		url = urllib.parse.urlparse(os.environ["DATABASE_URL"])
		self.connection = psycopg2.connect(
			cursor_factory = psycopg2.extras.RealDictCursor,
			database = url.path[1:],
			user = url.username,
			password = url.password,
			host = url.hostname,
			port = url.port
		)
		self.cursor = self.connection.cursor()

	def __del__(self):
		self.connection.close()
		print("disconnecting...")

	def createAdminTable(self):
		self.cursor.execute("CREATE TABLE IF NOT EXISTS adminList(uid SERIAL PRIMARY KEY, fname VARCHAR(255), lname VARCHAR(255), username VARCHAR(255), password VARCHAR(255))")
		self.connection.commit()



	def createNewRecord(self, fName, lName, username, password):
		self.cursor.execute("INSERT INTO adminList (fname, lname, username, password) VAlUES (%s, %s, %s, %s)",
			[fName, lName, username, password])
		self.connection.commit()

	def getAllRecords(self):
		self.cursor.execute("SELECT * FROM adminList")
		return self.cursor.fetchall()

	def getRecord(self, adminID):
		self.cursor.execute("SELECT * FROM adminList WHERE ID = %s", [adminID])
		return self.cursor.fetchone()

	def deleteRecord(self, adminID):
		self.cursor.execute("DELETE FROM adminList WHERE ID = %s", [adminID])
		self.connection.commit()
		return 

	def updateRecord(self, fName, lName, username, password, value):
		self.cursor.execute("UPDATE adminList  SET fName = %s, lName = %s, username = %s, password = %s WHERE ID = %s",
			[fName, lName, username, password, value])
		self.connection.commit()
		
		return
	def checkUsername(self, username):
		self.cursor.execute("SELECT * FROM adminList WHERE username = %s", [username])
		rows = self.cursor.fetchall()
		return rows

class questionDB:
	def __init__(self):
		urllib.parse.uses_netloc.append("postgress")
		url = urllib.parse.urlparse(os.environ["DATABASE_URL"])
		self.connection = psycopg2.connect(
			cursor_factory = psycopg2.extras.RealDictCursor,
			database = url.path[1:],
			user = url.username,
			password = url.password,
			host = url.hostname,
			port = url.port
		)
		self.cursor = self.connection.cursor()



	def __del__(self):
		self.connection.close()
		print("disconnecting...")

	def createTopicTable(self):
		self.cursor.execute("CREATE TABLE IF NOT EXISTS TopicList(uid SERIAL PRIMARY KEY, topic VARCHAR(1000))")
		self.connection.commit()

	def createQuestionTable(self):
		self.cursor.execute("CREATE TABLE IF NOT EXISTS QuestionTable(uid SERIAL PRIMARY KEY, question VARCHAR(1000), choiceA VARCHAR(1000), choiceB VARCHAR(1000), choiceC VARCHAR(1000), choiceD VARCHAR(1000))")
		self.connection.commit()



	def createNewTopic(self, topic):
		self.cursor.execute("INSERT INTO TopicList (topic) VAlUES (%s)",
			[topic])
		self.connection.commit()

	def createNewQuestion(self, question, topic, a, b, c, d):
		self.cursor.execute("INSERT INTO questionList (question, topicID, choiceA, choiceB, choiceC, choiceD) VAlUES (%s,%s,%s,%s,%s,%s)",
			[question, topic, a, b, c, d])
		self.connection.commit()

	def getAllTopics(self):
		self.cursor.execute("SELECT * FROM TopicList")
		return self.cursor.fetchall()

	def getAllQuestions(self, topicId):
		print(topicId)
		self.cursor.execute("SELECT * FROM questionList WHERE topicID = %s", [topicId])
		return self.cursor.fetchall()

	def getTopic(self, topicId):
		self.cursor.execute("SELECT * FROM TopicList WHERE ID = %s", [topicId])
		return self.cursor.fetchone()

	def getQuestion(self, questionId):
		self.cursor.execute("SELECT * FROM questionList WHERE ID = %s", [questionId])
		return self.cursor.fetchone()

	def deleteTopic(self, topidId):
		self.cursor.execute("DELETE FROM TopicList WHERE ID = %s", [topidId])
		self.connection.commit()
		self.cursor.execute("DELETE FROM questionList WHERE topicID = %s", [topidId])
		self.connection.commit()
		return 

	def deleteQuestion(self, questionId):
		self.cursor.execute("DELETE FROM questionList WHERE ID = %s", [questionId])
		self.connection.commit()
		return 


	def updateQuestion(self, question, value):
		self.cursor.execute("UPDATE questionList  SET question = %s WHERE ID = %s",
			[question, value])
		self.connection.commit()
		return


