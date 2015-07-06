$(function() {

	// Tooltips
	$('[data-toggle="tooltip"]').tooltip()

	// Template
	var postTemplate = _.template($("#post-template").html())

	// Post Variables
	var $newPostForm = $("#new-post-form");
	var $newPostModal = $("#add-post-modal");

	var $postName = $("#post-name");
	var $postBody = $("#post-body");
	var $publishPost = $("#publish-post");

	var $postsContainer = $("#posts-container");

	// Comment Variables
	var $commentInput = $(".comment-input");
	var $commentSubmit = $(".comment-submit");
	var $commentForm = $(".comment-form")
	var $commentsContainer = $(".comments-container")

	// Count Variables
	var $postCount = $(".post-count p")

	// New Post Button
	var $newPostButton = $("#new-post-button");

	// Contrsuctor
	var Post = function(name, body) {
		this.name = name;
		this.body = body;
		this.comments = [];
	}

	// Posts array - ask about why this has to be outside of the constructor and why not just use a reqular array
	Post.all = [];

	// Save to array
	Post.prototype.savePost = function() {
		Post.all.unshift(this);
	};

	//Render on page
	Post.prototype.render = function() {
		var $post = $(postTemplate(this));
		$postsContainer.prepend($post);

		//add index
		var index = Post.all.indexOf(this);
		$post.attr("data-index", index);
	};

	// Test Posts
	var post1 = new Post("henry", "1: Do you like green eggs and ham? I do not like them, Sam-I-am. I do not like green eggs and ham! Would you like them here or there? I would not like them here or there. I would not like them anywhere. I do so like green eggs and ham! Thank you! Thank you, Sam-I-am")
	post1.savePost();

	var post2 = new Post("Samuel", "2: here is some sample text for another post")
	post2.savePost();

	var post3 = new Post("Izzy", "3: here is some sample text for yet another post")
	post3.savePost();

	// Render Array on page
	Post.all.reverse();
	_.each(Post.all, function(post, index) {
		post.render();
	})

	// Update post count
	$postCount.html(Post.all.length + " posts")

	// on modal SHOW
	$newPostModal.on('shown.bs.modal', function () {
	  $postName.focus();
	})

	// on modal HIDE
	$newPostModal.on('hidden.bs.modal', function(){
	    $(this).find('form')[0].reset();
	});

	// On CLICK not SUBMIT - ask why this isn't working as a submit listener
	$publishPost.on("click", function(event) {
		event.preventDefault();

		// Temporary variables
		var postName = $postName.val();
		var postBody = $postBody.val();
		var postData = new Post(postName, postBody);

		if (postName != "" && postBody != "") {
			$newPostModal.modal('hide')

			// save to Post.all array
			postData.savePost();

			//Render on page
			postData.render();

			// Update post count
			$postCount.html(Post.all.length + " posts")
		} else {
			$("#post-name-group").addClass("has-error");
			$("#post-body-group").addClass("has-error");

			$postBody.placeholder = "here is some shit";

			console.log("you gotta type something")
		}

	});

	// Comment Submit
	$postsContainer.on("submit", $commentSubmit, function(event) {
		event.preventDefault();

		// var comment = $commentInput.val();

		var $commentsConatiner = $(this).children(".comments-container");
		console.log($commentsConatiner);

		var $comment = $(this).children(".comment-input");

		console.log($comment);

	});


});




















