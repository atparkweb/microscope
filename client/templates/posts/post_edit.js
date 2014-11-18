Template.postEdit.events({
    'submit form': function (e) {
        e.preventDefault();

        var currentPostId = this._id;

        var postProperties = {
            url: $(e.target).find('[name=url]').val(),
            title: $(e.target).find('[name=title]').val()
        };

        // Keep track old URL in case edit fails
        var previousUrl = this.url;

        Meteor.call('postUpdate', currentPostId, postProperties, function (error, result) {
            if (error) {
                return throwError(error.reason);
            }

            if (result.postExists) {

                // Reset URL value to the original post URL
                $(e.target).find('[name=url]').val(previousUrl);

                throwError('This link has already been posted');
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
