var nbsp = function (){
	s = this;
	var patt = /(\s|\n)(a|i|o|u|w|z)((\s|\n))/g;
	var m = s.match(patt);
	
	Array.prototype.forEach.call(m, function (el) {
		s = s.replace(el, (el.substr(0,2)) + '&nbsp;');
	});
	
	return s;
};
String.prototype.nbsp = nbsp;
console.log(('ala i as poszli w las').nbsp());