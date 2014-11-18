Posts = new Mongo.Collection('posts');

var findPostByUrl = function (url) {
    return Posts.findOne({url: url});
};

Posts.allow({
    remove: function (userId, post) {
        return ownsDocument(userId, post);
    }
});

Meteor.methods({
    postInsert: function (postAttributes) {
        check(Meteor.userId(), String);

        check(postAttributes, {
            title: String,
            url: String
        });

        var postWithSameLink = findPostByUrl(postAttributes.url)

        if (postWithSameLink) {
            return {
                postExists: true,
                _id:postWithSameLink._id
            };
        }

        var user = Meteor.user();

        var post = _.extend(postAttributes, {
            userId: user._id,
            author: user.username,
            submitted: new Date()
        });

        var postId = Posts.insert(post);

        return {
            _id: postId
        };
    },

    postUpdate: function (postId, postAttributes) {
        check(Meteor.userId(), String);

        check(postAttributes, {
            title: String,
            url: String
        });

        var postWithSameLink = findPostByUrl(postAttributes.url);

        if (postWithSameLink) {
            return {
                postExists: true,
                _id: postWithSameLink._id
            };
        }

        if (ownsDocument(Meteor.userId, postAttributes)) {
            Posts.update(postId, {$set: postAttributes}, function (error) {
                if (error) {
                    return error;
                } else {
                    return {
                        _id: postId
                    };
                }
            });
        }
    }
});
