var QueryString = function () {
  // This function is anonymous, is executed immediately and 
  // the return value is assigned to QueryString!
  var query_string = {};
  var query = window.location.search.substring(1);
  var vars = query.split("&");
  for (var i=0;i<vars.length;i++) {
    var pair = vars[i].split("=");
        // If first entry with this name
    if (typeof query_string[pair[0]] === "undefined") {
      query_string[pair[0]] = decodeURIComponent(pair[1]);
        // If second entry with this name
    } else if (typeof query_string[pair[0]] === "string") {
      var arr = [ query_string[pair[0]],decodeURIComponent(pair[1]) ];
      query_string[pair[0]] = arr;
        // If third or later entry with this name
    } else {
      query_string[pair[0]].push(decodeURIComponent(pair[1]));
    }
  } 
    return query_string;
}();

var Types = {};
Types.User = User;

/* User */

function User(name, email, phone, password){
	this.name = name;
	this.email = email;
	this.phone = phone;
	this.password = password;
}
/* Static functions. */
User.revive = function(data){
	return new User(data.name, data.email, data.phone, data.password);
};
/* Dynamic functions. */
User.prototype = {
	constructor: User,
	toString: function(){
		return "User Name: " + this.name + "; User Email: " + this.email;
	},
	toJSON: function() {
		return {
			"__type": "User",
			"name": this.name,
			"email": this.email,
			"phone": this.phone,
			"password": this.password
		}
	},
	toTableRow: function(){
		return "<tr><td>" + this.name 
		+ "</td><td>" + this.email 
		+ "</td><td>" + this.phone 
		+ "</td><td>" + this.password + "</td></tr>";
	}
}


/* UserManager */

function UserManager(userService) {
	this.userService = userService;
}
UserManager.prototype = {
	constructor: UserManager,
	loadUserByEmail: function(email) {
		var user = this.userService.loadUserByEmail(email);		
		return user;	
	},
	checkUser: function(email, password) {
		return this.userService.checkUser(email, password);
	},
	saveUser: function(user) {
		try {
			this.userService.saveUser(user);
			return "Operation completed successfully!"
		} catch (error) {
			return error.message;
		}
	},
	updateUser: function(user) {
		this.userService.updateUser(user);
	},
	deleteUser: function(email) {
		this.userService.deleteUser(email);	
	},
	getUserList: function() {
		return this.userService.getUserList();
	}
}


/* UserService */

function UserService() {

}
UserService.prototype = {
	constructor: UserService,
	loadUserByEmail: function(email) {
		var userJSONString = localStorage.getItem(email);
		if(userJSONString === null) return null;
		return JSON.parse(userJSONString, function(key, value) {
			return key === '' && value.hasOwnProperty('__type')
			? Types[value.__type].revive(value) : this[key];
		});	
	},
	saveUser: function(user) {
		if(!(user.name && user.email && user.password && user.phone)) {
			throw Error("All fields must be filled!");
		}
		if(this.__isExistUser(user.email)) {
			throw Error("Error saving data! User with this email already exists!");
		}
		localStorage.setItem(user.email, JSON.stringify(user));
		return true;
	},
	updateUser: function(user) {
		if(!this.__isExistUser(user.email)) {
			throw Error("Error saving data! User not found!");
		}
		localStorage.setItem(user.email, JSON.stringify(user));
	},
	deleteUser: function(email) {
		/* Always return undefined. */
		localStorage.removeItem(email);	
	},
	checkUser: function(email, password) {
		if(!(email && password)) return false;
		var user = this.loadUserByEmail(email);
		if (user == null) return false;
		return (user.password === password);
	},
	__isExistUser: function(email) {
		return (this.loadUserByEmail(email) != null)
	},
	getUserList: function() {
		var userArray = [];
		for (var key in localStorage){
			var user = this.loadUserByEmail(key);
			userArray.push(user);
		}
		return userArray;
	}
}

var userManager = new UserManager(new UserService());


/* For testing */

function fillTestData(){
	for (var i = 0; i <= 90; i++) {
		userManager.saveUser(new User("User: " + i, 
			"User_" + i + "@gmail.com", 
			"8-088-37" + i, 
			"user" + i));
	};
}



// $(function() {

//     $("#btn-save-user").button()
//     .click(function(event) {
//     	event.preventDefault();

//     	var form = $('#create-user-form');
//     	var name = form.find('input[name="name"]').val();
// 		var email = form.find('input[name="email"]').val();
// 		var phone = form.find('input[name="phone"]').val();
// 		var password = form.find('input[name="password"]').val();    	

// 		var user = new User(name, email, phone, password);
// 		var operationResult = userManager.saveUser(user);
// 		console.log('The result of the operation: ' + operationResult);
//     });

//     $("#btn-sign-in").button()
//     .click(function(event) {
//     	event.preventDefault();

//     	var form = $('#login-user-form');
// 		var email = form.find('input[name="email"]').val();
// 		var password = form.find('input[name="password"]').val();    	

