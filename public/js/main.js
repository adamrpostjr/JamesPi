var socket = io();
(function ($, window, undefined) {
	$.fn.marqueeify = function (options) {
		var settings = $.extend({
			horizontal: true,
			vertical: true,
			speed: 100, // In pixels per second
			container: $(this).parent(),
			bumpEdge: function () {}
		}, options);

		return this.each(function () {
			var containerWidth, containerHeight, elWidth, elHeight, move, getSizes,
				$el = $(this);
			getSizes = function () {
				containerWidth = settings.container.outerWidth();
				containerHeight = settings.container.outerHeight();
				elWidth = $el.outerWidth();
				elHeight = $el.outerHeight();
			};
			move = {
				right: function () {
					$el.animate({left: (containerWidth - elWidth)}, {duration: ((containerWidth/settings.speed) * 1000), queue: false, easing: "linear", complete: function () {
						settings.bumpEdge();
						move.left();
					}});
				},
				left: function () {
					$el.animate({left: 0}, {duration: ((containerWidth/settings.speed) * 1000), queue: false, easing: "linear", complete: function () {
						settings.bumpEdge();
						move.right();
					}});
				},
				down: function () {
					$el.animate({top: (containerHeight - elHeight)}, {duration: ((containerHeight/settings.speed) * 1000), queue: false, easing: "linear", complete: function () {
						settings.bumpEdge();
						move.up();
					}});
				},
				up: function () {
					$el.animate({top: 0}, {duration: ((containerHeight/settings.speed) * 1000), queue: false, easing: "linear", complete: function () {
						settings.bumpEdge();
						move.down();
					}});
				}
			};

			getSizes();

			if (settings.horizontal) {
				move.right();
			}
			if (settings.vertical) {
				move.down();
			}

      // Make that shit responsive!
      $(window).resize( function() {
        getSizes();
      });
		});
	};
})(jQuery, window);
$(document).ready( function() {
	$('.marquee').marqueeify({
		speed: 300,
		bumpEdge: function () {
			var newColor = "hsl(" + Math.floor(Math.random()*360) + ", 100%, 50%)";
			$('.marquee .logo').css('fill', newColor);
		}
	});
});

const saying = document.getElementById('jhead')
socket.on('updateClient', function(data){
	saying.innerText = ''
	saying.innerText = data
})
socket.on('comeIn', function(data){
	var form = document.createElement("div");
	form.classList.add("form");
	document.body.appendChild(form)
	var title = document.createElement("span");
	title.classList.add('title')
	title.innerText = 'Update'
	form.appendChild(title)
	var passBox = document.createElement('input')
	passBox.classList.add("passBox");
	passBox.setAttribute('type','password');
	form.appendChild(passBox);
	var insults = document.createElement('select');
	insults.classList.add("insultList");
	form.appendChild(insults);
	var save = document.createElement('input');
	save.setAttribute('type', 'checkbox')
	save.setAttribute('name', 'save')
	save.classList.add('save');
	form.appendChild(save);
	var label = document.createElement('label')
	label.classList.add('label');
	label.setAttribute('for','save');
	label.innerText = 'save?'
	form.appendChild(label);
	var br = document.createElement('br');
	form.appendChild(br)
	var msgBox = document.createElement('textarea');
	msgBox.classList.add("msgBox");
	form.appendChild(msgBox);
	var updateButton = document.createElement('button');
	updateButton.classList.add('updateButton');
	updateButton.innerText = 'UPDATE'
	updateButton.setAttribute('onclick', 'sendUpdate('+passBox.value,save.value,msgBox.value+')')
	form.appendChild(updateButton)
})
let keysPressed = {};
document.addEventListener('keydown', (event) => {
   keysPressed[event.key] = true;
   if (keysPressed['Alt'] && event.key == 'm') {
       passChecker()
   }
});
document.addEventListener('keyup', (event) => {
   delete keysPressed[event.key];
});
function passChecker() {
  var password = prompt("Please enter a password:", "");
	if (password == "") {
		saying.innerText == "not today"
	}
	else {
		socket.emit('knockKnock', password)
	}
}
function sendUpdate(password, save, message) {
	console.log(password);
	console.log(save);
	console.log(message);
}
