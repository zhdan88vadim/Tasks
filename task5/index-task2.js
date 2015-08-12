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


/* User */

function User(name, email, phone, password){
	this.name = name;
	this.email = email;
	this.phone = phone;
	this.password = password;
}
User.prototype = {
	constructor: User,
	toString: function() {
		return "User Name: " + this.name + "; User Email: " + this.email;
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
	}
}


/* UserService */

function UserService() {

}
UserService.prototype = {
	constructor: UserService,
	loadUserByEmail: function(email) {
		var user = localStorage.getItem(email);
		return JSON.parse(user);	
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
	checkUser: function(email, password) {
		if(!(email && password)) return false;
		var user = this.loadUserByEmail(email);
		if (user == null) return false;
		return (user.password === password);
	},
	__isExistUser: function(email) {
		return (this.loadUserByEmail(email) != null)
	}
}

var userManager = new UserManager(new UserService());

$(function() {

    $("#btn-save-user").button()
    .click(function(event) {
    	event.preventDefault();

    	var form = $('#create-user-form');
    	var name = form.find('input[name="name"]').val();
		var email = form.find('input[name="email"]').val();
		var phone = form.find('input[name="phone"]').val();
		var password = form.find('input[name="password"]').val();    	

		var user = new User(name, email, phone, password);
		var operationResult = userManager.saveUser(user);
		console.log('The result of the operation: ' + operationResult);
    });

    $("#btn-sign-in").button()
    .click(function(event) {
    	event.preventDefault();

    	var form = $('#login-user-form');
		var email = form.find('input[name="email"]').val();
		var password = form.find('input[name="password"]').val();    	

		var operationResult = userManager.checkUser(email, password);
		console.log('The result of the operation: ' + operationResult);

		if (operationResult === true) {
			window.location.replace('index-task2_profile.html?email=' + email);
		}
    });
});

function loadUserProfile(email) {
	var user = userManager.loadUserByEmail(email);
	if (!user) {
		console.log('Error! User with the email:' + email + ' was not found!');
		return false;
	} 

	var form = $('#profile-user-form');
	form.find('input[name="name"]').val(user.name);
	form.find('input[name="email"]').val(user.email);
	form.find('input[name="phone"]').val(user.phone);
	form.find('input[name="password"]').val(user.password);  
}