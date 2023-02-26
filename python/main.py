# 2qb
import io
import logging
import os
import random
import sys

import chess.engine
import chess.pgn
import chess.polyglot
from flask import Flask, request
from flask_cors import CORS

logging.disable(logging.CRITICAL)

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

script_dir = os.path.dirname(os.path.abspath(sys.argv[0]))
engine_dir = os.path.join(script_dir, "engine")
engine_path = os.path.join(engine_dir, 'engine.exe')
book_path = os.path.join(engine_dir, "book.bin")

engine = chess.engine.SimpleEngine.popen_uci(engine_path)

print("Premium chess v2")


@app.route('/moves', methods=['POST'])
def handle_moves():
    side = request.json['side']
    moves = request.json['moves']
    pgn = io.StringIO(moves)
    game = chess.pgn.read_game(pgn)

    board = game.board()
    for move in game.mainline_moves():
        board.push(move)

    if board.is_game_over():
        result = board.result()
        print(result)
    else:
        if (board.turn == chess.WHITE and side == 1) or (board.turn == chess.BLACK and side == 0):
            try:
                with chess.polyglot.open_reader(book_path) as book:
                    entry = book.find(board)
                    best_move = board.san(entry.move)
                    best_move_py = entry.move.uci()
                    print(f"The book recommends {best_move}")
                    return best_move_py

            except (ValueError, IndexError):
                depth = random.randint(2, 3)
                result = engine.play(board, chess.engine.Limit(depth=depth))
                best_move = board.san(result.move)
                best_move_py = result.move.uci()
                print(f"The best move is: {best_move}")
                return best_move_py

        else:
            os.system('cls')

    return "null"


if __name__ == '__main__':
    app.run(debug=True)

engine.quit()
