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

	var $deletePost = $("#delete-post");

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

	$postBody.keypress(function (e) {
        if(e.which == 13 && event.ctrlKey) {
            e.preventDefault();
            $(this).submit();
        }
    });

	$editPostBody.keypress(function (e) {
        if(e.which == 13 && event.ctrlKey) {
            e.preventDefault();
            $(this).submit();
        }
    });

	// API, Render on page load
	$.ajax({
		url: "http://localhost:3000/api/posts",
		type: "GET",
		success: function(data) {

			numPosts = data.length;

			_.each(data, function(post) {

				var $post = $(postTemplate(post));
				$postsContainer.prepend($post);

				_.each(post.comments, function(comment) {

					var $comments = $("#post-" + post._id + " > .comments-container", $postsContainer);
					$comments.append(commentTemplate(comment));

				})

			})

			// Update post count
			if (numPosts === 0) {
				$postCount.html(numPosts + " posts");
			} else if (numPosts > 1) {
				$postCount.html(numPosts + " posts");
			} else {
				$postCount.html(numPosts + " post");
			}
			

		}
	});

	// on new post modal SHOW
	$newPostModal.on('shown.bs.modal', function () {
		$("#body-help").show();	
		$postName.focus();
	})

	// on new post modal HIDE
	$newPostModal.on('hidden.bs.modal', function(){
	    $(this).find('form')[0].reset();

	    $('#name-error.collapse').collapse("hide");
	    $('#body-error.collapse').collapse("hide");
	    $("#post-name-group").removeClass("has-error");
	    $("#post-body-group").removeClass("has-error");
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

		if (postName === "") {

			$("#post-name-group").addClass("has-error");
			$('#name-error.collapse').collapse("show");

			$('#body-error.collapse').collapse("hide");

			$postName.focus();

		} else if (postBody === "") {

			$("#post-name-group").removeClass("has-error");

			$("#post-body-group").addClass("has-error");
			$('#body-error.collapse').collapse("show")

			$('#name-error.collapse').collapse("hide");
			$("#body-help").hide();

			$postBody.focus();

		} else {
			$('#name-error.collapse').collapse("hide");
			$('#body-error.collapse').collapse("hide");
			$("#post-name-group").removeClass("has-error");
			$("#post-body-group").removeClass("has-error");

			$newPostModal.modal("hide");

			$.ajax({
				type: "POST",
				url: "http://localhost:3000/api/posts",
				data: postData,
				success: function(data) {

					postData._id = data._id;

					// render on client side
					var $post = $(postTemplate(postData));
					$postsContainer.prepend($post);

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
		console.log($(this).closest(".panel").data("id"));

		console.log("--> you clicked")
		console.log(this);

		$.ajax({
			url: "http://localhost:3000/api/posts/" + $(this).closest(".panel").data("id"),
			type: "GET",
			success: function(data) {
				$editPostName.val(data.name);
				$editPostBody.val(data.body);

				console.log(data._id)
				postId = data._id
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
			name: $editPostName.val(),
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

	$deletePost.on("click", function(event) {

		// hide the modal
		$editPostModal.modal("hide");

		console.log("--> Trying to Delete");
		console.log(postId);

		$.ajax({
			url: "http://localhost:3000/api/posts/" + postId,
			type: "DELETE",
			success: function(data) {
				console.log("deleted a post")

				// remove deleted phrase from view
		        $('#post-' + postId).remove();
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
		console.log("--> this is the comment");
		console.log(comment);

		// reset input
		$commentInput.val("");

		// find parent of form, the post
		var $post = $(this).parent()[0];

		//find <ul> (child) of post
		var $comments = $("> .comments-container", $post);

		var commentData = {
			body: comment,
			date: new Date().toLocaleString()
		};

		$.ajax({
			type: "POST",
			url: "http://localhost:3000/api/posts/"+ $(this).closest(".panel").data("id") + "/comments",
			data: commentData,
			success: function(data) {
				$comments.append(commentTemplate(commentData));
				console.log("you added a comment!")
			},
			error: function() {
				alert("Error! Couldn't POST a comment");
			}
		});

	});


});




















