$(function() {

	// Template
	var postTemplate = _.template($("#post-template").html(

	// Post Variables
	var $newPost = $("#new-post")

	var $postName = $("#post-name");
	var $postBody = $("#post-body");

	var $postsContainer = $("#posts-container")

	// Initial Set up
	$postName.prop('required',true);
	$postBody.prop('required',true);

	// Contrsuctor
	var Post = function(name, body) {
		this.name = name;
		this.body = body;
	}

});