var UserView = Backbone.View.extend({
    el: $('#userapp'),
    template: _.template('templates/users.html'),
    events: {
        'click': 'edit'
    },
    initialize: function (options) {
        this.options = options || {};
    },
    render: function () {
        this.$el.html(this.template(this.model.toJSON()));
        return this;
    },
    edit: function () {
        console.log('user edit');
    }


});