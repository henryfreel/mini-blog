$(function() {

	// Tooltips
	  $('[data-toggle="tooltip"]').tooltip()

	// Template
	var postTemplate = _.template($("#post-template").html())

	// Post Variables
	var $newPostForm = $("#new-post-form");

	var $postName = $("#post-name");
	var $postBody = $("#post-body");
	var $publishPost = $("#publish-post");

	var $postsContainer = $("#posts-container")

	// Count Variables
	var $postCount = $(".post-count p")

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

	// Posts array - ask about why this has to be outside of the constructor
	Post.all = [];

	// Save to array
	Post.prototype.save = function() {
		Post.all.unshift(this);
	}

	//Render on page
	Post.prototype.render = function() {
		var $post = $(postTemplate(this));
		$postsContainer.prepend($post);

		//add index
		var index = Post.all.indexOf(this);
		$post.attr("data-index", index);
	}

	// Test Posts
	console.log("-> Array has *" + Post.all.length + "* spots");
	var post1 = new Post("henry", "1: Do you like green eggs and ham? I do not like them, Sam-I-am. I do not like green eggs and ham! Would you like them here or there? I would not like them here or there. I would not like them anywhere. I do so like green eggs and ham! Thank you! Thank you, Sam-I-am")
	post1.save();

	var post2 = new Post("Samuel", "2: here is some sample text for another post")
	post2.save();

	var post3 = new Post("Izzy", "3: here is some sample text for yet another post")
	post3.save();

	// Render Array on page
	Post.all.reverse();
	_.each(Post.all, function(post, index) {
		post.render();
	})

	// Update post count
	$postCount.html(Post.all.length + " posts")

	// On CLICK not SUBMIT - ask why this isn't working as a submit listener
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

		// Update post count
		$postCount.html(Post.all.length + " posts")

	});

});











