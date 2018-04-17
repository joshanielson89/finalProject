//Joshua Nielson
//March 12, 2018

"use strict";

// creates the login page
function startLoginPage() {
	// select main div and clear it
	var wrapperDiv = document.querySelector("#wrapper");
	wrapperDiv.innerHTML = "";

	// ******** admin section ******** //	
	// create admin option div
	var adminDiv = document.createElement("div");
	adminDiv.setAttribute("id", "adminDiv");

	// create admin button selector
	var adminAccountButton = document.createElement("button");
	adminAccountButton.setAttribute("id", "adminAccountButton");
	adminAccountButton.innerHTML = "Login";

	var registerAdminButton = document.createElement("button");
	registerAdminButton.setAttribute('id', 'registerAdminButton');
	registerAdminButton.innerHTML = "Sign Up";

	var smallCTA = document.createElement('span');
	smallCTA.setAttribute('id', 'smallCTA');
	smallCTA.innerHTML = 'or';

	var nowSpan = document.createElement('span');
	nowSpan.setAttribute('id', 'nowSpan');
	nowSpan.innerHTML = 'now!';

	var callToAction = document.createElement('span');
	callToAction.setAttribute('id', 'callToAction');
	callToAction.innerHTML = 'Want to make your own games?';

	var home = document.createElement('button');
	home.setAttribute('id', 'home');
	home.innerHTML = "play";
	home.onclick = function () {
		startLoginPage();
	}
	// append admin to wrapper
	adminDiv.appendChild(callToAction);
	adminDiv.appendChild(adminAccountButton);
	adminDiv.appendChild(smallCTA);
	adminDiv.appendChild(registerAdminButton);
	adminDiv.appendChild(nowSpan);
	wrapperDiv.appendChild(adminDiv);

	// ******** student section ******** //
	// create student section
	var studentDiv = document.createElement("div");
	studentDiv.setAttribute("id", "studentDiv");

	// make html

	studentDiv.insertAdjacentHTML("beforeend", '<input type = "text" id = "gameID" placeholder="Game ID"/>')
	studentDiv.insertAdjacentHTML("beforeend", "<br>");

	// make join session button
	var joinSessionButton = document.createElement("button");
	joinSessionButton.setAttribute("id", "joinGameButton");
	joinSessionButton.innerHTML = "Enter";
	// add join session to student div
	studentDiv.appendChild(joinSessionButton);

	// append student to wrapper
	wrapperDiv.appendChild(studentDiv);
	registerAdminButton.onclick = function () {
		adminDiv.innerHTML = "";
		var fName = document.createElement('input');
		fName.setAttribute("placeholder", 'First Name');
		fName.setAttribute('id', "fName");

		var lName = document.createElement('input');
		lName.setAttribute('placeholder', 'Last Name');
		lName.setAttribute('id', 'lName');

		var username = document.createElement("input");
		username.setAttribute("placeholder", "Username");
		username.setAttribute("id", "username");
		// password field
		var password = document.createElement("input");
		password.setAttribute("placeholder", "Password");
		password.setAttribute("type", "password");
		password.setAttribute("id", "password");
		// login button
		var adminRegister = document.createElement("button");
		adminRegister.setAttribute("id", "adminRegisterButton");
		adminRegister.innerHTML = "Register";

		smallCTA.innerHTML = 'Already have an account?';
		smallCTA.setAttribute('id', 'loginCTA');

		adminAccountButton.setAttribute('id', 'loginButton');
		// add the fields to the html div "adminDiv"
		adminDiv.appendChild(fName);
		adminDiv.appendChild(lName);
		adminDiv.appendChild(username);
		adminDiv.appendChild(password);
		adminDiv.appendChild(adminRegister);
		adminDiv.appendChild(smallCTA);
		adminDiv.appendChild(adminAccountButton);
		// check to see if the credentials are valid
		adminRegister.onclick = function () {
			var data = encodeURI("fName=" + fName.value + "&lName=" + lName.value + "&username=" + username.value + "&password=" + password.value);
			fetch("https://klikr.herokuapp.com/admin", {
				method: "POST",
				body: data,
				headers: {
					"Content-Type": "application/x-www-form-urlencoded"
				}
			}).then(function (response) {
				var pageTitle = document.querySelector('#pageTitle');
				pageTitle.style.display = 'none';
				startAdminPage();
			});
		}
	}


	// if admin button is clicked, check authorization and redirect
	adminAccountButton.onclick = function () {
		adminDiv.innerHTML = "";
		var username = document.createElement("input");
		username.setAttribute("placeholder", "Username");
		username.setAttribute("id", "username");
		// password field
		var password = document.createElement("input");
		password.setAttribute("placeholder", "Password");
		password.setAttribute("type", "password");
		password.setAttribute("id", "password");
		// login button
		var adminLogin = document.createElement("button");
		adminLogin.setAttribute("id", "adminLoginButton");
		adminLogin.innerHTML = "Login";

		var registerAdmin = registerAdminButton;
		registerAdmin.setAttribute('id', 'adminRegister');

		var noAccount = document.createElement('span');
		noAccount.innerHTML = "don't have an account?";
		noAccount.setAttribute('id', 'noAccount');

		smallCTA.innerHTML = "or";
		smallCTA.setAttribute('id', 'or');

		// add the fields to the html div "adminDiv"
		adminDiv.appendChild(username);
		adminDiv.appendChild(password);
		adminDiv.appendChild(adminLogin);
		adminDiv.appendChild(noAccount);
		adminDiv.appendChild(registerAdmin);
		adminDiv.appendChild(smallCTA);
		adminDiv.appendChild(home);
		// check to see if the credentials are valid
		adminLogin.onclick = function () {
			var data = encodeURI("username=" + username.value + "&password=" + password.value);
			fetch("https://klikr.herokuapp.com/session", {
				method: "POST",
				body: data,
				headers: {
					"Content-Type": "application/x-www-form-urlencoded"
				}
			}).then(function (response) {
				return response.text().then(text => {
					return {
						data: text,
						status: response.status
					}
				})
			}).then(function (response) {
				if (response.status == 200) {
					console.log(response.data);
					console.log("successfullly Logged in");
					var pageTitle = document.querySelector('#pageTitle');
					pageTitle.style.display = 'none';
					startAdminPage();
				} else {
					// print error here
					alert("You are not authorized to perfom this action");
				}
			});
		}
	}

	// if join session buttion is clicked, check validity and redirect
	joinSessionButton.onclick = function () {
		console.log("starting login");
		// input1 is the session id field
		var input1 = document.querySelector("#gameID").value;
		// fetch current sessionID and check if input is equivelent
		fetch("https://klikr.herokuapp.com/question/cSessionID").then(function (response) {
			// this will convert it to json data
			response.json().then(function (records) {
				console.log("The response is", records);
				if (input1 == records) {
					console.log("Login successful. Redirecting");
					// change page to student view
					var pageTitle = document.querySelector('#pageTitle');
					pageTitle.style.display = "none";
					startStudentPage();
				} else {
					alert("Invalid Session Key");
					document.querySelector("#sessionID").value = "";
				}
			})
		})
	}
}

