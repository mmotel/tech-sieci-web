var tree = (function(){
		var id = 0;
		var genId = function() { id = id + 1; return id; };
		var osoby = [];
		
		var Osoba = function(imie, nazwisko, index){ //konstruktor osoby
			this.imie = imie;
			this.nazwisko = nazwisko;
			this.index = index;
			this.mama = 0;
			this.tata = 0;
			return this;
		};
		
		var findOsoba = function (id) { 
			var o = null;
			Array.prototype.forEach.call(osoby, function (el) {
				if(el.index === id) {o = el; }
			});
			return o;
		};
		
		var showOsoba = function (arg, pre){
			var o = {};
			if(arg.constructor !== Osoba){ o = findOsoba(arg); }
			else{ o = arg; }
			if(!pre || typeof pre !== 'string') { pre = ""; }
			if(o && o !== null){
				console.log(pre + "[ imie: " + o.imie + ", nazwisko: " + o.nazwisko + ", id: " + o.index + " ]"); 
			}
			else { throw { typerr: "nie ma takiej osoby" }; }
		};
		
		return {
			addOsoba: function(imie, nazwisko){ osoby.push(new Osoba(imie,nazwisko, genId())); },
			editOsoba: function(id, imie,nazwisko) {
				var o = findOsoba(id);
				o.imie = imie;
				o.nazwisko = nazwisko;
			},
			setMama: function (idOsoba, idMama) {  
				var o = findOsoba(idOsoba); 
				var m = findOsoba(idMama);
				if(o && m){ o.mama = idMama; }
				else { throw { typerr: "nie ma takiej osoby" }; }
			},
			rmMama: function (idOsoba){
				var o = findOsoba(idOsoba);
				if(o){
					o.mama = 0;
				}
			},
			setTata: function (idOsoba, idTata) {  
				var o = findOsoba(idOsoba); 
				var t = findOsoba(idTata);
				if(o && t){ o.tata = idTata; }
				else { throw { typerr: "nie ma takiej osoby" }; }
			},
			rmTata: function (idOsoba){
				var o = findOsoba(idOsoba);
				o.tata = 0;
			},
			showOsoby: function() { 
				Array.prototype.forEach.call(osoby, function(el){ 
					console.log("[ imie: " + el.imie + ", nazwisko: " + el.nazwisko + ", id: " + el.index + " ]"); 
				});
				console.log(" ");
			},
			showRodzice: function (idOsoba){ 
				var o = findOsoba(idOsoba); 
				showOsoba(o);
				console.log("Rodzice: ");
				showOsoba(o.mama, "Mama: ");
				showOsoba(o.tata, "Tata: ");	
				console.log(" ");
			},
			showRodzenstwo: function (idOsoba) {
				var o = findOsoba(idOsoba);
				showOsoba(o);
				console.log("Rodzenstwo: ");
				Array.prototype.forEach.call(osoby, function (el) {
					if((el.index !== o.index) && ( (el.mama !== 0 && el.mama === o.mama ) || (el.tata !== 0 && el.tata === o.tata) )){
						showOsoba(el);
					}
				});
				console.log(" ");
			},
			showPotomstwo: function(idOsoba) {
				var o = findOsoba(idOsoba);
				showOsoba(o);
				console.log("Potomstow: ");
				Array.prototype.forEach.call(osoby, function(el) {
					if(el.mama === o.index || el.tata === o.index){
						showOsoba(el);
					}
				});
				console.log(" ");
			}
		};
	}());
	
tree.addOsoba('Jan', 'Kowalski');
tree.addOsoba('Tomasz', 'Kowalski');
tree.addOsoba('Anna', 'Kowalska');
tree.addOsoba('Adam', 'Kowalski');
tree.addOsoba('Julia', 'Kowalska');
//tree.editOsoba(1,'Janusz','Nowak');
tree.showOsoby();
tree.setMama(1,3);
tree.setTata(1,2);
tree.setMama(4,3);
tree.setTata(5,2);
tree.showRodzice(1);
//tree.rmMama(1);
//tree.rmTata(1);
//tree.showRodzice(1);
tree.showRodzenstwo(1);
tree.showPotomstwo(3);