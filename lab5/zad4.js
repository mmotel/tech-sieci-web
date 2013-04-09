var fib = function fib(arg) {
    if (arg <= 0) {
        return 0;
    }
    if (arg === 1) {
        return 1;
    }
    return fib(arg - 1) + fib(arg - 2);
};
var memo = function (cache, fun) {
    var cachedFun = function(n) {
		var result = cache[n];
		if(typeof result !== 'number'){
			result = fun(cachedFun, n);
			cache[n] = result;
		}
		return result;
	};
	return cachedFun;
};

var fibonacci = memo([0, 1], function (recur, n) {
    return recur(n - 1) + recur(n - 2);
});

console.log(fibonacci(42));