// creates student view
function startStudentPage() {
	console.log("Starting student page");
	// select main div and clear it
	var wrapperDiv = document.querySelector("#wrapper");
	wrapperDiv.innerHTML = "";

	// create question div
	var questionDiv = document.createElement("div");
	questionDiv.setAttribute("id", "questionDiv");
	questionDiv.innerHTML = "Please wait for next question";
	wrapperDiv.appendChild(questionDiv);
	var alreadyQuestion = false;
	var currentQuestionInQueue = ""

	// create answer button div if not already done
	var answerButtonDiv = document.createElement("div");
	answerButtonDiv.setAttribute("id", "answerButtonDiv");
	wrapperDiv.appendChild(answerButtonDiv);

	// check every 3 seconds
	setInterval(function () {
		// do fetch stuff
		fetch("https://klikr.herokuapp.com/getQuestion/").then(function (response) {
			// this will convert it to json data
			response.json().then(function (records) {
				console.log(JSON.parse(records));
				console.log("The current question is: " + currentQuestionInQueue);
				// if the question has changed, update the new question buttons
				if (currentQuestionInQueue != JSON.parse(records).question) {
					currentQuestionInQueue = JSON.parse(records).question;
					questionDiv.innerText = JSON.parse(records).question;

					alreadyQuestion = false;
					if (alreadyQuestion == false) {
						// clear old answer div
						answerButtonDiv.innerHTML = "";
						// create answer buttons
						var answerButtonA = document.createElement("button");
						answerButtonA.setAttribute("id", "answerButtonA");
						answerButtonA.innerText = "A"
						answerButtonDiv.appendChild(answerButtonA);
						// when user clicks here, send answer to server
						answerButtonA.onclick = function () {
							answerButtonDiv.innerText = "Your answer has been submitted";
							questionDiv.innerText = "Please wait for next question";
							sendAnswerToServer("A");

						}

						var answerButtonB = document.createElement("button");
						answerButtonB.setAttribute("id", "answerButtonB");
						answerButtonB.innerText = "B"
						answerButtonDiv.appendChild(answerButtonB);
						answerButtonB.onclick = function () {
							answerButtonDiv.innerText = "Your answer has been submitted";
							questionDiv.innerText = "Please wait for next question";
							sendAnswerToServer("B");

						}

						var answerButtonC = document.createElement("button");
						answerButtonC.setAttribute("id", "answerButtonC");
						answerButtonC.innerText = "C"
						answerButtonDiv.appendChild(answerButtonC);
						answerButtonC.onclick = function () {
							answerButtonDiv.innerText = "Your answer has been submitted";
							questionDiv.innerText = "Please wait for next question";
							sendAnswerToServer("C");

						}

						var answerButtonD = document.createElement("button");
						answerButtonD.setAttribute("id", "answerButtonD");
						answerButtonD.innerText = "D"
						answerButtonDiv.appendChild(answerButtonD);
						answerButtonD.onclick = function () {
							answerButtonDiv.innerText = "Your answer has been submitted";
							questionDiv.innerText = "Please wait for next question";
							sendAnswerToServer("D");

						}
						alreadyQuestion = true;

					}
				}
			})
		})
	}, 3000);
}

