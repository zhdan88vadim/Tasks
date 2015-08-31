var User = Backbone.Model.extend({
    defaults: {
        id: 0,
        name: '',
        email: '',
        phone: '',
        password: '',
        image: null
    },
    initialize: function () {
        console.log('The model has been initialized.');
        this.on('invalid', function (model, error) {
            console.log(error);
        });
    },
    validate: function (attributes) {
        if (attributes.id === undefined) {
            return 'The field must have a value!';
        }
    }
});





//user.set('id',undefined, {validate: true})
//_.templateSettings = { interpolate : /\{\{(.+?)\}\}/g };