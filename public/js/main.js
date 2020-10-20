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
var pass = '';
const saying = document.getElementById('jhead')
socket.on('updateClient', function(data){
	saying.innerText = ''
	saying.innerText = data
})
socket.on('comeIn', function(data){
	var form = document.createElement("div");
	form.id = "form"
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
	passBox.value =  pass
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
	updateButton.id = "updateButton"
	updateButton.innerText = 'UPDATE'
	form.appendChild(updateButton)
	$("#updateButton").click(function(){
		var checked;
		save.checked ? checked = 1 : checked = 0 
		if (passBox.value.length < 1 || msgBox.value.length < 1) {
			msgBox.value = 'please set password or msgBox'
		}else {
			socket.emit('update', {password: passBox.value, update: msgBox.value, save: checked})
		}		
	});
})
let keysPressed = {};
document.addEventListener('keydown', (event) => {
	keysPressed[event.key] = true;
	console.log(keysPressed);
	var form = document.getElementById('form')
	if (form === null) {
		if (keysPressed['Alt'] && event.key == 'm') {
				passChecker()
		}
	}else {
		if (keysPressed['Alt'] && event.key == 'm') {
				form.remove()
		}
	}

});
document.addEventListener('keyup', (event) => {
   delete keysPressed[event.key];
	 console.log(keysPressed);
});
function passChecker() {
  var password = prompt("Please enter a password:", "");
	pass = password
	if (password == "") {
		saying.innerText == "not today"
	}else {
		delete keysPressed['Alt'];
		delete keysPressed['m'];
		socket.emit('knockKnock', password)
	}
}