// creates admin view
function startAdminPage() {
	console.log("Starting admin page");
	// select main div and clear it
	var wrapperDiv = document.querySelector("#wrapper");
	wrapperDiv.innerHTML = "";

	// create navigation div
	var navDiv = document.createElement("div");
	navDiv.setAttribute("id", "navDiv");
	wrapperDiv.appendChild(navDiv);

	// NAV OPTIONS ARE "NEW QUESTION" AND "ACCOUNT" // 
	// Create new question button
	var newQuestionButton = document.createElement("button");
	newQuestionButton.setAttribute("id", "newTopicButton");
	newQuestionButton.innerHTML = "+";

	// if this button is clicked, make a new question
	newQuestionButton.onclick = function () {
		// clear page
		wrapperDiv.innerHTML = "";
		// create navigation div
		var navDiv = document.createElement("div");
		navDiv.setAttribute("id", "navDiv");
		wrapperDiv.appendChild(navDiv);

		// NAV OPTIONS ARE "RETURN TO ADMIN HOME" // 
		// Create button to return to admin page
		var returnToAdminPageButton = document.createElement("button");
		returnToAdminPageButton.setAttribute("id", "returnToAdminPageButton");
		returnToAdminPageButton.innerHTML = "Admin Home";
		navDiv.appendChild(returnToAdminPageButton);
		// if this button is clicked, return user to admin home page
		returnToAdminPageButton.onclick = function () {
			startAdminPage();
		}
		// Create new question input field
		var questionDiv = document.createElement("div");
		questionDiv.setAttribute("id", "questionDiv");
		wrapperDiv.appendChild(questionDiv);
		questionDiv.insertAdjacentHTML("beforeend", "<input type = 'text' id = 'newQuestionInput' placeholder = 'New Topic' />")

		// create submit button
		var submitNewQuestionButton = document.createElement("button");
		submitNewQuestionButton.setAttribute("id", "submitNewQuestionButton");
		submitNewQuestionButton.innerHTML = "Submit";
		questionDiv.appendChild(submitNewQuestionButton);

		// When submit question button is clicked
		submitNewQuestionButton.onclick = function () {
			// check to see if there is any input
			if (newQuestionInput.value != "") {
				// create new question and redirect if successfull (redirect is in new question call)
				createNewTopic(newQuestionInput.value);
			}
			// let user know they didn't write anything
			else {
				alert("Please type in a new topic");
			}
		}

	}

	// Create account button
	var accountOptionsButton = document.createElement("button");
	accountOptionsButton.setAttribute("id", "accountOptionsButton");
	accountOptionsButton.innerHTML = "Account";
	navDiv.appendChild(accountOptionsButton);
	// if this button is clicked, open account options
	accountOptionsButton.onclick = function () {
		startAccountOptionsPage();
	}

	// ******* BUBBLE DIV HERE ******** //
	var bubbleDiv = document.createElement("div");
	bubbleDiv.setAttribute("id", "bubbleDiv");

	var questionBankHeader = document.createElement('h1');
	questionBankHeader.setAttribute('id', 'bankHeader');
	questionBankHeader.innerHTML = 'Question Banks';

	bubbleDiv.appendChild(newQuestionButton);
	bubbleDiv.appendChild(questionBankHeader);

	wrapperDiv.appendChild(bubbleDiv);

	// call GET to get all questions
	// this will return the whole topics DB
	fetch("https://klikr.herokuapp.com/topics").then(function (response) {
		// this will convert it to json data
		response.json().then(function (records) {
			var topicColor = 1;
			console.log("The response is", records);
			// this will check every record
			records.forEach(function (record) {

				var newTopicDiv = document.createElement("div");
				newTopicDiv.setAttribute("id", "newTopicDiv");
				bubbleDiv.appendChild(newTopicDiv);



				// this is the topic button to enter a topic
				var questionBubble = document.createElement("button");
				questionBubble.setAttribute("id", "topicBubble");

				if (topicColor == 1) {
					newTopicDiv.style.backgroundColor = "#0ad000";
					questionBubble.style.backgroundColor = "#31e728";
					newTopicDiv.style.marginLeft = "40px";
				} else if (topicColor == 2) {
					newTopicDiv.style.backgroundColor = "#02869f";
					questionBubble.style.backgroundColor = "#28b4ce";
				} else if (topicColor == 3) {
					newTopicDiv.style.backgroundColor = "#ff7c00";
					questionBubble.style.backgroundColor = "#ff932c";
				} else {
					newTopicDiv.style.backgroundColor = "#fd0006";
					questionBubble.style.backgroundColor = "#fe2c31";
					newTopicDiv.style.marginRight = '0px';
				}

				// This is the topic
				questionBubble.innerHTML = record.topic;
				var topicID = record.tid;
				newTopicDiv.appendChild(questionBubble);
				// open a topic tab when clicked and show all questions
				questionBubble.onclick = function () {
					// start the question page
					startQuestionPage(topicID);

				}

				// this will delete an entire topic
				var deleteQuestion = document.createElement("button");
				deleteQuestion.setAttribute("id", "deleteQuestion");
				deleteQuestion.innerHTML = "X";
				newTopicDiv.appendChild(deleteQuestion);

				deleteQuestion.onclick = function () {
					//call delete here and make sure to confirm action with user
					if (confirm("Are you sure you want to delete this record")) {
						deleteTopicFromDB(record.tid);
					}
					console.log("record deleted");
				}
				topicColor += 1;
				if (topicColor > 4) {
					topicColor = 1;
				}
			})
		})
	})
}

