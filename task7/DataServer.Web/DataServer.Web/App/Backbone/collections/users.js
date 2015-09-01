var UsersCollection = Backbone.Collection.extend({
    model: User,
    url: '/api/user',
    parse: function (data) {
        items = [];
        _.each(data, function (item) {
            var newItem = new User(
                {
                    id: item.ID,
                    email: item.Email,
                    name: item.Name,
                    phone: item.Phone,
                    password: item.Password,
                    image: item.Image
                });

            items.push(newItem);
        });
        return items;
    }
});