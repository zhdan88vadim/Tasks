var UserListView = Backbone.View.extend({
    //el: $('#userapp'),  ==> Presentation will be applied to the tag.
    tagName: 'tbody',
    initialize: function (options) {
        var self = this;
        this.options = options || {};

        this.model.bind("reset", this.render, this);

        // Allows you to add a single entry.

        //var self = this;
        //this.model.bind("add", function (user) {
        //    $(self.el).append(new UserListItemView({ model: user }).render().el);
        //});

        //----------------------------------------------------------

        // В таком случае нужно перегенеривать целую коллекцию.
        //this.collection.fetch({
        //    success: function () {
        //        self.render();
        //    }
        //});
    },
    render: function () {

        _.each(this.model.models, function (user) {
            $(this.el).append(new UserListItemView({ model: user }).render().el);
        }, this);


        // For user list.
        //this.$el.html(this.template({ users: this.collection.toJSON() }));

        return this;
    }
});

var UserListItemView = Backbone.View.extend({
    tagName: 'tr',
    template: _.template($('#user-template').html()),
    initialize: function () {
        this.model.bind("change", this.render, this);

    },
    render: function (eventName) {
        $(this.el).html(this.template(this.model.toJSON()));
        return this;
    },
    events: {
        'click .btn-edit-user': 'edit',
        'click .btn-view-user': 'view',
        'click .btn-delete-user': 'delete'
    },
    edit: function () {
        console.log('edit');
        app.navigate("/user/" + this.model.id, true);
    },
    view: function () {
        console.log('view');
        var currModel = this.model;
        console.log(currModel);
    },
    'delete': function () {
        console.log('delete');
        var currModel = this.model;
        console.log(currModel);
    }

});