function startQuestionPage(topicID) {
	// select main div and clear it
	console.log(topicID);
	var wrapperDiv = document.querySelector("#wrapper");
	wrapperDiv.innerHTML = "";

	// CREATE NAVIGATION DIV
	var navDiv = document.createElement("div");
	navDiv.setAttribute("id", "navDiv");
	wrapperDiv.appendChild(navDiv);

	// CREATE QUESTION LIST DIV
	var QListDiv = document.createElement("div");
	QListDiv.setAttribute("id", "QListDiv");
	wrapperDiv.appendChild(QListDiv);

	// FILL QUESTION LIST DIV FROM DB
	fetch("https://klikr.herokuapp.com/questions/" + topicID).then(function (response) {
		// this will convert it to json data
		response.json().then(function (records) {
			console.log("The response is", records);
			// this will check every record
			records.forEach(function (record) {
				console.log("This is a question");
				var newQuestionDiv = document.createElement("div");
				newQuestionDiv.setAttribute("id", "newQuestionDiv");
				QListDiv.appendChild(newQuestionDiv);

				// this is the topic button to enter a topic
				var questionBubble = document.createElement("button");
				questionBubble.setAttribute("id", "questionBubble");
				// This is the question
				questionBubble.innerHTML = record.question;
				newQuestionDiv.appendChild(questionBubble);
				questionBubble.onclick = function () {
					console.log("Send question to server");
					setCurrentQuestion(record.qid);
				}

				var delQuestion = document.createElement("button");
				delQuestion.setAttribute("id", "delQuestion")
				delQuestion.innerHTML = "X";
				newQuestionDiv.appendChild(delQuestion);
				// to delete a question
				delQuestion.onclick = function () {
					//call delete here and make sure to confirm action with user
					if (confirm("Are you sure you want to delete this question?")) {
						deleteQuestionFromDB(record.qid);
					}
					console.log("record deleted");
				}

				// append new Questions to page
				QListDiv.appendChild(newQuestionDiv);
				wrapperDiv.appendChild(QListDiv);
			})
		})
	})


	// NAV OPTIONS ARE "RETURN TO ADMIN HOME" // 
	// Create button to return to admin page
	var returnToAdminPageButton = document.createElement("button");
	returnToAdminPageButton.setAttribute("id", "returnToAdminPageButton");
	returnToAdminPageButton.innerHTML = "Admin Home";
	navDiv.appendChild(returnToAdminPageButton);
	// if this button is clicked, return user to admin home page
	returnToAdminPageButton.onclick = function () {
		startAdminPage();
	}
	// create button to add a question to a topic
	var newQuestionInTopicButton = document.createElement("button");
	newQuestionInTopicButton.setAttribute("id", "newQuestionInTopicButton");
	newQuestionInTopicButton.innerHTML = "New Question";
	navDiv.appendChild(newQuestionInTopicButton);
	// to make a new question
	newQuestionInTopicButton.onclick = function () {
		// clear page
		wrapperDiv.innerHTML = "";
		// create navigation div
		var navDiv = document.createElement("div");
		navDiv.setAttribute("id", "navDiv");
		wrapperDiv.appendChild(navDiv);

		// NAV OPTIONS ARE "RETURN TO ADMIN HOME" // 
		// Create button to return to admin page
		var returnToAdminPageButton = document.createElement("button");
		returnToAdminPageButton.setAttribute("id", "returnToAdminPageButton");
		returnToAdminPageButton.innerHTML = "Admin Home";
		navDiv.appendChild(returnToAdminPageButton);
		// if this button is clicked, return user to admin home page
		returnToAdminPageButton.onclick = function () {
			startAdminPage();
		}
		// Create new question input field
		var questionDiv = document.createElement("div");
		questionDiv.setAttribute("id", "questionDiv");
		wrapperDiv.appendChild(questionDiv);
		var questionHTML = "<input type = 'text' id = 'newQuestionInput' placeholder = 'New Question' /> " + "<br>" +
			'<input type = "text" id = "answerChoiceA" class = "answerChoices" placeholder = "Choice A" />' + "<br>" +
			'<input type = "text" id = "answerChoiceB" class = "answerChoices" placeholder = "Choice B" />' + "<br>" +
			'<input type = "text" id = "answerChoiceC" class = "answerChoices" placeholder = "Choice C" />' + "<br>" +
			'<input type = "text" id = "answerChoiceD" class = "answerChoices" placeholder = "Choice D" />' + "<br>"
		questionDiv.insertAdjacentHTML("beforeend", questionHTML)

		// create submit button
		var submitNewQuestionButton = document.createElement("button");
		submitNewQuestionButton.setAttribute("id", "submitNewQuestionButton");
		submitNewQuestionButton.innerHTML = "Submit";
		questionDiv.appendChild(submitNewQuestionButton);

		// When submit question button is clicked
		submitNewQuestionButton.onclick = function () {
			// check to see if there is any input
			if (newQuestionInput.value != "") {
				// create new question and redirect if successfull (redirect is in new question call)
				createNewQuestion(topicID, newQuestionInput.value, answerChoiceA.value, answerChoiceB.value, answerChoiceC.value, answerChoiceD.value);
			}
			// let user know they didn't write anything
			else {
				alert("Please type in a new topic");
			}
		}
	}
}

