
var AppRouter = Backbone.Router.extend({
    initialize: function () {

    },
    routes: {
        '': 'list',
        'user/:id': 'userDetails'
    },
    list: function () {
        this.before();
    },
    userDetails: function (id) {

        debugger;

        this.before(function () {
            var user = app.userList.get(id);
            app.showView('#content', new WineView({ model: user }));
        });
    },
    before: function (callback) {
        if (this.userList) {
            if (callback) callback();
        }
        else {
            this.userList = new UsersCollection();
            this.userList.fetch({
                success: function () {
                    var userView = new UserListView({
                        model: app.userList
                    });

                    $('#userapp').html(userView.render().el);
                    if (callback) callback();
                }
            });
        }
    }
});


var app = new AppRouter();
Backbone.history.start();
