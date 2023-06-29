<br />
<div align="center">
  <a href="https://github.com/2qb/chess-cheat">
    <img src="https://user-images.githubusercontent.com/68710010/221585771-6b7d9da6-005f-4cba-82f3-6e23a5eac432.png" alt="Logo" width="80" height="80">
  </a>
<h3 align="center">A Chess Cheat</h3>

  <p align="center">
    Visual cheat made for chess. [v3.0]
  </p>
</div>
<br>

<!-- ABOUT THE PROJECT -->
## About The Project

![Screenshot](https://user-images.githubusercontent.com/68710010/221585277-bdaf19c2-c399-491e-9771-53dad8e714cb.png)

A Chess Cheat that helps you play by showing the best move on screen.


## Built With

* JavaScript
* Python 3.9


## Getting Started

To get the cheat running: 

1. Download the zip
2. Add the extension (Go to your browser extensions > enable developer mode > load unpacked > choose the extracted folder)
3. Run main.exe
4. Start a game of chess and have fun

## IMPORTANT

To use on `Chess.com` make sure to put `Piece notation` to `text` for the bot to work correctly.
<br />
Open `config.ini` to choose custom depth value (Static/Random).

## Features:

### v3:
* Lichess.org support
* Chess.com support
* Fast calculation
* Custom opening theory book support
* Custom engine support
* Configurable depth (Static and Random)
* Different color for theory/engine moves
* Right shift to toggle ON/OFF

## Custom engine/book

To change the engine, simply download the engine of your choosing, put it in `./engine` and rename it to `engine.exe`
<br />
To change the theory book, download a book of your choosing, put it in `./engine` and rename it to `book.bin`


## Building

To build the project yourself you need:

* pip
  ```sh
  pip install chess
  pip install flask
  pip install flask-cors
  pip install configparser
  ```

* Pyinstaller for building
  ```sh
  pip install pyinstaller
  ```

* Building
  ```sh
  cd [file path]
  pyinstaller --onefile main.py
  ```

Note: Make sure to put the main.exe in the project root!

## Contact

If you need any help feel free to contact me at:

Discord - `the9240`