// creates admin account view
function startAccountOptionsPage() {
	console.log("Starting account options page");
	// select main div and clear it
	var wrapperDiv = document.querySelector("#wrapper");
	wrapperDiv.innerHTML = "";

	// create navigation div
	var navDiv = document.createElement("div");
	navDiv.setAttribute("id", "navDiv");
	wrapperDiv.appendChild(navDiv);

	// NAV OPTIONS ARE "NEW QUESTION" AND "ACCOUNT" // 
	// Create button to return to admin page
	var returnToAdminPageButton = document.createElement("button");
	returnToAdminPageButton.setAttribute("id", "returnToAdminPageButton");
	returnToAdminPageButton.innerHTML = "Admin Home";
	navDiv.appendChild(returnToAdminPageButton);
	// if this button is clicked, return user to admin home page
	returnToAdminPageButton.onclick = function () {
		startAdminPage();
	}

	// make an options to add an admin
	var newAdminButton = document.createElement("button");
	newAdminButton.setAttribute("id", "newAdminButton");
	newAdminButton.innerHTML = "Add Admin";
	wrapperDiv.appendChild(newAdminButton);
	// when this is clicked, make a new admin
	newAdminButton.onclick = function () {
		var editSetup = document.querySelector("#inputFieldDiv");
		editSetup.innerHTML = "";
		// make title
		var title = document.createElement("h1");
		title.innerHTML = "New Admin"
		editSetup.appendChild(title);

		// make all input fields
		var fName = document.createElement("input");
		fName.setAttribute("placeholder", "First Name");
		editSetup.appendChild(fName);
		fName.insertAdjacentHTML("afterend", "<br>");

		var lName = document.createElement("input");
		lName.setAttribute("placeholder", "Last Name");
		editSetup.appendChild(lName);
		lName.insertAdjacentHTML("afterend", "<br>");

		var username = document.createElement("input");
		username.setAttribute("placeholder", "Username");
		editSetup.appendChild(username);
		username.insertAdjacentHTML("afterend", "<br>");

		var password1 = document.createElement("input");
		password1.setAttribute("placeholder", "Password");
		password1.setAttribute("type", "password");
		editSetup.appendChild(password1);
		password1.insertAdjacentHTML("afterend", "<br>");

		var password2 = document.createElement("input");
		password2.setAttribute("placeholder", "Confirm password");
		password2.setAttribute("type", "password");
		editSetup.appendChild(password2);
		password2.insertAdjacentHTML("afterend", "<br>");

		var addNewAdminButton = document.createElement("button");
		addNewAdminButton.setAttribute("id", "addNewAdminButton");
		addNewAdminButton.innerHTML = "Create Admin";
		editSetup.appendChild(addNewAdminButton);

		// if this button is clicked, create a new admin from the data in the input fields
		// the page refresh is called in the POST call
		addNewAdminButton.onclick = function () {
			// check and see if all the fields are filled in
			if (fName.value && lName.value && username.value && password1.value && password2.value) {
				// check and see if the passwords match
				if (password1.value == password2.value) {
					// call POST and create a new Admin
					createNewAdmin(fName.value, lName.value, username.value, password1.value);
				}
				// otherwise, alert user that the passwords do not match
				else {
					alert("Passwords do not match");
					password1.value = "";
					password2.value = "";
				}
			} else {
				alert("Not all fields were filled in");
				password1.value = "";
				password2.value = "";
			}
		}
	}

	// make a div for future edits
	var inputFieldDiv = document.createElement("div");
	inputFieldDiv.setAttribute("id", "inputFieldDiv");
	wrapperDiv.appendChild(inputFieldDiv);

	// display all admin information here
	var dataTable = document.createElement("table");
	dataTable.setAttribute("id", "dataTable");
	wrapperDiv.appendChild(dataTable);

	// Get and LIST all admin information
	fetch("https://klikr.herokuapp.com/admin").then(function (response) {
		response.json().then(function (records) {
			console.log("The response is", records);
			// clear any previous table
			dataTable.innerHTML = "";
			records.forEach(function (record) {
				// create record instance
				var wholeRecord = document.createElement("tr");
				// create record elements
				var fnameRecord = document.createElement("td");
				var lnameRecord = document.createElement("td");
				var usernameRecord = document.createElement("td");
				var editRecordBox = document.createElement("td");
				var editRecord = document.createElement("button");
				// if edit button is clicked call UPDATE
				editRecord.onclick = function () {
					console.log("hello");
					editRecordSetup(record);
				}
				// if delete button is clicked, call DELETE
				var deleteRecord = document.createElement("button");
				deleteRecord.onclick = function () {
					//call delete here
					console.log("hello2")
					// make sure to confirm action with user
					if (confirm("Are you sure you want to delete this record")) {
						deleteAdminFromDB(record.uid);
					}
					// console.log("record deleted");
				}

				// assign record elements to table elements
				fnameRecord.innerHTML = record.fname;
				lnameRecord.innerHTML = record.lname;
				usernameRecord.innerHTML = record.username;
				editRecord.innerHTML = "Edit";
				deleteRecord.innerHTML = "Delete";

				// append elements to record
				wholeRecord.appendChild(fnameRecord);
				wholeRecord.appendChild(lnameRecord);
				wholeRecord.appendChild(usernameRecord);
				editRecordBox.appendChild(editRecord);
				editRecordBox.appendChild(deleteRecord);
				wholeRecord.appendChild(editRecordBox);
				// append record to table
				dataTable.appendChild(wholeRecord);
			})
		})
	})
}

