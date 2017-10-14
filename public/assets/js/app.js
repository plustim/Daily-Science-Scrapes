// show the note form
$("#article").on("click", ".add-note", function(){
	$(".new-note").hide();
	$(".add-note").show();
	$(this).siblings(".new-note").fadeIn(200);
	$(this).hide();
})

// when the note form is submitted
$("#article").on("submit", ".new-note", function(event){
	event.preventDefault();
	if($(this).children(".title").val() || $(this).children(".body").val() ){
		var element = $(this);
		var thisId = $(this).attr("data-id");
		$.ajax({
			method: "POST",
			url: "/note/"+thisId,
			data: {
				title: $(this).children(".title").val(),
				body: $(this).children(".body").val()
			}
		}).done(function(data) {
			rebuild(element, data);
		});
		// remove the values entered in the input and textarea for note entry
		$(this).children().val("");
	}
});

// when the delete note button is clicked
$("#article").on("click", ".delete-note", function(){
	var element = $(this);
	$.ajax({
		method: "DELETE",
		url: "/note",
		data: {
			_id: $(this).attr("data-id"),
			articleRef: $(this).attr("data-article")
		}
	}).done(function(data) {
		rebuild(element, data);
	});
});

function rebuild(element, data){
	console.log(data);
	var body = "<h3>"+data.title+"</h3><p>"+data.date+"</p><p>"+data.summary+"</p><a href=\""+data.link+"\">Read Full Article</a><hr /><p>notes:</p><ul>";
	data.notes.forEach(function(val, i){
		body += "<button class=\"delete-note\" data-id=\""+val._id+"\" data-article=\""+data._id+"\">x</button><li><b>"+val.title+"</b><br/>"+val.body+"</li>";
	});
	body += "</ul><button class=\"add-note\">New Note</button><form class=\"new-note\" data-id=\""+data._id+"\">title: <input type=\"text\" class=\"title\" /><br>body: <textarea class=\"body\"></textarea><button type=\"submit\">Add Note</button></form>";
	
	$(element).parents(".single").html(body);
}

// when new scrape is clicked
$("#new-scrape").on("click", function(){
	$.ajax({
		method: "POST",
		url: "/scrape",
	}).done(function(data){
		console.log(data);
	})
})
