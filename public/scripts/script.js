$(function() {

	// Tooltips
	$('[data-toggle="tooltip"]').tooltip()

	// Post Template
	var postTemplate = _.template($("#post-template").html())

	// Comment Template
	var commentTemplate = _.template($("#comment-template").html())

	// New Post Variables
	var $newPostForm = $("#new-post-form");
	var $newPostModal = $("#add-post-modal");

	var $postName = $("#post-name");
	var $postBody = $("#post-body");
	var $publishPost = $("#publish-post");

	var $postsContainer = $("#posts-container");

	// Edit Post Variables
	var $editPostForm = $("#edit-post-form");
	var $editPostModal = $("#edit-post-modal");

	var $editPostName = $("#edit-post-name");
	var $editPostBody = $("#edit-post-body");

	var postId;

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
		this.id;
		this.name = name;
		this.body = body;
		this.date = "no date yet";
		this.comments = [{comment_body: "no comment yet", comment_date: "no date yet"}];
	}

	// Posts array - ask about why this has to be outside of the constructor and why not just use a reqular array
	// Post.all = [];
	// var posts = [];


	// Save to array
	// Post.prototype.savePost = function() {
		// Post.all.unshift(this);

		// var postName = $postName.val();
		// var postBody = $postBody.val();
		// var postData = new Post(postName, postBody);
		// var postData = {name: postName, body: postBody};

		// $.post('/api/posts', postData, function(data) {
		  // pass phrase object through template and append to view
		  // var $phraseHtml = $(phrasesController.template(data));
		  // $('#phrase-list').append($phraseHtml);
		// });

	// };

	//Render on page
	Post.prototype.render = function() {
		var $post = $(postTemplate(this));
		$postsContainer.prepend($post);

		//add index
		// var index = Post.all.indexOf(this);
		// $post.attr("data-index", index);
	};

	var Comment = function(body) {
		this.body = "has no body yet";
		this.date = "has no date yet";
	}


	// Pre-API Testing

	// Test Posts
	// var post1 = new Post("henry", "1: Do you like green eggs and ham? I do not like them");
	// post1.comments = [{body: "This a really nice post", date: "0/0/00"}];
	// post1.date = "0/0/00"
	// post1.savePost();

	// var post2 = new Post("Samuel", "2: here is some sample text for another post");
	// post2.comments = [{body: "This a really nice post", date: "0/0/00"}];
	// post2.date = "0/0/00"
	// post2.savePost();

	// var post3 = new Post("Izzy", "3: here is some sample text for yet another post")
	// post3.comments = [{body: "This a really nice post", date: "0/0/00"}];
	// post3.date = "0/0/00"
	// post3.savePost();

	// Render Array on page
	// Post.all.reverse();
	// _.each(Post.all, function(post, index) {
	// 	post.render();
	// })

	// API, Render on page load
	$.ajax({
		url: "http://localhost:3000/api/posts",
		type: "GET",
		success: function(data) {

			numPosts = data.length;
			// console.log(data);
			// console.log(numPosts);

			// var template = _.template($("#user-template").html());

			// _.each(data, function(user) {
			// 	$(".user-table tbody").append(template(user));
			// });

			// data.reverse();
			_.each(data, function(post) {

				var $post = $(postTemplate(post));
				$postsContainer.prepend($post);

				_.each(post.comments, function(comment) {

					var $comments = $("#post-" + post.id + " > .comments-container", $postsContainer);
					$comments.append(commentTemplate(comment));

				})

			})

			// console.log("--> number of posts")
			// console.log(numPosts);

			// Update post count
			if (numPosts > 1) {
				$postCount.html(numPosts + " posts");
			} else {
				$postCount.html(numPosts + " post");
			}
			

		}
	});

	// on new post modal SHOW
	$newPostModal.on('shown.bs.modal', function () {
	  $postName.focus();
	})

	// on new post modal HIDE
	$newPostModal.on('hidden.bs.modal', function(){
	    $(this).find('form')[0].reset();
	});

	// On SUBMIT of New Post form
	$newPostForm.on("submit", function(event) {
		event.preventDefault();

		// Temporary variables
		var postName = $postName.val();
		var postBody = $postBody.val();
		var postData = {name: postName, body: postBody};
		// var postData = new Post(postName, postBody);

		// add date
		var date = new Date();
		// postData.date = date.toLocaleString();
		postData.date = date.toLocaleString();

		// add comments
		postData.comments = [{comment_body: "no comment yet", comment_date: "no date yet"}];

		if (postName === "") {

			$("#post-name-group").addClass("has-error");

		} else if (postBody === "") {

			$("#post-body-group").addClass("has-error");

		} else {
			$newPostModal.modal("hide");

			// render on client side
			// var $post = $(postTemplate(postData));
			// $postsContainer.prepend($post);

			//add to array
			// posts.unshift($post);

			// // add temp ID
			postData.id = numPosts + 1;

			// render on client side
			var $post = $(postTemplate(postData));
			$postsContainer.prepend($post);

			$.ajax({
				type: "POST",
				url: "http://localhost:3000/api/posts",
				data: postData,
				success: function(data) {
					// add temp ID
					// postData.id = data.id;
				},
				error: function() {
					alert("Error!");
				}
			});

			if (numPosts > 1) {
				$postCount.html((numPosts + 1) + " posts");
			} else {
				$postCount.html((numPosts + 1) + " post");
			}

		} 

	});

	// On click of edit post button
	$postsContainer.on("click", ".edit-post", function(event) {
		event.preventDefault();

		console.log("--> you are going to edit this post!")

		console.log("--> you clicked")
		console.log(this);

		$.ajax({
			url: "http://localhost:3000/api/posts/" + $(this).closest(".panel").data("id"),
			type: "GET",
			success: function(data) {
				$editPostName.val(data.name);
				$editPostBody.val(data.body);

				console.log(data.id)
				postId = data.id
			},
				error: function() {
					alert("Error!");
			}
		});

	});

	// PUT and render Post edits
	$editPostForm.on("submit", function(event) {
		event.preventDefault();

		// hide the modal
		$editPostModal.modal("hide");


		// find the post
		var $editNewPanel = ($("#post-" + postId)[0]);
		console.log("--> this is the panel you are trying to edit");
		console.log($editNewPanel);

		// find the name
		var $editNewPanelDate = ($("> .panel-heading > .panel-title > .post-date", $editNewPanel));
		// $editNewPanelName.removeClass();
		console.log("--> this is the title you are trying to replace");
		console.log($editNewPanelDate);

		// find the body
		var $editNewPanelBody = ($("> .panel-body > p", $editNewPanel));
		console.log("--> this is the body you are trying to replace");
		console.log($editNewPanelBody);

		// new date
		var newDate = new Date();
		newDate = newDate.toLocaleString();

		// Render new date/body on page
		$editNewPanelDate.text("edited on " + newDate);
		$editNewPanelBody.text($editPostBody.val());

		var editPostObj = {
			date: newDate,
			body: $editPostBody.val()
		};

		$.ajax({
			url: "http://localhost:3000/api/posts/" + postId,
			type: "PUT",
			data: editPostObj,
			success: function(data) {
				console.log("editted post!")
			},
				error: function() {
					alert("Error!");
			}
		});


	});

	// Comment Submit
	$postsContainer.on("submit", ".comment-form", function(event) {
		event.preventDefault();

		// find input
		var $commentInput = $(this).find(".comment-input");

		// grab value from input
		var comment = $commentInput.val();

		// generate new Comment instance
		var newComment = {comment_body: comment};
		// newComment.body = comment;
		// console.log(newComment)

		// add date
		var date = new Date();
		date = date.toLocaleString();
		newComment.comment_date = date;

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

		var postData = {};
		postData.comments = [{comment_body: comment, comment_date: date}];

		var newCommentObj = {
			comment_body: comment,
			comment_date: date
		};

		$.ajax({
			type: "POST",
			url: "http://localhost:3000/api/posts/"+ $(this).closest(".panel").data("id") + "/comments",
			data: newCommentObj,
			success: function(data) {
				console.log("you added a comment!")
			},
			error: function() {
				alert("Error! Couldn't POST a comment");
			}
		});

	});


});




















