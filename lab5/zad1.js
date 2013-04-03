var defFun = function (fun, types){
	if(fun.constructor !== Function){
		throw({ typerr: "fun nie jest funkcj¹" });
	}
	if(types.constructor !== Array){
		throw({ typper: "types nie jest tablic¹" });
	}
	fun.typeConstr = types;
	return fun;
};

var myFun = defFun(function (a,b){ return a+b; }, ['number', 'number']);

var appFun = function (fun) {
	var args = Array.prototype.slice.call(arguments, 1);
	if(!fun.typeConstr){
		throw({ typper: 'brak typeConstr attribute' });
	}
	
	args.forEach(function (el, idx) {
		if( typeof el !== fun.typeConstr[idx] ){
			throw({ typerr: "wrong typeof argument for " + idx + ". expected type " + fun.typeConstr[idx] });
		}
	});
	return fun.apply(this, args);
};
	console.log(appFun(myFun, 1, 2));