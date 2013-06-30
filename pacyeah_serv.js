var http = require('http');
try {
	var mongo = require('/home/i/node_modules/mongodb');
} catch(err) {
	var mongo = require('mongodb');
}

var db = new mongo.Db('pacyeah', mongo.Server('127.0.0.1', mongo.Connection.DEFAULT_PORT), {w: 1});

http.createServer(function(request, response) {
	response.writeHead(200, {'Content-Type': 'text/plain', 'Access-Control-Allow-Origin': '*'});

	if(request.url.indexOf('gameover') > -1) {
		var name = decodeURIComponent(request.url.substr(name = request.url.indexOf('&') + 1, (points = request.url.indexOf('=', name)) - name));
		var points = request.url.substr(points + 1);

		// db
		var response_json = {}, i = 0;
		db.open(function(err, db) {
			db.collection('rating', function(err, collection) {
				
				// modifying data
				collection.findAndModify({name: name, points: {$lt: Number(points)}}, [], {$set: {points: Number(points)}}, {upsert: true}, function(err, records) {
				//collection.update({name: name, points: {$lt: Number(points)}}, {$set: {points: Number(points)}}, {upsert: true}, function(err, records) {
					collection.count(function(err, count) {

						// sending response
						collection.find({}, {}, {'sort': [['points', -1]]}, function(err, cursor) {
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