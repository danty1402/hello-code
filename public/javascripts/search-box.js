var ajaxUrl = "/";

$("#search-box").keyup(function () {
	console.log('da');

	$.ajax({
		type: "GET", 					// GET or POST or PUT or DELETE verb
		url: ajaxUrl, 					// Location of the service
		data: "", 						// Data sent to sesrver
		contentType: "",				// content type sent to server
		dataType: "json", 				// Expected data format from server
		processdata: true, 				// True or False
		success: function (json) {		// On Successful service call
			var result = json.name;
			$("#results").html('a');
		},
		error: function(err) {
			$('#results').html('error');
		}			// When Service call fails
	});

	return false;
});