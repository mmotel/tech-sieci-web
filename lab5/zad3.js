var szablon =
  '<table border="{border}">' +
  '  <tr><td>{first}</td><td>{last}</td></tr>' +
  '</table>';
  
  var dane = {
    first: "Jan",
    last:  "Kowalski",
    pesel: "97042176329"
};

var podstaw = function (dane) {
	var that = this;
	var patt = /\{(\w*)\}/g;
	var m = that.match(patt);
	
	if(m){
		Array.prototype.forEach.call(m, function (el){
			var attr = el.substr(1,el.length-2);
			var d = dane[attr] ? dane[attr] : el;
			that = that.replace(el, d);
		});
	};
	return that;
};

String.prototype.podstaw = podstaw;
console.log(szablon.podstaw(dane));