// this will edit an admin
function editRecordSetup(record) {
	var editSetup = document.querySelector("#inputFieldDiv");
	editSetup.innerHTML = "";
	// make title
	var title = document.createElement("h1");
	title.innerHTML = "Edit Admin"
	editSetup.appendChild(title);

	// make all input fields
	var fName = document.createElement("input");
	fName.setAttribute("placeholder", "First Name");
	fName.value = record.fName;
	editSetup.appendChild(fName);
	fName.insertAdjacentHTML("afterend", "<br>");

	var lName = document.createElement("input");
	lName.setAttribute("placeholder", "Last Name");
	lName.value = record.lName;
	editSetup.appendChild(lName);
	lName.insertAdjacentHTML("afterend", "<br>");

	var username = document.createElement("input");
	username.setAttribute("placeholder", "Username");
	username.value = record.username;
	editSetup.appendChild(username);
	username.insertAdjacentHTML("afterend", "<br>");

	var changePasswordDiv = document.createElement("div");
	changePasswordDiv.setAttribute("id", "changePasswordDiv");
	editSetup.appendChild(changePasswordDiv);

	var changePasswordButton = document.createElement("button");
	changePasswordButton.setAttribute("id", "changePasswordButton");
	changePasswordButton.innerHTML = "Change Password";
	changePasswordDiv.appendChild(changePasswordButton);
	// if change password is clicked
	changePasswordButton.onclick = function () {
		// remove change password option and replace with input fields
		changePasswordDiv.removeChild(changePasswordButton);
		// make all input fields
		var currentPassword = document.createElement("input");
		currentPassword.setAttribute("type", "password");
		currentPassword.setAttribute("id", "currentPassword");
		currentPassword.setAttribute("placeholder", "Current Password");
		changePasswordDiv.appendChild(currentPassword);
		currentPassword.insertAdjacentHTML("afterend", "<br>");

		var newPassword1 = document.createElement("input");
		newPassword1.setAttribute("type", "password");
		newPassword1.setAttribute("id", "newPassword1");
		newPassword1.setAttribute("placeholder", "New Password");
		changePasswordDiv.appendChild(newPassword1);
		newPassword1.insertAdjacentHTML("afterend", "<br>");

		var newPassword2 = document.createElement("input");
		newPassword2.setAttribute("type", "password");
		newPassword2.setAttribute("id", "newPassword2");
		newPassword2.setAttribute("placeholder", "Confirm New Password");
		changePasswordDiv.appendChild(newPassword2);
		newPassword2.insertAdjacentHTML("afterend", "<br>");

		// make new update button for update with passwords
		var updateButton2 = document.createElement("button");
		updateButton2.setAttribute("id", "updateButton2");
		updateButton2.innerHTML = "Update Record";
		editSetup.appendChild(updateButton2);
		// if this update button is clicked work with the new password fields **** CHANGE PASSWORD *****
		updateButton2.onclick = function () {
			// check to see if first, last, and username fields are filled in
			if (fName.value && lName.value && username.value && currentPassword.value) {
				if (newPassword1.value != "" && newPassword1.value == newPassword2.value) {
					// check to see if the current password matches via post
					var data = encodeURI("username=" + username.value + "&password=" + currentPassword.value + "&newPassword=" + newPassword1.value);
					fetch("https://klikr.herokuapp.com/pass/reset", {
						method: "PUT",
						body: data,
						headers: {
							"Content-Type": "application/x-www-form-urlencoded"
						}
					}).then(function (response) {
						return response.text().then(text => {
							return {
								data: text,
								status: response.status
							}
						})
					}).then(function (response) {
						if (response.status == 200) {
							console.log(response.data);
							console.log("successfullly changed password");
							startAccountOptionsPage();
						} else {
							// print error here
							alert("Username and Password does not match");
						}
					});
				}
			} else {
				alert("Some fields are not filled in");
				newPassword1.value = "";
				newPassword2.value = "";
			}
		}
	}

	// var setupNote = document.createElement("p");
	// setupNote.setAttribute("id", "setupNote");
	// setupNote.innerHTML = "If you do not want to update your password, click 'Update Record'"
	// editSetup.appendChild(setupNote);

	// var updateButton = document.createElement("button");
	// updateButton.setAttribute("id", "updateButton");
	// updateButton.innerHTML = "Update Record";
	// editSetup.appendChild(updateButton);

	// updateButton.onclick = function() {
	// 	if(fName.value && lName.value && username.value){
	// 		updateAdminInDB(fName.value, lName.value, username.value, record.password, record.ID);
	// 		var enterItems = document.querySelector("#inputFieldDiv");
	// 		enterItems.innerHTML = "";
	// 	} else {
	// 		alert("Some fields were not filled in");
	// 		admin.value = "";
	// 	}


	// }
}

