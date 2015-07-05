$(function() {

	// Template
	var postTemplate = _.template($("#post-template").html())

	// Post Variables
	var $newPostForm = $("#new-post-form");

	var $postName = $("#post-name");
	var $postBody = $("#post-body");
	var $publishPost = $("#publish-post");

	var $postsContainer = $("#posts-container")

	// Initial Set up
	$postName.prop('required',true);
	$postBody.prop('required',true);

	// New Post Button
	var $newPostButton = $("#new-post-button");

	$newPostButton.on("click", function(event) {
		event.preventDefault();

		console.log("clicked new post");
	})

	// Contrsuctor
	var Post = function(name, body) {
		this.name = name;
		this.body = body;
	}

	// Posts array
	Post.all = [];

	// Save to array
	Post.prototype.save = function() {
		Post.all.push(this);
	}

	// Test Posts
	console.log("-> Array has *" + Post.all.length + "* spots");
	var post1 = new Post("henry", "here is some sample text for a post")
	post1.save();
	console.log(post1)

	var post2 = new Post("Samuel", "here is some sample text for a anthoer post")
	post2.save();
	console.log(post2)

	console.log("now array has *" + Post.all.length + "* items");

	// On CLICK not SUBMIT
	$publishPost.on("click", function(event) {
		event.preventDefault();

		// Temporary variables
		var postName = $postName.val();
		var postBody = $postBody.val();
		var postData = new Post(postName, postBody);

		// save to Post.all array
		console.log(postData);
		postData.save();
		console.log(Post.all.length);

		$postsContainer.append($(postTemplate(postData)));

	});

});











