/*****************************************************************************##
##	Method used to handle user search requests: 							  ##
##																			  ##
##		1. on focus on the search-box, all the search keywords (in this 	  ##		
##			case programming language names) are retrieved from the 		  ##
##			database by an ajax request, and stored in an array.			  ##									
##		2. on keyup event triggered by the search-box (basically when		  ##
##			the search-box value changes) the value is compared to all 		  ##
##			the keywords previously retrieved and the matches are displayed   ##
##			back on the page.												  ##
##															     			  ##
*******************************************************************************/


var ajaxUrl = "/results";	// path to the script that will handle the request
var languages = [];			// initial data array


// getAllNames() will send a request with ajax and will retrieve all the 
// programming language names from the database, storing them in the 
// 'languages' array.
var getAllNames = function () {

	if (languages.length === 0) {
		console.log('getting all languages...');
		$.ajax({
			type: "GET", 						
			url: ajaxUrl,
			data: {get: 'all'},
			success: function (json) {
				if(json.trim()) {
					json = JSON.parse(json);
					languages = json;
					console.log(languages);
				} else {
					$("#results").html('<i>No languages :(</i><br>');
				}
			},
			error: function(err) {
				console.error(err);
				$('#results').html('<i>Error!</i><br>');
			}
		});
	} else {
		console.log('focus set, no action needed');
	}
}


// the search() function handles the searches that the user initiate by typing 
// in the search-box it iterates through the names in the 'languages' array 
// and finds the matches, displaying them in some proper results box back on 
// the index page
var search = function () {
	// if the languages array has not been retrieved yet
	if (languages.length === 0) {
		getAllNames();	// well, retrieve it!
		this();
	} else {
		var value = $('#search-box').val().trim().toLowerCase();
		
		if (value == '') {
			$('#status').html('');
			$('#results').html('');
			return;
		}

		var results = '';
		$('#results').html('');
		languages.forEach(function (elem) {
			var idx = elem.toLowerCase().search(value);
			if (idx === 0) {
				results += '<li>' + elem + '</li>';
			}
		});
		if (results != '') {
			$('#status').html('<i>Here are some results:</i>');
			$('#results').append(results);
		} else {
			$('#status').html('<i>No results :(</i>');		}
	}
};

$("#search-box").keyup(search);
$("#search-box").focus(getAllNames);
