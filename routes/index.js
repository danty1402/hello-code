
/*
 * GET home page.
 */

var routes = {};
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

mongoose.connect('mongodb://localhost/test');

// 'programming language' object structure described by 'codeSchema'
var codeSchema = new Schema({
	name: String,
	type: {
		type: String, enum: ['compiled', 'interpreted'], 
		default: 'compiled'
	}
});


// creates a collection in the database, and a handler for it
mongoose.model('Language', codeSchema, 'languages');
var Language = mongoose.model('Language');


mongoose.connection.on('error', 
	console.error.bind(console, 'connection error:'));
mongoose.connection.once('open', function callback () {
	console.log('Connected to database!')

	// removes any already existing items from the collection
	Language.find(function (err, data) {
		var length = data.length;
		data.forEach(function (elem) {
			elem.remove();
		})
});

	// hard-coded sample data for testing
	var names = ['C++', 
				'C', 
				'Javascript', 
				'PHP', 
				'C#', 
				'Python', 
				'Java', 
				'Random1', 
				'Random2', 
				'Random3'];

	length = names.length;

	// add all of them in the database
	names.forEach(function(lang){

		// save in db

		var languages = new Language();
		languages.name = lang;
		console.log('saving...');
		languages.save(function (err) {
			if (err) {console.log(err); throw err; }
			console.log('saved');
			if(--length === 0) {
				//mongoose.disconnect();
			}
		});
	})
});


routes.index = function(req, res){
	res.render('index', { title: 'Hello::Code' });
};


/* function to handle the search-box request
 * two types of request are defined here:
 *	
 *		1. request to retrieve all the keyword information
 *		2. request to query the database by name
 */	

routes.results = function(req, res) {
	mongoose.model('Language', codeSchema, 'languages');
	var Language = mongoose.model('Language');
	if (req.query['get'] == 'all') {

		Language.find(function (err, data) {
			if (err) {throw err;}
			else {
				var response = [];
				var length = data.length;
				console.log('found %d results', length);
				data.forEach(function (elem) {
					console.log('pushing element %d', length);
					response.push(elem.name);
					if(--length=== 0) {
						console.log(response);
						response = JSON.stringify(response);
						res.write(response);
						res.end();
					}
				});
			}
		})
		//mongoose.disconnect();
	} else {
		console.log('now searching %s...', req.query['name']);
		Language.find({name: req.query['name']}, function (err, data) {
			if (err) {throw err;}
			else {
				var response = [];
				var length = data.length;
				console.log('found %d results', length);
				data.forEach(function (elem) {
					console.log('pushing element %d', length);
					response.push(elem.name);
					if(--length=== 0) {
						console.log(response);
						response = JSON.stringify(response);
						res.write(response);
						res.end();
					}
				});
			}
		})
		//mongoose.disconnect();
	}
};

module.exports = routes;
