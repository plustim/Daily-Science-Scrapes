// when the note form is submitted
$(".new-note").on("submit", function(event){
	event.preventDefault();
	var thisId = $(this).attr("data-id");
	$.ajax({
		method: "POST",
		url: "/note/"+thisId,
		data: {
			title: $(this).children(".title").val(),
			body: $(this).children(".body").val()
		}
	}).done(function(data) {
		console.log(data);
	});
	// remove the values entered in the input and textarea for note entry
	$(this).children().val("");
});

// when the delete note button is clicked
$(".delete-note").on("click", function(){
	$.ajax({
		method: "DELETE",
		url: "/note",
		data: {
			_id: $(this).attr("data-id"),
			articleRef: $(this).attr("data-article")
		}
	}).done(function(data) {
		console.log(data);
	});
});

$("#new-scrape").on("click", function(){
	$.ajax({
		method: "POST",
		url: "/scrape",
	}).done(function(data){
		console.log(data);
	})
})