// This will project the question screen
function projectCurrentQuestion(question) {
	console.log("The response is", question);
	// what to do with the question once returned
	var wrapperDiv = document.querySelector("#wrapper");
	wrapperDiv.innerHTML = "";

	// CREATE NAVIGATION DIV
	var navDiv = document.createElement("div");
	navDiv.setAttribute("id", "navDiv");
	wrapperDiv.appendChild(navDiv);

	// NAV OPTIONS ARE "RETURN TO ADMIN HOME" // 
	// Create button to return to admin page
	var returnToAdminPageButton = document.createElement("button");
	returnToAdminPageButton.setAttribute("id", "returnToAdminPageButton");
	returnToAdminPageButton.innerHTML = "Admin Home";
	navDiv.appendChild(returnToAdminPageButton);
	// if this button is clicked, return user to admin home page
	returnToAdminPageButton.onclick = function () {
		startAdminPage();
	}

	// creat div for session id
	// get the session id and post it
	fetch("https://klikr.herokuapp.com/question/cSessionID").then(function (response) {
		// this will convert it to json data
		response.json().then(function (questionData) {
			console.log("The response2 is", questionData);
			// Display the Session ID
			var sessionidDiv = document.createElement("div");
			sessionidDiv.setAttribute("id", "sessionidDiv");
			sessionidDiv.innerHTML = "Session: " + questionData;
			wrapperDiv.appendChild(sessionidDiv);

			var timerDiv = document.createElement("div");
			timerDiv.id = "timerDiv";
			wrapperDiv.appendChild(timerDiv);

			var timerInput = document.createElement("input");
			timerInput.id = "timerInput";
			timerInput.placeholder = "Set Time";
			timerDiv.appendChild(timerInput);

			var timerStartButton = document.createElement("button");
			timerStartButton.id = "timerStartButton";
			timerStartButton.innerHTML = "Start";
			timerDiv.appendChild(timerStartButton);

			var overrideButtonDiv = document.createElement("div");
			overrideButtonDiv.id = "overrideButtonDiv";
			timerDiv.appendChild(overrideButtonDiv);

			var answerDisplayDiv = document.createElement("div");
			answerDisplayDiv.id = "answerDisplayDiv";
			timerDiv.appendChild(answerDisplayDiv);
			var currentTimer = false;



			// when the start button is clicked
			timerStartButton.onclick = function () {
				if (currentTimer) {
					timerInput.value = "";
					alert("please wait or override");
				} else {
					var override = false;
					var timerInputValue = timerInput.value;
					timerInput.value = "";

					// add override button
					overrideButtonDiv.innerHTML = "";
					var overrideButton = document.createElement("button");
					overrideButton.id = "overrideButton";
					overrideButton.innerHTML = "End Question";
					overrideButtonDiv.appendChild(overrideButton);

					// var timerDiv = document.querySelector("#timerDiv");
					var countdownExample = document.querySelector("#countdownExample");
					if (countdownExample)
						countdownExample.parentNode.removeChild(countdownExample);
					answerDisplayDiv.innerHTML = "";

					var html = '<div id="countdownExample">' +
						'<div class="values"></div>' +
						'</div>';
					timerDiv.insertAdjacentHTML("beforeend", html);

					overrideButton.onclick = function () {
						override = true;
						currentTimer = false;
						overrideButtonDiv.innerHTML = "";
						timer.stop();
						var counterDiv = document.querySelector("#countdownExample");
						counterDiv.innerHTML = "";
						fetch("https://klikr.herokuapp.com/getAnswers").then(function (response) {
							// this will convert it to json data
							response.json().then(function (records) {
								// display records here
								console.log(records);


								var answerHTML = '<div id = "answerDisplay">' +
									'<div class = "answerValues">' + "A: " + records.A + '<br>' + '</div>' +
									'<div class = "answerValues">' + "B: " + records.B + '<br>' + '</div>' +
									'<div class = "answerValues">' + "C: " + records.C + '<br>' + '</div>' +
									'<div class = "answerValues">' + "D: " + records.D + '<br>' + '</div>' +
									'</div>';
								answerDisplayDiv.insertAdjacentHTML("beforeend", answerHTML);

							})
						})
						// end of fetch
					}

					var timer = new Timer();
					currentTimer = true;
					timer.start({
						countdown: true,
						startValues: {
							seconds: parseInt(timerInputValue)
						}
					});
					$('#countdownExample .values').html(timer.getTimeValues().toString());
					timer.addEventListener('secondsUpdated', function (e) {
						$('#countdownExample .values').html(timer.getTimeValues().toString());
					});
					timer.addEventListener('targetAchieved', function (e) {
						// $('countdownExample .values').html("Time is up!!");

						// do fetch to get answers and display them
						if (override == false) {
							fetch("https://klikr.herokuapp.com/getAnswers").then(function (response) {
								// this will convert it to json data
								response.json().then(function (records) {
									// display records here
									console.log(records);
									overrideButtonDiv.innerHTML = "";

									var answerHTML = '<div id = "answerDisplay">' +
										'<div class = "answerValues">' + "A: " + records.A + '<br>' + '</div>' +
										'<div class = "answerValues">' + "B: " + records.B + '<br>' + '</div>' +
										'<div class = "answerValues">' + "C: " + records.C + '<br>' + '</div>' +
										'<div class = "answerValues">' + "D: " + records.D + '<br>' + '</div>' +
										'</div>';
									answerDisplayDiv.insertAdjacentHTML("beforeend", answerHTML);
									currentTimer = false;
								})
							})
							// end of fetch
						}
					});
				}
			}

			// Display the question
			var questionDiv = document.createElement("div");
			questionDiv.setAttribute("id", "questionDiv");
			var currentQuestionHTML = "<div id = 'questionBro'>" +
				'<div id = "currentQuestion">' + question.question + '<br>' + '</div>' +
				'<div class = "answerChoices">' + "A: " + question.choicea + '<br>' + '</div>' +
				'<div class = "answerChoices">' + "B: " + question.choiceb + '<br>' + '</div>' +
				'<div class = "answerChoices">' + "C: " + question.choicec + '<br>' + '</div>' +
				'<div class = "answerChoices">' + "D: " + question.choiced + '<br>' + '</div>' +
				"</div>"
			questionDiv.innerHTML = currentQuestionHTML;
			wrapperDiv.appendChild(questionDiv);
		})
	})
	// end of fetch
}

