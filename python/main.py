# 2qb
from flask import Flask, request, jsonify
from flask_cors import CORS

import configparser

import io
import logging
import os
import random
import sys

import chess.engine
import chess.pgn
import chess.polyglot

logging.disable(logging.CRITICAL)

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})
print("--------------------\nPremium chess v3\n--------------------\n")

script_dir = os.path.dirname(os.path.abspath(sys.argv[0]))
engine_dir = os.path.join(script_dir, "engine")
engine_path = os.path.join(engine_dir, 'engine.exe')
book_path = os.path.join(engine_dir, "book.bin")

engine = chess.engine.SimpleEngine.popen_uci(engine_path)

config = configparser.ConfigParser()
config.read("config.ini")
random_depth_string = config.get("config", "randomized_depth")
static_depth_string = config.get("config", "static_depth")
depth_min_string = config.get("config", "random_depth_min")
depth_max_string = config.get("config", "random_depth_max")

if random_depth_string.lower() == "true":
    random_depth = True
elif random_depth_string.lower() == "false":
    random_depth = False
else:
    random_depth = False

depth_min = int(depth_min_string)
depth_max = int(depth_max_string)
static_depth = int(static_depth_string)

if random_depth:
    print(f"Current depth is: RANDOMIZED")
    print(f"Depth: \n min: {depth_min}\n max: {depth_max}\n")
else:
    print(f"Current depth is: STATIC")
    print(f"Depth: {static_depth}\n")


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
                    engine_move = False
                    os.system('cls')
                    print(f"The book recommends: {best_move}")
                    return jsonify(
                        engine_move=engine_move,
                        best_move_py=best_move_py
                    )
            except (ValueError, IndexError):
                if random_depth:
                    result = engine.play(board, chess.engine.Limit(depth=random.randint(depth_min, depth_max)))
                else:
                    result = engine.play(board, chess.engine.Limit(depth=static_depth))
                best_move = board.san(result.move)
                best_move_py = result.move.uci()
                engine_move = True
                os.system('cls')
                print(f"The engine recommends: {best_move}")
                return jsonify(
                    engine_move=engine_move,
                    best_move_py=best_move_py
                )
        else:
            os.system('cls')

    return "null"


if __name__ == '__main__':
    app.run()

engine.quit()
