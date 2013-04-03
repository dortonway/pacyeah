var http = require('http');
var mongo = require('/home/i/node_modules/mongodb');

var db = new mongo.Db('pacyeah', mongo.Server('0.0.0.0', mongo.Connection.DEFAULT_PORT), {w: 1});

http.createServer(function(request, response) {
	response.writeHead(200, {'Content-Type': 'text/plain'});

	if(request.url.indexOf('gameover') > -1) {
		var name = request.url.substr(name = request.url.indexOf('&') + 1, (points = request.url.indexOf('=', name)) - name);
		var points = request.url.substr(points + 1);

		// db
		var response_json = {}, i = 0;
		db.open(function(err, db) {
			console.log(err);
			db.collection('rating', function(err, collection) {
				
				// insert into db
				collection.insert({name: name, points: points}, {safe: true}, function(err, records) {

					// read from db and response
					collection.count(function(err, count) {
						console.log(err);
						collection.find(function(err, cursor) {
							cursor.each(function(err, item) {
								if(item != null)
									response_json[++i] = item;
								else {
									response.end(JSON.stringify(response_json));
									db.close();
								}
							});
						});
					});
					
				});
			});
		});
	} else
		response.end('nothing');
}).listen(1234, '0.0.0.0');

console.log('server is running');