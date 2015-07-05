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

	//Render on page
	Post.prototype.render = function() {
		var $post = $(postTemplate(this));
		$postsContainer.append($post);

		//add index
		var index = Post.all.indexOf(this);
		$post.attr("data-index", index);
	}

	// Test Posts
	console.log("-> Array has *" + Post.all.length + "* spots");
	var post1 = new Post("henry", "Do you like green eggs and ham? I do not like them, Sam-I-am. I do not like green eggs and ham! Would you like them here or there? I would not like them here or there. I would not like them anywhere. I do so like green eggs and ham! Thank you! Thank you, Sam-I-am")
	post1.save();

	var post2 = new Post("Samuel", "here is some sample text for another post")
	post2.save();

	var post3 = new Post("Izzy", "here is some sample text for yet another post")
	post3.save();

	// Render Array on page
	_.each(Post.all, function(post, index) {
		post.render();
	})

	// On CLICK not SUBMIT
	$publishPost.on("click", function(event) {
		event.preventDefault();

		// Temporary variables
		var postName = $postName.val();
		var postBody = $postBody.val();
		var postData = new Post(postName, postBody);

		// save to Post.all array
		postData.save();

		//Render on page
		postData.render();


	});

});











