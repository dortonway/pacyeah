server = {
	addr: '92.241.103.23',
	port: '8886'
};

// function for turning on inputting of name
function name_input() {

	// for characters
	document.addEventListener('keypress', input, false);

	name_input.backspace = function(event) {
		if(event.keyCode == 8) {
			event.preventDefault();

			input(true, true);
		}
	}

	// for hard button 'backspace'
	document.addEventListener('keydown', name_input.backspace, false);
}

function ajax(url, callback) {
	var request = new XMLHttpRequest();
	request.open('GET', url);
	request.onreadystatechange = function() {
		try {
			if(request.readyState == 4)
			if(request.status == 200)
				// answer
				callback(request.responseText);
			else {
				callback('fail');
				console.log('invalid response: ' + request.statusText);
			}
		} catch(e) {
			console.log('request error: ' + e.description);
		}
	}
	request.send(null);
}

var name = '', previous = [], name_inputting = true, best_points, rating, inputting_started = false, offline = false;
function input(event, backspace) {
	if(event) {

		// if 'enter' is pressed
		if(event !== true && event.keyCode === 13) {

			name_inputting = false;
			ajax('http://' + server.addr + ':' + server.port + '/?gameover&' + encodeURIComponent(name) + '=' + points, function(data) {

				// if we couldn't get data from server
				if(data === 'fail') {
					offline = true;
					return;
				}

				// scores from db
				rating = JSON.parse(data);

				// best points finding
				for(var player in rating)
					if(rating.hasOwnProperty(player) && rating[player].name == name && rating[player].points > points)
						best_points = rating[player].points;
				if(!best_points)
					best_points = points;
			});
		}

		// if 'backspace' is pressed
		else if(backspace)
			name = name.substr(0, name.length - 1);

		// if 'name' is very long we have to stop inputting, else adding a new character to the 'name' variable
		else if(name.length < 16) {
			name += String.fromCharCode(event.keyCode);

			inputting_started = true;
		}
	}
}
input(false);

var main_rect_width = 320, main_rect_height = 40, window_left = window.innerWidth/2 - main_rect_width/2, window_top = 100, str_height = 2, input_events = true;
function statistics() {

	// turn on inputting of name
	if(!statistics.was) {
		name_input();
		statistics.was = true;
	}

	// name inputting shows
	if(name_inputting) {

		// background
		c.fillStyle = "rgba(0,0,0,0.5)";
		c.fillRect(window_left, window_top, main_rect_width, main_rect_height);

		// green frame
		c.strokeStyle = '#005500';
		c.lineWidth = 2;
		c.strokeRect(input_left = window_left + 5, input_top = window_top + 5, main_rect_width - 80, main_rect_height - 10);


		/* text */

		c.fillStyle = '#FFF';
		c.font = 'normal 15pt Arial';
		if(!inputting_started)
			c.fillText('Name', window_left + 10, input_top + 22);
		else
			c.fillText(name + '|', input_left + 5, input_top + 22);

		c.fillText('Enter', window_left + main_rect_width - 60, input_top + 22);

	// rating table shows
	} else {

		// turn off inputting of name
		if(input_events) {
			document.removeEventListener('keypress', input, false);
			document.removeEventListener('keydown', name_input.backspace, false);

			input_events = false;
		}

		// background of rating table
		c.fillStyle = "rgba(0,0,0,0.5)";
		c.fillRect(window_left, 0, main_rect_width, window.innerHeight);

		// header of rating table
		c.fillStyle = '#FFF';
		c.font = 'normal 12pt Arial';
		c.fillText('You: ' + name, window_left + 20, window_top + 25);
		c.fillText('Your score: ' + points, window_left + 20, window_top + 45);

		if(offline) {
			c.fillStyle = '#FF0000';
			c.fillText('I couldn\'t connect to the server :(', window_left + 20, window_top + 65);
			return;
		} else {
			c.fillStyle = '#00FF00';
			c.fillText('Your best score: ' + best_points, window_left + 20, window_top + 65);
		}

		// printing of scores
		c.fillStyle = '#FFF';
		for(var player in rating)
			if(rating.hasOwnProperty(player)) {
				if(player > 20) {
					c.fillText('...', window_left + 20, window_top + 75 + (player + 2) * str_height);
					break;
				}
				c.fillText(player + '. ' + rating[player].name + ': ' + rating[player].points, window_left + 20, window_top + 75 + (player + 2) * str_height);
			}
	}
}