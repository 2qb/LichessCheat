//2qb

let bestmove, enginemove;

function GetChessMoves() {
	const moveList = document.querySelector('vertical-move-list');
	if (!moveList) return '';
	const moves = moveList.querySelectorAll('.move');
	if (!moves.length) return '';
	let moveString = '';
	let moveNumber = 1;
  
	moves.forEach((move) => {
	  const whiteMove = move.querySelector('.white');
	  const blackMove = move.querySelector('.black');
	  if (whiteMove) {
		moveString += `${moveNumber}. ${whiteMove.textContent} `;
		moveNumber++;
	  }
	  if (blackMove) {
		moveString += `${blackMove.textContent} `;
	  }
	});
  
	return moveString.trim();
  }

function GetChessSide() {
	return document.querySelector('.clock-component.clock-bottom.clock-white') ? 1 : 0;
}

function range(start, end) {
	const result = [];
	for (let i = start; i <= end; i++) {
		result.push(i);
	}
	return result;
}

function SquareToPos(square, size) {
	const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
	const ranks = range(1, 8);

	GetChessSide() == 1 ? ranks.reverse() : files.reverse();

	let [file, rank] = square.split('');
	rank = parseInt(rank);

	const x = files.indexOf(file);
	const y = ranks.indexOf(rank);

	const squareSize = size / 8;

	return [squareSize * x + squareSize / 2, squareSize * y + squareSize / 2];
}

function GetMoveTo(move, turn) {
	let from, to;
	move = bestmove;
	// Long castles (O-O-O)
	if (move.toLowerCase() === "o-o-o") {
		if (turn === 1) {
			return {
				from: "e1",
				to: "c1"
			};
		} else {
			return {
				from: "e8",
				to: "c8"
			};
		}
	}
	// Short castles (O-O)
	if (move.toLowerCase() === "o-o") {
		if (turn === 1) {
			return {
				from: "e1",
				to: "g1"
			};
		} else {
			return {
				from: "e8",
				to: "g8"
			};
		}
	}

	// Parse the from and to squares from the move
	from = move.slice(0, 2);
	to = move.slice(2, 4);

	return {
		from,
		to
	};
}

function DrawOnScreen() {
	let existing = document.getElementById('py-overlay');
	if (existing) {
		existing.remove();
	}

	let boardElement = document.querySelector('#board-single');
	let rect = boardElement.getBoundingClientRect();
	let { width, height, top, left } = rect;

	let svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
	svg.id = 'py-overlay';
	svg.style.position = 'absolute';
	svg.style.zIndex = '99999';
	svg.style.pointerEvents = 'none';
	svg.style.width = width + 'px';
	svg.style.height = height + 'px';
	svg.style.top = top + 'px';
	svg.style.left = left + 'px';
	svg.setAttribute('width', width);
	svg.setAttribute('height', width);

	let turn = GetChessSide();

	DrawArrow(svg, bestmove, enginemove, turn, width);

	document.body.appendChild(svg);
}

function DrawArrow(svg, move, enginemove, turn, size) {
	colors = {
		0: 'hsla(145, 100%, 50%, 0.66)', // ENGINE(LGREEN)
		1: 'hsla(37, 100%, 50%, 0.66)' // BOOK(ORANGE)
	};

	const squareSize = size / 8;

	let marker = document.createElementNS('http://www.w3.org/2000/svg', 'marker');
	marker.id = 'triangle' + turn;
	marker.setAttribute('viewBox', '0 0 20 20');
	marker.setAttribute('refX', '0');
	marker.setAttribute('refY', '5');
	marker.setAttribute('markerUnits', 'strokeWidth');
	marker.setAttribute('markerWidth', squareSize / 12);
	marker.setAttribute('markerHeight', squareSize / 12);
	marker.setAttribute('orient', 'auto');
	enginemove ? marker.setAttribute('fill', colors[0]) : marker.setAttribute('fill', colors[1])

	let path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
	path.setAttribute('d', 'M 0 0 L 7.5 5 L 0 10 z');
	marker.appendChild(path);

	svg.appendChild(marker);

	let { from, to } = GetMoveTo(move, turn);
	[x1, y1] = SquareToPos(from, size);
	[x2, y2] = SquareToPos(to, size);

	const xDist = x2 - x1;
	const yDist = y2 - y1;
	const dist = Math.sqrt(xDist * xDist + yDist * yDist);
	const newDist = dist - squareSize * (2 / 5);
	const scale = newDist / dist;

	x2 = x1 + xDist * scale;
	y2 = y1 + yDist * scale;

	let line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
	line.setAttribute('x1', x1);
	line.setAttribute('y1', y1);
	line.setAttribute('x2', x2);
	line.setAttribute('y2', y2);
	line.setAttribute('marker-end', `url(#triangle${turn})`);
	enginemove ? line.setAttribute('stroke', colors[0]) : line.setAttribute('stroke', colors[1]);
	line.setAttribute('stroke-width', squareSize / 6);
	svg.appendChild(line);
}

function SendMovesToServer() {
	const moves = GetChessMoves();
	const side = GetChessSide();
	const data = {
		moves,
		side
	};
	const requestOptions = {
		method: 'POST',
		body: JSON.stringify(data),
		headers: {
			'Content-Type': 'application/json'
		}
	};
	fetch('http://localhost:5000/moves', requestOptions)
		.then(response => {
			if (response.ok) {
				return response.json();
			}
		})
		.then(data => {
			if (data != null) {
				bestmove = data.best_move_py;
				enginemove = data.engine_move;
				DrawOnScreen();
			}
		})
		.catch(error => {
			console.error('Error sending moves:', error);
		});
}

const observer = new MutationObserver((mutationsList) => {
	for (let mutation of mutationsList) {
	  if (mutation.target.nodeName === 'VERTICAL-MOVE-LIST') {
		const changedNodes = Array.from(mutation.target.querySelectorAll('.move'));
		if (changedNodes.length > 0) {
		  SendMovesToServer(GetChessMoves());
		  break;
		}
	  }
	}
  });
  
  observer.observe(document, {
	attributes: true,
	childList: true,
	characterData: true,
	subtree: true,
	attributeOldValue: true,
	characterDataOldValue: true,
  });