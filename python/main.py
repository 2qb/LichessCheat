# 2qb
import io
import os
import sys
import logging
import chess.engine
import chess.pgn

from flask_cors import CORS
from flask import Flask, request, jsonify

logging.disable(logging.CRITICAL)

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

script_dir = os.path.dirname(os.path.abspath(sys.argv[0]))
engine_dir = os.path.join(script_dir, "engine")
engine_path = os.path.join(engine_dir, 'stockfish.exe')

engine = chess.engine.SimpleEngine.popen_uci(engine_path)


@app.route('/moves', methods=['POST'])
def handle_moves():
    moves = request.json['moves']
    pgn = io.StringIO(moves)
    game = chess.pgn.read_game(pgn)

    board = game.board()
    for move in game.mainline_moves():
        board.push(move)

    response = {}

    if board.is_game_over():
        result = board.result()
        print(result)
    else:
        result = engine.play(board, chess.engine.Limit(time=0.25))
        best_move = board.san(result.move)

        if board.turn == chess.WHITE:
            color = "White"
        else:
            color = "Black"

        response = {
            'best_move': best_move
        }
        print(f"The best move for {color} is: {best_move}")

    return jsonify(response)


if __name__ == '__main__':
    app.run()

engine.quit()