// 		var operationResult = userManager.checkUser(email, password);
// 		console.log('The result of the operation: ' + operationResult);

// 		if (operationResult === true) {
// 			window.location.replace('index-task3_profile.html?email=' + email);
// 		}
//     });

//     $('#login-link').click(function(){
//     	event.preventDefault();

//     	var dialog = $( "#login-dialog-form" ).dialog({
// 	      autoOpen: false,
// 	      height: 350,
// 	      width: 350,
// 	      modal: true,
// 	      buttons: {
// 	        "Sign In": function() { 
// 	        	SignInFromDialog(dialog) 
// 	        },
// 	        Cancel: function() {
// 	          dialog.dialog("close");
// 	        }
// 	      },
// 	      close: function() {
// 	        //form[0].reset();
// 	        //allFields.removeClass( "ui-state-error" );
// 	      }
// 	    });

//     	dialog.dialog("open");
//     });
// });

// function SignInFromDialog(dialog){
// 	var form = $('#login-dialog-form');
// 	var email = form.find('input[name="email"]').val();
// 	var password = form.find('input[name="password"]').val();    	

// 	var operationResult = userManager.checkUser(email, password);
// 	if (operationResult === true) {
// 		dialog.dialog("close");
// 		window.location.replace('index-task3_profile.html?email=' + email);
// 	}
// 	return false;
// }
// /* TODO - Convert string to ecnode string. */
// function loadUserProfile(email){
// 	var user = userManager.loadUserByEmail(email);
// 	if (!user) {
// 		console.log('Error! User with the email:' + email + ' was not found!');
// 		return false;
// 	} 

// 	var form = $('#profile-user-form');
// 	form.find('input[name="name"]').val(user.name);
// 	form.find('input[name="email"]').val(user.email);
// 	form.find('input[name="phone"]').val(user.phone);
// 	form.find('input[name="password"]').val(user.password);  
// }

// function loadUserList(){
// 	var table = $('#user-list table');

// 	userManager.getUserList().forEach(function(item) {
// 		var tr = item.toTableRow();
// 		table.find('tbody:last-child').append(tr);
// 	});
// }




function initEditDialog(editFunction) {
	var dialog = $("#edit-user-dialog").dialog({
		autoOpen: false,
		height: 400,
		width: 350,
		modal: true,
		buttons: {
			"Save": function(){ 
				editFunction();
				dialog.dialog("close");
			},
			Cancel: function(){
				dialog.dialog("close");
			}
		},
		close: function() {
		//form[0].reset();
		//allFields.removeClass( "ui-state-error" );
		}
	});
	return dialog;	
}

function initViewDialog() {
	var dialog = $("#view-user-dialog").dialog({
		autoOpen: false,
		height: 400,
		width: 350,
		modal: true,
		buttons: {
			Cancel: function(){
				dialog.dialog("close");
			}
		},
		close: function() {
		}
	});
	return dialog;
}

function initDeleteDialog(deleteFunction){
	var dialog = $("#delete-user-dialog").dialog({
		resizable: false,
		height:200,
		modal: true,
		buttons: {
		"Delete user": function() {
			deleteFunction();
			$(this).dialog("close");
		},
		Cancel: function() {
				$(this).dialog("close");
			}
		}
    });
    return dialog;
}

function UserViewModel() {
	
	function loadUsersFromStorage() {
		/* Fill data from Local Storage. */
		var users = userManager.getUserList();
		self.usersList(users);
	}

	var viewDialog = initViewDialog();
	var editDialog = initEditDialog(function() {
		self.updateUser(); 
	});


	var self = this;
	self.usersList = ko.observableArray();
	self.user = ko.observable();

	loadUsersFromStorage();
	
	self.editUser = function(user) {
		console.log(user);
		self.user(user);
		editDialog.dialog("open");
	};
	self.viewUser = function(user) {
		console.log(user);
		self.user(user);
		viewDialog.dialog("open");
	};
	self.updateUser = function() {
		var user = self.user();
		userManager.updateUser(user);
		loadUsersFromStorage();
		self.user(null);
	};
	self.deleteUser = function(user) {
		console.log(user);
		var deleteDialog = initDeleteDialog(function(){
			userManager.deleteUser(user.email);
			self.usersList.remove(user);
		});
		deleteDialog.dialog("open");
	};
}

ko.applyBindings(new UserViewModel());



// $.getJSON('https://api.flickr.com/services/rest/?&method=flickr.people.getPublicPhotos&api_key=21aa3fc8dec27c7e63d5e76b455f28d8&user_id=115719100@N03&format=json', 
// 	function(data) { console.log(data); });


$.getJSON('https://api.flickr.com/services/rest/?&method=flickr.people.getPublicPhotos&api_key=21aa3fc8dec27c7e63d5e76b455f28d8&user_id=115719100@N03&format=json', 
	function(data) { console.log(data); });