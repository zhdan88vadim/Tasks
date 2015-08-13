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

function User(id, name, email, phone, password, image) {
    this.id = id;
	this.name = name;
	this.email = email;
	this.phone = phone;
	this.password = password;
	this.image = image;
}
/* Static functions. */
User.revive = function(data){
    return new User(data.id, data.name, data.email, data.phone, data.password, data.image);
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
			"password": this.password,
            "image": this.image
        }
	},
	toTableRow: function(){
	    return "<tr><td>" + this.name
        + "</td><td>" + this.id
		+ "</td><td>" + this.email 
		+ "</td><td>" + this.phone 
		+ "</td><td>" + this.password
		+ "</td><td>" + this.image + "</td></tr>";
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
	updateUser: function (user, callback) {
	    this.userService.updateUser(user, callback);
	},
	deleteUser: function (user, callback) {
	    this.userService.deleteUser(user, callback);
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
            var user = new User(item.ID, item.Name, item.Email, item.Phone, item.Password, item.Image);
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
            success: function (result) { alert(result) },
            error: function () {
                alert("Error!");
            }
        });
        return true;
    },
    updateUser: function (user, callback) {
        if (!(user.name && user.email && user.password && user.phone)) {
            throw Error("All fields must be filled!");
        }
        var data = new FormData();
        var files = $("#fileUpload").get(0).files;
        if (files.length > 0) {
            data.append("uploadFile", files[0]);
        }
        data.append("ID", user.id);
        data.append("Name", user.name);
        data.append("Email", user.email);
        data.append("Phone", user.phone);
        data.append("Password", user.password);

        $.ajax("/api/user/" + user.id, {
            data: data,
            type: "POST",
            processData: false,
            cache: false,
            contentType: false,
            success: function (result) { callback(); },
            error: function () {
                alert("Error!");
            }
        });
        return true;
    },
    deleteUser: function (user, callback) {
        $.ajax("/api/user/" + user.id, {
            type: "DELETE",
            processData: false,
            cache: false,
            contentType: false,
            success: function (result) { callback(); },
            error: function () {
                alert("Error!");
            }
        });
    },
    getUserList: function (callback) {
        $.getJSON("/api/user" + "?time=" + Date.now(), function (allData) {
            var mappedUser = $.map(allData, function (item) { return new User(item.ID, item.Name, item.Email, item.Phone, item.Password, item.Image) });
            callback(mappedUser);
        }).fail(function (jqXHR, textStatus, errorThrown) { alert("Error!"); });
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
		height: 680,
		width: 400,
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
		height: 620,
		width: 400,
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
		height:250,
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

function initUploadComponent(target) {

    cleanImageHolder();

    function cleanImageHolder() {
        $(".image-holder").empty();
    }

    $("#fileUpload").off('change').change(function () {
        var countFiles = $(this)[0].files.length;
        if (countFiles == 0) return false;

        if (typeof (FileReader) != "undefined") {

            var image_holder = target.find(".image-holder");
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
		/* Fill data from Storage. */
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
		initUploadComponent($('#edit-user-dialog'));
	};
	self.viewUser = function(user) {
		console.log(user);
		self.user(user);
		viewDialog.dialog("open");
	};
	self.updateUser = function() {
		var user = self.user();
		userManager.updateUser(user, function () {
		    loadUsersFromStorage();
		    self.user(null);
		});
	};
	self.deleteUser = function(user) {
		console.log(user);
		var deleteDialog = initDeleteDialog(function(){
		    userManager.deleteUser(user, function () {
		        self.usersList.remove(user);
		    });
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