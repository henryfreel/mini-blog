$(function() {

	// Tooltips
	$('[data-toggle="tooltip"]').tooltip()

	// Post Template
	var postTemplate = _.template($("#post-template").html())

	// Comment Template
	var commentTemplate = _.template($("#comment-template").html())

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
		this.date;
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

	var Comment = function(body) {
		this.body = "has no body yet";
		this.date;
	}

	// Test Posts
	var post1 = new Post("henry", "1: Do you like green eggs and ham? I do not like them");
	post1.comments = [{body: "This a really nice post", date: "there is no date yet"}];
	post1.date = "0/0/00"
	post1.savePost();

	var post2 = new Post("Samuel", "2: here is some sample text for another post");
	post2.comments = [{body: "This a really nice post", date: "there is no date yet"}];
	post2.date = "0/0/00"
	post2.savePost();

	var post3 = new Post("Izzy", "3: here is some sample text for yet another post")
	post3.comments = [{body: "This a really nice post", date: "there is no date yet"}];
	post3.date = "0/0/00"
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
	$newPostForm.on("submit", function(event) {
		event.preventDefault();

		// Temporary variables
		var postName = $postName.val();
		var postBody = $postBody.val();
		var postData = new Post(postName, postBody);

		// add date
		var date = new Date();
		postData.date = date.toLocaleString();

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
	$postsContainer.on("submit", ".comment-form", function(event) {
		event.preventDefault();

		// find input
		var $commentInput = $(this).find(".comment-input");

		// grab value from input
		var comment = $commentInput.val();

		// generate new Comment instance
		var newComment = new Comment();
		newComment.body = comment;
		console.log(newComment)

		// add date
		var date = new Date();
		newComment.date = date.toLocaleString();

		// reset input
		$commentInput.val("");

		// find parent of form, the post
		var $post = $(this).parent()[0];

		//find <ul> (child) of post
		var $comments = $("> .comments-container", $post);

		// append to <ul>
		// $comments.append("<li class='list-group-item'>" + comment + "</li>");
		// append using the template
		$comments.append(commentTemplate(newComment));

	});


});




















