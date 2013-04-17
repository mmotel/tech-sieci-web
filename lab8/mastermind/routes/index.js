exports.index = function (req, res) {
    req.session.puzzle = req.session.puzzle || req.app.get('puzzle');
    res.render('index', {
        title: 'Mastermind'
    });
};

exports.play = function (req, res) {
    var newGame = function () {
        var i, data = [], puzzle = req.session.puzzle;
        for (i = 0; i < puzzle.size; i += 1) {
            data.push(Math.floor(Math.random() * puzzle.dim));
        }
        req.session.puzzle.data = data;
		console.log(data);
        return {
            'retMsg': 'coś o aktualnej koniguracji…',
			'size': puzzle.size,
			'dim': puzzle.dim,
			'max': puzzle.max
        };
    };
	//------------------------------------------
    // poniższa linijka jest zbędna (przy założeniu, że
    // play zawsze uzywany będzie po index) – w końcowym
    // rozwiązaniu można ją usunąć.
    req.session.puzzle = req.session.puzzle || req.app.get('puzzle');
    /*
     * req.params[2] === wartość size
     * req.params[4] === wartość dim
     * req.params[6] === wartość max
     */
    if (req.params[2]) {
        req.session.puzzle.size = req.params[2];
    }
	if (req.params[4]) {
        req.session.puzzle.dim = req.params[4];
    }
	if (req.params[6]) {
        req.session.puzzle.max = req.params[6];
    }
    res.writeHead(200, {
        'Content-Type': 'application/json; charset=utf8'
    });
    res.end(JSON.stringify(newGame()));
};

exports.mark = function (req, res) {
    var markAnswer = function () {
		var puzzle = req.session.puzzle;
        var move = req.params[0].split('/');
        move = move.slice(0, move.length - 1);
        console.log(move);
		
		var blackPoints = 0;
		var whitePoints = 0;
		
		var flags = [];
		var data = puzzle.data;
		for(var i=0; i < data.length; i++){
			if(data[i] === parseInt(move[i],10)){
				flags[i] = 1;
				blackPoints++;
			}
		}
		
		for(var i =0; i < data.length; i++){
			for(var k =0; k < data.length; k++){
				if(flags[k] !== 1){
					if(data[k] === parseInt(move[i],10)){
						flags[k] = 1;
						whitePoints++;
						break;
					}
				}
			};
		};
		
        return {
            'retVal': 'tutaj – zamiast tego napisu – ocena',
            'retMsg': 'coś o ocenie – np „Brawo” albo „Buuu”',
			'blackPoints': blackPoints,
			'whitePoints': whitePoints
        };
    };
    res.writeHead(200, {
        'Content-Type': 'application/json; charset=utf8'
    });
    res.end(JSON.stringify(markAnswer()));
};