// THESE ARE REQUEST FUNCTIONS
var createNewAdmin = function (fname, lname, username, password) {
	var data = encodeURI("fname=" + fname + "&lname=" + lname + "&username=" + username + "&password=" + password);
	fetch("https://klikr.herokuapp.com/admin", {
		method: "POST",
		body: data,
		headers: {
			"Content-Type": "application/x-www-form-urlencoded"
		}
	}).then(function (response) {
		return response.text().then(text => {
			return {
				data: text,
				status: response.status
			}
		})
	}).then(function (response) {
		if (response.status == 201) {
			console.log(response.data);
			startAccountOptionsPage();
			console.log("successfullly added new Admin");
		} else if (response.status == 422) {
			startAccountOptionsPage();
			alert("That username is already registered");
		} else {
			// print error here
			alert(JSON.parse(response.data));
		}
	});
}

var deleteAdminFromDB = function (adminID) {
	fetch("https://klikr.herokuapp.com/admin/" + adminID, {
		method: "DELETE"
	}).then(function (response) {
		if (response.status == 200) {
			startAccountOptionsPage();
			console.log("admin Deleted");
			console.log(response.status);
		} else {
			// print error here
			alert("error with delete");
		}
	});
}

var createNewTopic = function (topic) {
	var data = encodeURI("question=" + topic);
	fetch("https://klikr.herokuapp.com/topics", {
		method: "POST",
		body: data,
		headers: {
			"Content-Type": "application/x-www-form-urlencoded"
		}
	}).then(function (response) {
		return response.text().then(text => {
			return {
				data: text,
				status: response.status
			}
		})
	}).then(function (response) {
		if (response.status == 201) {
			console.log(response.data);
			startAdminPage();
			console.log("successfullly added new question");
		} else {
			// print error here
			alert("error making question");
		}
	});
}
var createNewQuestion = function (topicId, question, choice1, choice2, choice3, choice4) {
	var data = encodeURI("question=" + question + "&topic=" + topicId + "&choiceA=" + choice1 + "&choiceB=" + choice2 + "&choiceC=" + choice3 + "&choiceD=" + choice4);
	fetch("https://klikr.herokuapp.com/question", {
		method: "POST",
		body: data,
		headers: {
			"Content-Type": "application/x-www-form-urlencoded"
		}
	}).then(function (response) {
		return response.text().then(text => {
			return {
				data: text,
				status: response.status
			}
		})
	}).then(function (response) {
		if (response.status == 201) {
			console.log(response.data);
			startAdminPage();
			console.log("successfullly added new question");
		} else {
			// print error here
			alert("error making question");
		}
	});
}
var deleteTopicFromDB = function (questionID) {
	deleteQuestionFromDB();
	fetch("https://klikr.herokuapp.com/topics/" + questionID, {
		method: "DELETE"
	}).then(function (response) {
		if (response.status == 200) {
			// refresh page
			startAdminPage();
			// log results
			console.log("question Deleted");
			console.log(response.status);
		} else {
			// print error here
			alert("error with delete");
		}
	});
}

var deleteQuestionFromDB = function (questionID) {
	fetch("https://klikr.herokuapp.com/question/" + questionID, {
		method: "DELETE"
	}).then(function (response) {
		if (response.status == 200) {
			// refresh page
			startAdminPage();
			// log results
			console.log("question Deleted");
			console.log(response.status);
		} else {
			// print error here
			alert("error with delete");
		}
	});
}

var setCurrentQuestion = function (questionId) {
	fetch("https://klikr.herokuapp.com/setQuestion/" + questionId).then(function (response) {
		// this will convert it to json data
		response.json().then(function (records) {
			projectCurrentQuestion(records);

		})
	})
}

var sendAnswerToServer = function (answer) {
	var data = encodeURI("answer=" + answer);
	fetch("https://klikr.herokuapp.com/answer", {
		method: "POST",
		body: data,
		headers: {
			"Content-Type": "application/x-www-form-urlencoded"
		}
	}).then(function (response) {
		return response.text().then(text => {
			return {
				data: text,
				status: response.status
			}
		})
	}).then(function (response) {
		if (response.status == 201) {
			console.log(response.data);
			console.log("successfullly sumbitted answer");
		} else {
			// print error here
			alert(JSON.parse(response.data));
		}
	});
}

startLoginPage();