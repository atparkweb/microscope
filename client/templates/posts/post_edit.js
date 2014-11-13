Template.postEdit.events({
    'submit form': function (e) {
        e.preventDefault();

        var currentPostId = this._id;

        var postProperties = {
            url: $(e.target).find('[name=url]').val(),
            title: $(e.target).find('[name=title]').val()
        };

        var previousUrl = this.url;

        Meteor.call('postUpdate', currentPostId, postProperties, function (error, result) {
            if (error) {
                return alert(error.reason);
            }

            if (result.postExists) {
                $(e.target).find('[name=url]').val(previousUrl);
                alert('This link has already been posted');
            }
        });
    },

    'click .delete': function (e) {
        e.preventDefault();

        if (confirm('Delete this post?')) {
            var currentPostId = this._id;
            posts.remove(currentPostId);
            Router.go('postsList');
        }
    }
});
