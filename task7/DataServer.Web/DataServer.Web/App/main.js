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

function User(id, name, email, phone, password) {
    this.id = id;
	this.name = name;
	this.email = email;
	this.phone = phone;
	this.password = password;
}
/* Static functions. */
User.revive = function(data){
    return new User(data.id, data.name, data.email, data.phone, data.password);
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
		    "id": this.id,
			"name": this.name,
			"email": this.email,
			"phone": this.phone,
			"password": this.password
        }
	},
	toTableRow: function(){
	    return "<tr><td>" + this.name
        + "</td><td>" + this.id
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
	loadUserById: function (id, callback) {
	    var user = this.userService.loadUserById(id, callback);
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
	getUserList: function (callback) {
	    return this.userService.getUserList(callback);
	}
}


/* UserServerService */

function UserServerService() {

}
UserServerService.prototype = {
    constructor: UserServerService,
    loadUserById: function (id, callback) {
        $.getJSON("/api/user/" + id + "?time=" + Date.now(), function (item) {
            var user = new User(item.ID, item.Name, item.Email, item.Phone, item.Password);
            callback(user);
        });
    },
    saveUser: function (user) {
        if (!(user.name && user.email && user.password && user.phone)) {
            throw Error("All fields must be filled!");
        }
        $.ajax("/api/user/" + user.id, {
            data: JSON.stringify(user),
            type: "POST", contentType: "application/json",
            success: function (result) { alert(result) }
        });
        return true;
    },
    updateUser: function (user) {
        if (!(user.name && user.email && user.password && user.phone)) {
            throw Error("All fields must be filled!");
        }
        $.ajax("/api/user/" + user.id, {
            data: JSON.stringify(user),
            type: "POST", contentType: "application/json",
            success: function (result) {}
        });
        return true;
    },
    deleteUser: function (email) {
        /* Always return undefined. */
        localStorage.removeItem(email);
    },
    getUserList: function (callback) {
        $.getJSON("/api/user" + "?time=" + Date.now(), function (allData) {
            var mappedUser = $.map(allData, function (item) { return new User(item.ID, item.Name, item.Email, item.Phone, item.Password) });
            callback(mappedUser);
        });
    }
}

var userManager = new UserManager(new UserServerService());


/* For testing */

function fillTestData(){
	for (var i = 0; i <= 90; i++) {
		userManager.saveUser(new User("User: " + i, 
			"User_" + i + "@gmail.com", 
			"8-088-37" + i, 
			"user" + i));
	};
}

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

function initUploadComponent() {
    $("#fileUpload").off('change').change(function () {
        var countFiles = $(this)[0].files.length;
        if (countFiles == 0) return false;

        if (typeof (FileReader) != "undefined") {

            var image_holder = $("#image-holder");
            image_holder.empty();

            var reader = new FileReader();
            reader.onload = function (e) {
                $("<img />", {
                    "src": e.target.result,
                    "class": "thumb-image"
                }).appendTo(image_holder);

            }
            image_holder.show();
            reader.readAsDataURL($(this)[0].files[0]);
        } else {
            alert("This browser does not support FileReader.");
        }
    });
}

function UserViewModel() {
	
	function loadUsersFromStorage() {
		/* Fill data from Local Storage. */
	    var users = userManager.getUserList(function (items) {
	        self.usersList(items);
	    });
	}

	var viewDialog = initViewDialog();
	var editDialog = initEditDialog(function() {
		self.updateUser(); 
	});

	var self = this;
	self.usersList = ko.observableArray();
	self.user = ko.observable();

	loadUsersFromStorage();

	self.editUser = function (user) {
		console.log(user);
		self.user(user);
		editDialog.dialog("open");
		initUploadComponent();
	};
	self.viewUser = function(user) {
		console.log(user);
		self.user(user);
		viewDialog.dialog("open");
		initUploadComponent();
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

	self.themes = [{"name": "default", "url": "default.css"},
	 {"name": "dark", "url": "dark.css"},
	 {"name": "light", "url": "light.css"}];

	self.chosenTheme = ko.observable(self.themes[0]);
	self.selectTheme = function(theme){
		self.chosenTheme(theme);
	};
}

var viewModel = new UserViewModel();
ko.applyBindings(viewModel);