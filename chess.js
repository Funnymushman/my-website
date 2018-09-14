$(function() {

    var display_on = -1;
    var displayed = false;
    var $arr_possible_move = $('.possible_move'), $square = $('.white, .black');
    var $white_square = $('.white'), $black_square = $('.black');
    var $clicked;
    var just_moved = false;
    var $prev_move_from, $prev_move_to;
    var moves, moves_size = 0;
    var history = [];
    var chessboard = [   0,  0,  0,  0, 32,  0, -1, -1, -1, -1,                 /*
                                                                                turn: even - white, odd - black
                                                                                check: 0 - none, 1 - black, 2 - white
                                                                                white king index
                                                                                black king index
                                                                                # of pieces
                                                                                analysis
                                                                                */
                        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
                        -1, 12, 10, 11, 13, 14, 11, 10, 12, -1,
                        -1,  9,  9,  9,  9,  9,  9,  9,  9, -1,
                        -1,  0,  0,  0,  0,  0,  0,  0,  0, -1,
                        -1,  0,  0,  0,  0,  0,  0,  0,  0, -1,
                        -1,  0,  0,  0,  0,  0,  0,  0,  0, -1,
                        -1,  0,  0,  0,  0,  0,  0,  0,  0, -1,
                        -1,  1,  1,  1,  1,  1,  1,  1,  1, -1,
                        -1,  4,  2,  3,  5,  6,  3,  2,  4, -1,
                        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
                        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1  ];

                    /*
                    Bit 4: Castle flag (for kings and rooks only)
                        0 - valid for castle
                        1 - not valid for castle
                    Bit 3: Color
                        0 - white
                        1 - black
                    Bits 2-0: Piece type
                        0 - empty
                        1 - pawn
                        2 - knight
                        3 - bishop
                        4 - rook
                        5 - queen
                        6 - king
                    */
    var boardlocation = [   '#a8', '#b8', '#c8', '#d8', '#e8', '#f8', '#g8', '#h8',
                            '#a7', '#b7', '#c7', '#d7', '#e7', '#f7', '#g7', '#h7',
                            '#a6', '#b6', '#c6', '#d6', '#e6', '#f6', '#g6', '#h6',
                            '#a5', '#b5', '#c5', '#d5', '#e5', '#f5', '#g5', '#h5',
                            '#a4', '#b4', '#c4', '#d4', '#e4', '#f4', '#g4', '#h4',
                            '#a3', '#b3', '#c3', '#d3', '#e3', '#f3', '#g3', '#h3',
                            '#a2', '#b2', '#c2', '#d2', '#e2', '#f2', '#g2', '#h2',
                            '#a1', '#b1', '#c1', '#d1', '#e1', '#f1', '#g1', '#h1'];

    var weight_b_pawn = [   0,  0,  0,  0,  0,  0,  0,  0,
                            1,  1,  1, -2, -2,  1,  1,  1,
                            1,  0,  0,  0,  0,  0,  0,  0,
                            0,  0,  0,  2,  2,  0,  0,  0,
                            1,  1,  1,  3,  3,  1,  1,  1,
                            1,  1,  2,  3,  3,  2,  1,  1,
                            5,  5,  5,  5,  5,  5,  5,  5,
                            0,  0,  0,  0,  0,  0,  0,  0];

    var weight_b_knight = [ -5, -4, -3, -3, -3, -3, -4, -5,
                            -4, -2,  0,  0,  0,  0, -2, -4,
                            -3,  1,  1,  2,  2,  1,  1, -3,
                            -3,  0,  2,  2,  2,  2,  0, -3,
                            -3,  1,  2,  2,  2,  2,  1, -3,
                            -3,  0,  1,  2,  2,  1,  0, -3,
                            -4, -2,  0,  0,  0,  0, -2, -4,
                            -5, -4, -3, -3, -3, -3, -4, -5];

    var weight_b_bishop = [ -2, -1, -1, -1, -1, -1, -1, -2,
                            -1,  1,  0,  0,  0,  0,  1, -1,
                            -1,  1,  1,  1,  1,  1,  1, -1,
                            -1,  0,  1,  1,  1,  1,  0, -1,
                            -1,  1,  1,  1,  1,  1,  1, -1,
                            -1,  0,  1,  1,  1,  1,  0, -1,
                            -1,  0,  0,  0,  0,  0,  0, -1,
                            -2, -1, -1, -1, -1, -1, -1, -2];

    var weight_b_rook = [    0,  0,  0,  1,  1,  0,  0,  0,
                            -1,  0,  0,  0,  0,  0,  0, -1,
                            -1,  0,  0,  0,  0,  0,  0, -1,
                            -1,  0,  0,  0,  0,  0,  0, -1,
                            -1,  0,  0,  0,  0,  0,  0, -1,
                            -1,  0,  0,  0,  0,  0,  0, -1,
                             1,  1,  1,  1,  1,  1,  1,  1,
                             0,  0,  0,  0,  0,  0,  0,  0];

    var weight_b_queen = [  -2, -1, -1, -1, -1, -1, -1, -2,
                            -1,  0,  1,  0,  0,  0,  0, -1,
                            -1,  1,  1,  1,  1,  1,  0, -1,
                             0,  0,  1,  1,  1,  1,  0, -1,
                            -1,  0,  1,  1,  1,  1,  0, -1,
                            -1,  0,  1,  1,  1,  1,  0, -1,
                            -1,  0,  0,  0,  0,  0,  0, -1,
                            -2, -1, -1, -1, -1, -1, -1, -2];

    var weight_b_king = [    2,  3,  1,  0,  0,  1,  3,  2,
                             2,  2,  0,  0,  0,  0,  2,  2,
                            -1, -2, -2, -2, -2, -2, -2, -1,
                            -2, -3, -3, -4, -4, -3, -3, -2,
                            -3, -4, -4, -5, -5, -4, -4, -3,
                            -3, -4, -4, -5, -5, -4, -4, -3,
                            -3, -4, -4, -5, -5, -4, -4, -3,
                            -3, -4, -4, -5, -5, -4, -4, -3];

    var game_mode = 0;  //0 - 2 player as white
                        //1 - 2 player as black
                        //2 - 1 player as white
                        //3 - 1 player as black

    function convert_board_to_loc(index) {
        index -= 21;
        var col = index % 10;
        index -= col;
        index /= 10;
        index *= 8;
        return index + col;
    }

    function convert_loc_to_board(index) {
        var col = index % 8;
        index -= col;
        index /= 8;
        index *= 10;
        return index + col + 21;
    }

    function printBoard() {
        var i, index = 21;
        for (i = 0; i < 64; ++i) {
            if (index % 10 == 9) {
                index += 2;
            }
            var color = (chessboard[index] >> 3) & 1;
            var piece = chessboard[index] & 7;
            if (color == 0) {                                                   //white
                if (piece == 1) {                                               //pawn
                    $(boardlocation[i]).text(String.fromCharCode(9817));
                } else if (piece == 2) {                                        //knight
                    $(boardlocation[i]).text(String.fromCharCode(9816));
                } else if (piece == 3) {                                        //bishop
                    $(boardlocation[i]).text(String.fromCharCode(9815));
                } else if (piece == 4) {                                        //rook
                    $(boardlocation[i]).text(String.fromCharCode(9814));
                } else if (piece == 5) {                                        //queen
                    $(boardlocation[i]).text(String.fromCharCode(9813));
                } else if (piece == 6) {                                        //king
                    $(boardlocation[i]).text(String.fromCharCode(9812));
                } else {
                    $(boardlocation[i]).text('');
                }
            } else {                                                            //black
                if (piece == 1) {                                               //pawn
                    $(boardlocation[i]).text(String.fromCharCode(9823));
                } else if (piece == 2) {                                        //knight
                    $(boardlocation[i]).text(String.fromCharCode(9822));
                } else if (piece == 3) {                                        //bishop
                    $(boardlocation[i]).text(String.fromCharCode(9821));
                } else if (piece == 4) {                                        //rook
                    $(boardlocation[i]).text(String.fromCharCode(9820));
                } else if (piece == 5) {                                        //queen
                    $(boardlocation[i]).text(String.fromCharCode(9819));
                } else if (piece == 6) {                                        //king
                    $(boardlocation[i]).text(String.fromCharCode(9818));
                } else {
                    $(boardlocation[i]).text('');
                }
            }
            index++;
        }
    }

    function resetBoard() {
        var i;
        for (i = 31; i < 39; i++) {
            chessboard[i] = 1;
        }
        for (i = 41; i < 49; i++) {
            chessboard[i] = 0;
        }
        for (i = 51; i < 59; i++) {
            chessboard[i] = 0;
        }
        for (i = 61; i < 69; i++) {
            chessboard[i] = 0;
        }
        for (i = 71; i < 79; i++) {
            chessboard[i] = 0;
        }
        for (i = 81; i < 89; i++) {
            chessboard[i] = 1;
        }
        chessboard[21] = 4;
        chessboard[22] = 2;
        chessboard[23] = 3;
        chessboard[26] = 3;
        chessboard[27] = 2;
        chessboard[28] = 4;
        chessboard[91] = 4;
        chessboard[92] = 2;
        chessboard[93] = 3;
        chessboard[96] = 3;
        chessboard[97] = 2;
        chessboard[98] = 4;
        chessboard[0] = 0;
        chessboard[1] = 0;
        chessboard[4] = 32;
        chessboard[5] = 0;
        chessboard[115] = 0;
        chessboard[116] = 0;
        chessboard[117] = 0;
        chessboard[118] = 0;
        chessboard[119] = 0;
        display_on = -1;
        displayed = false;
        just_moved = false;
        if (game_mode % 2 == 0) {
            chessboard[24] = 5;
            chessboard[25] = 6;
            chessboard[94] = 5;
            chessboard[95] = 6;
            for (i = 21; i < 29; i++) {
                chessboard[i] += 8;
            }
            for (i = 31; i < 39; i++) {
                chessboard[i] += 8;
            }
            chessboard[2] = 95;
            chessboard[3] = 25;
        } else {
            chessboard[24] = 6;
            chessboard[25] = 5;
            chessboard[94] = 6;
            chessboard[95] = 5;
            for (i = 81; i < 89; i++) {
                chessboard[i] += 8;
            }
            for (i = 91; i < 99; i++) {
                chessboard[i] += 8;
            }
            chessboard[2] = 24;
            chessboard[3] = 94;
        }
        delete_display(true);
        moves = possible_moves(chessboard);
        moves_size = moves.length;
        $('#analysis').text('0');
        printBoard();
    }

    function delete_display(played) {
        var i;
        for (i = 0; i < 64; i++) {
            $arr_possible_move[i].style.display = "none";
        }
        display_on = -1;
        $white_square.css("background-color", "#ffffff");
        $black_square.css("background-color", "#999999");
        if (chessboard[0] > 0) {
            if (chessboard[1] == 1) {
                $square[convert_board_to_loc(chessboard[3])].style.backgroundColor = "#ff0000";
            } else if (chessboard[1] == 2) {
                $square[convert_board_to_loc(chessboard[2])].style.backgroundColor = "#ff0000";
            }
            if (played == false) {
                $prev_move_from.css("background-color", "#96ff96");
                $prev_move_to.css("background-color", "#96ff96");
            }
        }
    }

    function find_display() {
        var index = convert_loc_to_board(display_on);
        var count = 0;
        for (var i = 0; i < moves_size; i+=2) {
            if (moves[i] == index) {
                $arr_possible_move[convert_board_to_loc(moves[i+1])].style.display = "block";
                count++;
            }
        }
        if (count > 0) {
            $clicked.parent().css("background-color", "#309930");
        }
    }

    function check(board) {
        var temp_index, temp_color, temp_piece;
        board[1] = 0;
        if (board[3] - 11 == board[2] || board[3] - 10 == board[2] || board[3] - 9 == board[2] || board[3] - 1 == board[2]
                                || board[3] + 1 == board[2] || board[3] + 9 == board[2] || board[3] + 10 == board[2]
                                || board[3] + 11 == board[2]) {
            board[1] = 3;
            return;
        }
        if (board[0] % 2 == 0) {
            temp_index = board[3] - 10;
            temp_piece = board[temp_index] & 7;
            while (temp_index > 20 && temp_piece == 0) {
                temp_index -= 10;
                temp_piece = board[temp_index] & 7;
            }
            if (temp_index > 20 && (temp_piece == 4 || temp_piece == 5)) {
                temp_color = (board[temp_index] >> 3) & 1;
                if (temp_color == 0) {
                    board[1] = 1;
                    return;
                }
            }
            temp_index = board[3] + 10;
            temp_piece = board[temp_index] & 7;
            while (temp_index < 100 && temp_piece == 0) {
                temp_index += 10;
                temp_piece = board[temp_index] & 7;
            }
            if (temp_index < 100 && (temp_piece == 4 || temp_piece == 5)) {
                temp_color = (board[temp_index] >> 3) & 1;
                if (temp_color == 0) {
                    board[1] = 1;
                    return;
                }
            }
            temp_index = board[3] - 1;
            temp_piece = board[temp_index] & 7;
            while (temp_index % 10 > 0 && temp_piece == 0) {
                temp_index--;
                temp_piece = board[temp_index] & 7;
            }
            if (temp_index % 10 > 0 && (temp_piece == 4 || temp_piece == 5)) {
                temp_color = (board[temp_index] >> 3) & 1;
                if (temp_color == 0) {
                    board[1] = 1;
                    return;
                }
            }
            temp_index = board[3] + 1;
            temp_piece = board[temp_index] & 7;
            while (temp_index % 10 < 9 && temp_piece == 0) {
                temp_index++;
                temp_piece = board[temp_index] & 7;
            }
            if (temp_index % 10 < 9 && (temp_piece == 4 || temp_piece == 5)) {
                temp_color = (board[temp_index] >> 3) & 1;
                if (temp_color == 0) {
                    board[1] = 1;
                    return;
                }
            }
            temp_index = board[3] - 11;
            temp_piece = board[temp_index] & 7;
            while (temp_index > 20 && temp_index % 10 > 0 && temp_piece == 0) {
                temp_index -= 11;
                temp_piece = board[temp_index] & 7;
            }
            if (temp_index > 20 && temp_index % 10 > 0 && (temp_piece == 3 || temp_piece == 5)) {
                temp_color = (board[temp_index] >> 3) & 1;
                if (temp_color == 0) {
                    board[1] = 1;
                    return;
                }
            }
            temp_index = board[3] - 9;
            temp_piece = board[temp_index] & 7;
            while (temp_index > 20 && temp_index % 10 < 9 && temp_piece == 0) {
                temp_index -= 9;
                temp_piece = board[temp_index] & 7;
            }
            if (temp_index > 20 && temp_index % 10 < 9 && (temp_piece == 3 || temp_piece == 5)) {
                temp_color = (board[temp_index] >> 3) & 1;
                if (temp_color == 0) {
                    board[1] = 1;
                    return;
                }
            }
            temp_index = board[3] + 9;
            temp_piece = board[temp_index] & 7;
            while (temp_index < 100 && temp_index % 10 > 0 && temp_piece == 0) {
                temp_index += 9;
                temp_piece = board[temp_index] & 7;
            }
            if (temp_index == board[3] + 9 && temp_index < 100 && temp_index % 10 > 0 && temp_piece == 1) {
                temp_color = (board[temp_index] >> 3) & 1;
                if (temp_color == 0) {
                    board[1] = 1;
                    return;
                }
            } else if (temp_index < 100 && temp_index % 10 > 0 && (temp_piece == 3 || temp_piece == 5)) {
                temp_color = (board[temp_index] >> 3) & 1;
                if (temp_color == 0) {
                    board[1] = 1;
                    return;
                }
            }
            temp_index = board[3] + 11;
            temp_piece = board[temp_index] & 7;
            while (temp_index < 100 && temp_index % 10 < 9 && temp_piece == 0) {
                temp_index += 11;
                temp_piece = board[temp_index] & 7;
            }
            if (temp_index == board[3] + 11 && temp_index < 100 && temp_index % 10 < 9 && temp_piece == 1) {
                temp_color = (board[temp_index] >> 3) & 1;
                if (temp_color == 0) {
                    board[1] = 1;
                    return;
                }
            } else if (temp_index < 100 && temp_index % 10 < 9 && (temp_piece == 3 || temp_piece == 5)) {
                temp_color = (board[temp_index] >> 3) & 1;
                if (temp_color == 0) {
                    board[1] = 1;
                    return;
                }
            }
            temp_index = board[3] - 21;
            if (temp_index > 20 && temp_index < 100 && temp_index % 10 > 0 && temp_index % 10 < 9) {
                temp_piece = board[temp_index] & 7;
                if (temp_piece == 2) {
                    temp_color = (board[temp_index] >> 3) & 1;
                    if (temp_color == 0) {
                        board[1] = 1;
                        return;
                    }
                }
            }
            temp_index = board[3] - 19;
            if (temp_index > 20 && temp_index < 100 && temp_index % 10 > 0 && temp_index % 10 < 9) {
                temp_piece = board[temp_index] & 7;
                if (temp_piece == 2) {
                    temp_color = (board[temp_index] >> 3) & 1;
                    if (temp_color == 0) {
                        board[1] = 1;
                        return;
                    }
                }
            }
            temp_index = board[3] - 12;
            if (temp_index > 20 && temp_index < 100 && temp_index % 10 > 0 && temp_index % 10 < 9) {
                temp_piece = board[temp_index] & 7;
                if (temp_piece == 2) {
                    temp_color = (board[temp_index] >> 3) & 1;
                    if (temp_color == 0) {
                        board[1] = 1;
                    }
                }
            }
            temp_index = board[3] - 8;
            if (temp_index > 20 && temp_index < 100 && temp_index % 10 > 0 && temp_index % 10 < 9) {
                temp_piece = board[temp_index] & 7;
                if (temp_piece == 2) {
                    temp_color = (board[temp_index] >> 3) & 1;
                    if (temp_color == 0) {
                        board[1] = 1;
                        return;
                    }
                }
            }
            temp_index = board[3] + 21;
            if (temp_index > 20 && temp_index < 100 && temp_index % 10 > 0 && temp_index % 10 < 9) {
                temp_piece = board[temp_index] & 7;
                if (temp_piece == 2) {
                    temp_color = (board[temp_index] >> 3) & 1;
                    if (temp_color == 0) {
                        board[1] = 1;
                        return;
                    }
                }
            }
            temp_index = board[3] + 19;
            if (temp_index > 20 && temp_index < 100 && temp_index % 10 > 0 && temp_index % 10 < 9) {
                temp_piece = board[temp_index] & 7;
                if (temp_piece == 2) {
                    temp_color = (board[temp_index] >> 3) & 1;
                    if (temp_color == 0) {
                        board[1] = 1;
                        return;
                    }
                }
            }
            temp_index = board[3] + 12;
            if (temp_index > 20 && temp_index < 100 && temp_index % 10 > 0 && temp_index % 10 < 9) {
                temp_piece = board[temp_index] & 7;
                if (temp_piece == 2) {
                    temp_color = (board[temp_index] >> 3) & 1;
                    if (temp_color == 0) {
                        board[1] = 1;
                        return;
                    }
                }
            }
            temp_index = board[3] + 8;
            if (temp_index > 20 && temp_index < 100 && temp_index % 10 > 0 && temp_index % 10 < 9) {
                temp_piece = board[temp_index] & 7;
                if (temp_piece == 2) {
                    temp_color = (board[temp_index] >> 3) & 1;
                    if (temp_color == 0) {
                        board[1] = 1;
                        return;
                    }
                }
            }
        } else {
            temp_index = board[2] - 10;
            temp_piece = board[temp_index] & 7;
            while (temp_index > 20 && temp_piece == 0) {
                temp_index -= 10;
                temp_piece = board[temp_index] & 7;
            }
            if (temp_index > 20 && (temp_piece == 4 || temp_piece == 5)) {
                temp_color = (board[temp_index] >> 3) & 1;
                if (temp_color == 1) {
                    board[1] = 2;
                    return;
                }
            }
            temp_index = board[2] + 10;
            temp_piece = board[temp_index] & 7;
            while (temp_index < 100 && temp_piece == 0) {
                temp_index += 10;
                temp_piece = board[temp_index] & 7;
            }
            if (temp_index < 100 && (temp_piece == 4 || temp_piece == 5)) {
                temp_color = (board[temp_index] >> 3) & 1;
                if (temp_color == 1) {
                    board[1] = 2;
                    return;
                }
            }
            temp_index = board[2] - 1;
            temp_piece = board[temp_index] & 7;
            while (temp_index % 10 > 0 && temp_piece == 0) {
                temp_index--;
                temp_piece = board[temp_index] & 7;
            }
            if (temp_index % 10 > 0 && (temp_piece == 4 || temp_piece == 5)) {
                temp_color = (board[temp_index] >> 3) & 1;
                if (temp_color == 1) {
                    board[1] = 2;
                    return;
                }
            }
            temp_index = board[2] + 1;
            temp_piece = board[temp_index] & 7;
            while (temp_index % 10 < 9 && temp_piece == 0) {
                temp_index++;
                temp_piece = board[temp_index] & 7;
            }
            if (temp_index % 10 < 9 && (temp_piece == 4 || temp_piece == 5)) {
                temp_color = (board[temp_index] >> 3) & 1;
                if (temp_color == 1) {
                    board[1] = 2;
                    return;
                }
            }
            temp_index = board[2] - 11;
            temp_piece = board[temp_index] & 7;
            while (temp_index > 20 && temp_index % 10 > 0 && temp_piece == 0) {
                temp_index -= 11;
                temp_piece = board[temp_index] & 7;
            }
            if (temp_index == board[2] - 11 && temp_index > 20 && temp_index % 10 > 0 && temp_piece == 1) {
                temp_color = (board[temp_index] >> 3) & 1;
                if (temp_color == 1) {
                    board[1] = 2;
                    return;
                }
            } else if (temp_index > 20 && temp_index % 10 > 0 && (temp_piece == 3 || temp_piece == 5)) {
                temp_color = (board[temp_index] >> 3) & 1;
                if (temp_color == 1) {
                    board[1] = 2;
                    return;
                }
            }
            temp_index = board[2] - 9;
            temp_piece = board[temp_index] & 7;
            while (temp_index > 20 && temp_index % 10 < 9 && temp_piece == 0) {
                temp_index -= 9;
                temp_piece = board[temp_index] & 7;
            }
            if (temp_index == board[2] - 9 && temp_index > 20 && temp_index % 10 < 9 && temp_piece == 1) {
                temp_color = (board[temp_index] >> 3) & 1;
                if (temp_color == 1) {
                    board[1] = 2;
                    return;
                }
            } else if (temp_index > 20 && temp_index % 10 < 9 && (temp_piece == 3 || temp_piece == 5)) {
                temp_color = (board[temp_index] >> 3) & 1;
                if (temp_color == 1) {
                    board[1] = 2;
                    return;
                }
            }
            temp_index = board[2] + 9;
            temp_piece = board[temp_index] & 7;
            while (temp_index < 100 && temp_index % 10 > 0 && temp_piece == 0) {
                temp_index += 9;
                temp_piece = board[temp_index] & 7;
            }
            if (temp_index < 100 && temp_index % 10 > 0 && (temp_piece == 3 || temp_piece == 5)) {
                temp_color = (board[temp_index] >> 3) & 1;
                if (temp_color == 1) {
                    board[1] = 2;
                    return;
                }
            }
            temp_index = board[2] + 11;
            temp_piece = board[temp_index] & 7;
            while (temp_index < 100 && temp_index % 10 < 9 && temp_piece == 0) {
                temp_index += 11;
                temp_piece = board[temp_index] & 7;
            }
            if (temp_index < 100 && temp_index % 10 < 9 && (temp_piece == 3 || temp_piece == 5)) {
                temp_color = (board[temp_index] >> 3) & 1;
                if (temp_color == 1) {
                    board[1] = 2;
                    return;
                }
            }
            temp_index = board[2] - 21;
            if (temp_index > 20 && temp_index < 100 && temp_index % 10 > 0 && temp_index % 10 < 9) {
                temp_piece = board[temp_index] & 7;
                if (temp_piece == 2) {
                    temp_color = (board[temp_index] >> 3) & 1;
                    if (temp_color == 1) {
                        board[1] = 2;
                        return;
                    }
                }
            }
            temp_index = board[2] - 19;
            if (temp_index > 20 && temp_index < 100 && temp_index % 10 > 0 && temp_index % 10 < 9) {
                temp_piece = board[temp_index] & 7;
                if (temp_piece == 2) {
                    temp_color = (board[temp_index] >> 3) & 1;
                    if (temp_color == 1) {
                        board[1] = 2;
                        return;
                    }
                }
            }
            temp_index = board[2] - 12;
            if (temp_index > 20 && temp_index < 100 && temp_index % 10 > 0 && temp_index % 10 < 9) {
                temp_piece = board[temp_index] & 7;
                if (temp_piece == 2) {
                    temp_color = (board[temp_index] >> 3) & 1;
                    if (temp_color == 1) {
                        board[1] = 2;
                        return;
                    }
                }
            }
            temp_index = board[2] - 8;
            if (temp_index > 20 && temp_index < 100 && temp_index % 10 > 0 && temp_index % 10 < 9) {
                temp_piece = board[temp_index] & 7;
                if (temp_piece == 2) {
                    temp_color = (board[temp_index] >> 3) & 1;
                    if (temp_color == 1) {
                        board[1] = 2;
                        return;
                    }
                }
            }
            temp_index = board[2] + 21;
            if (temp_index > 20 && temp_index < 100 && temp_index % 10 > 0 && temp_index % 10 < 9) {
                temp_piece = board[temp_index] & 7;
                if (temp_piece == 2) {
                    temp_color = (board[temp_index] >> 3) & 1;
                    if (temp_color == 1) {
                        board[1] = 2;
                        return;
                    }
                }
            }
            temp_index = board[2] + 19;
            if (temp_index > 20 && temp_index < 100 && temp_index % 10 > 0 && temp_index % 10 < 9) {
                temp_piece = board[temp_index] & 7;
                if (temp_piece == 2) {
                    temp_color = (board[temp_index] >> 3) & 1;
                    if (temp_color == 1) {
                        board[1] = 2;
                        return;
                    }
                }
            }
            temp_index = board[2] + 12;
            if (temp_index > 20 && temp_index < 100 && temp_index % 10 > 0 && temp_index % 10 < 9) {
                temp_piece = board[temp_index] & 7;
                if (temp_piece == 2) {
                    temp_color = (board[temp_index] >> 3) & 1;
                    if (temp_color == 1) {
                        board[1] = 2;
                        return;
                    }
                }
            }
            temp_index = board[2] + 8;
            if (temp_index > 20 && temp_index < 100 && temp_index % 10 > 0 && temp_index % 10 < 9) {
                temp_piece = board[temp_index] & 7;
                if (temp_piece == 2) {
                    temp_color = (board[temp_index] >> 3) & 1;
                    if (temp_color == 1) {
                        board[1] = 2;
                        return;
                    }
                }
            }
        }
    }

    function isValid(board, from, to) {
        var temp = board[to];
        var old_check = board[1], old_wi = board[2], old_bi = board[3];
        board[to] = board[from];
        board[from] = 0;
        if (from == board[2]) {
            board[2] = to;
        } else if (from == board[3]) {
            board[3] = to;
        }
        board[0]++;
        check(board);
        board[from] = board[to];
        board[to] = temp;
        board[2] = old_wi;
        board[3] = old_bi;
        board[0]--;
        if (board[1] == 0) {
            board[1] = old_check;
            return true;
        } else if (board[0] % 2 == 0 && board[1] == 1) {
            board[1] = old_check;
            return true;
        } else if (board[0] % 2 == 1 && board[1] == 2) {
            board[1] = old_check;
            return true;
        }
        board[1] = old_check;
        return false;
    }

    function possible_moves(board) {
        var result = [];
        var temp, temp_piece, temp_color, temp_moved;
        if (board[0] % 2 == 1) {                                                //black to move
            for (var i = 21; i < 99; i++) {
                if (i % 10 == 0 || i % 10 == 9) {
                    continue;
                }
                var piece = board[i] & 7;
                if (piece == 0) {
                    continue;
                }
                var color = (board[i] >> 3) & 1;
                if (color == 0) {
                    continue;
                }
                if (piece == 1) {                                               //pawn
                    if (board[i + 10] == 0) {
                        if (isValid(board, i, i + 10)) {
                            result.push(i, i + 10);
                        }
                        if (i < 40 && board[i + 20] == 0) {
                            if (isValid(board, i, i + 20)) {
                                result.push(i, i + 20);
                            }
                        }
                    }
                    if (i % 10 > 1) {
                        temp_piece = board[i + 9] & 7;
                        temp_color = (board[i + 9] >> 3) & 1;
                        if (temp_piece > 0 && temp_color == 0 && isValid(board, i, i + 9)) {
                            result.push(i, i + 9);
                        }
                    }
                    if (i % 10 < 8) {
                        temp_piece = board[i + 11] & 7;
                        temp_color = (board[i + 11] >> 3) & 1;
                        if (temp_piece > 0 && temp_color == 0 && isValid(board, i, i + 11)) {
                            result.push(i, i + 11);
                        }
                    }
                    // if (i > 60 && i < 70) {
                    //     if (board[4] + 1 == i % 10) {
                    //         if (isValid(board, i, i + 9)) {
                    //             result.push(i, i + 9);
                    //         }
                    //     }
                    //     if (board[4] - 1 == i % 10) {
                    //         if (isValid(board, i, i + 11)) {
                    //             result.push(i, i + 11);
                    //         }
                    //     }
                    // }
                } else if (piece == 2) {                                        //knight
                    temp = i - 21;
                    if (temp > 20 && temp % 10 > 0) {
                        temp_piece = board[temp] & 7;
                        temp_color = (board[temp] >> 3) & 1;
                        if (temp_piece == 0 || temp_color == 0) {
                            if (isValid(board, i, temp)) {
                                result.push(i, temp);
                            }
                        }
                    }
                    temp = i - 19;
                    if (temp > 20 && temp % 10 < 9) {
                        temp_piece = board[temp] & 7;
                        temp_color = (board[temp] >> 3) & 1;
                        if (temp_piece == 0 || temp_color == 0) {
                            if (isValid(board, i, temp)) {
                                result.push(i, temp);
                            }
                        }
                    }
                    temp = i - 12;
                    if (temp > 20 && temp % 10 > 0 && temp % 10 < 9) {
                        temp_piece = board[temp] & 7;
                        temp_color = (board[temp] >> 3) & 1;
                        if (temp_piece == 0 || temp_color == 0) {
                            if (isValid(board, i, temp)) {
                                result.push(i, temp);
                            }
                        }
                    }
                    temp = i - 8;
                    if (temp > 20 && temp % 10 > 0 && temp % 10 < 9) {
                        temp_piece = board[temp] & 7;
                        temp_color = (board[temp] >> 3) & 1;
                        if (temp_piece == 0 || temp_color == 0) {
                            if (isValid(board, i, temp)) {
                                result.push(i, temp);
                            }
                        }
                    }
                    temp = i + 8;
                    if (temp < 100 && temp % 10 > 0 && temp % 10 < 9) {
                        temp_piece = board[temp] & 7;
                        temp_color = (board[temp] >> 3) & 1;
                        if (temp_piece == 0 || temp_color == 0) {
                            if (isValid(board, i, temp)) {
                                result.push(i, temp);
                            }
                        }
                    }
                    temp = i + 12;
                    if (temp < 100 && temp % 10 > 0 && temp % 10 < 9) {
                        temp_piece = board[temp] & 7;
                        temp_color = (board[temp] >> 3) & 1;
                        if (temp_piece == 0 || temp_color == 0) {
                            if (isValid(board, i, temp)) {
                                result.push(i, temp);
                            }
                        }
                    }
                    temp = i + 19;
                    if (temp < 100 && temp % 10 > 0) {
                        temp_piece = board[temp] & 7;
                        temp_color = (board[temp] >> 3) & 1;
                        if (temp_piece == 0 || temp_color == 0) {
                            if (isValid(board, i, temp)) {
                                result.push(i, temp);
                            }
                        }
                    }
                    temp = i + 21;
                    if (temp < 100 && temp % 10 < 9) {
                        temp_piece = board[temp] & 7;
                        temp_color = (board[temp] >> 3) & 1;
                        if (temp_piece == 0 || temp_color == 0) {
                            if (isValid(board, i, temp)) {
                                result.push(i, temp);
                            }
                        }
                    }
                } else if (piece == 3) {                                        //bishop
                    temp = i - 11;
                    while (temp > 20 && temp % 10 > 0) {
                        temp_piece = board[temp] & 7;
                        temp_color = (board[temp] >> 3) & 1;
                        if (temp_piece == 0) {
                            if (isValid(board, i, temp)) {
                                result.push(i, temp);
                            }
                        } else {
                            if (temp_color == 0 && isValid(board, i, temp)) {
                                result.push(i, temp);
                            }
                            break;
                        }
                        temp -= 11;
                    }
                    temp = i - 9;
                    while (temp > 20 && temp % 10 < 9) {
                        temp_piece = board[temp] & 7;
                        temp_color = (board[temp] >> 3) & 1;
                        if (temp_piece == 0) {
                            if (isValid(board, i, temp)) {
                                result.push(i, temp);
                            }
                        } else {
                            if (temp_color == 0 && isValid(board, i, temp)) {
                                result.push(i, temp);
                            }
                            break;
                        }
                        temp -= 9;
                    }
                    temp = i + 9;
                    while (temp < 100 && temp % 10 > 0) {
                        temp_piece = board[temp] & 7;
                        temp_color = (board[temp] >> 3) & 1;
                        if (temp_piece == 0) {
                            if (isValid(board, i, temp)) {
                                result.push(i, temp);
                            }
                        } else {
                            if (temp_color == 0 && isValid(board, i, temp)) {
                                result.push(i, temp);
                            }
                            break;
                        }
                        temp += 9;
                    }
                    temp = i + 11;
                    while (temp < 100 && temp % 10 < 9) {
                        temp_piece = board[temp] & 7;
                        temp_color = (board[temp] >> 3) & 1;
                        if (temp_piece == 0) {
                            if (isValid(board, i, temp)) {
                                result.push(i, temp);
                            }
                        } else {
                            if (temp_color == 0 && isValid(board, i, temp)) {
                                result.push(i, temp);
                            }
                            break;
                        }
                        temp += 11;
                    }
                } else if (piece == 4) {                                        //rook
                    temp = i - 10;
                    while (temp > 20) {
                        temp_piece = board[temp] & 7;
                        temp_color = (board[temp] >> 3) & 1;
                        if (temp_piece == 0) {
                            if (isValid(board, i, temp)) {
                                result.push(i, temp);
                            }
                        } else {
                            if (temp_color == 0 && isValid(board, i, temp)) {
                                result.push(i, temp);
                            }
                            break;
                        }
                        temp -= 10;
                    }
                    temp = i + 10;
                    while (temp < 100) {
                        temp_piece = board[temp] & 7;
                        temp_color = (board[temp] >> 3) & 1;
                        if (temp_piece == 0) {
                            if (isValid(board, i, temp)) {
                                result.push(i, temp);
                            }
                        } else {
                            if (temp_color == 0 && isValid(board, i, temp)) {
                                result.push(i, temp);
                            }
                            break;
                        }
                        temp += 10;
                    }
                    temp = i - 1;
                    while (temp % 10 > 0) {
                        temp_piece = board[temp] & 7;
                        temp_color = (board[temp] >> 3) & 1;
                        if (temp_piece == 0) {
                            if (isValid(board, i, temp)) {
                                result.push(i, temp);
                            }
                        } else {
                            if (temp_color == 0 && isValid(board, i, temp)) {
                                result.push(i, temp);
                            }
                            break;
                        }
                        temp--;
                    }
                    temp = i + 1;
                    while (temp % 10 < 9) {
                        temp_piece = board[temp] & 7;
                        temp_color = (board[temp] >> 3) & 1;
                        if (temp_piece == 0) {
                            if (isValid(board, i, temp)) {
                                result.push(i, temp);
                            }
                        } else {
                            if (temp_color == 0 && isValid(board, i, temp)) {
                                result.push(i, temp);
                            }
                            break;
                        }
                        temp++;
                    }
                } else if (piece == 5) {                                        //queen
                    temp = i - 11;
                    while (temp > 20 && temp % 10 > 0) {
                        temp_piece = board[temp] & 7;
                        temp_color = (board[temp] >> 3) & 1;
                        if (temp_piece == 0) {
                            if (isValid(board, i, temp)) {
                                result.push(i, temp);
                            }
                        } else {
                            if (temp_color == 0 && isValid(board, i, temp)) {
                                result.push(i, temp);
                            }
                            break;
                        }
                        temp -= 11;
                    }
                    temp = i - 9;
                    while (temp > 20 && temp % 10 < 9) {
                        temp_piece = board[temp] & 7;
                        temp_color = (board[temp] >> 3) & 1;
                        if (temp_piece == 0) {
                            if (isValid(board, i, temp)) {
                                result.push(i, temp);
                            }
                        } else {
                            if (temp_color == 0 && isValid(board, i, temp)) {
                                result.push(i, temp);
                            }
                            break;
                        }
                        temp -= 9;
                    }
                    temp = i + 9;
                    while (temp < 100 && temp % 10 > 0) {
                        temp_piece = board[temp] & 7;
                        temp_color = (board[temp] >> 3) & 1;
                        if (temp_piece == 0) {
                            if (isValid(board, i, temp)) {
                                result.push(i, temp);
                            }
                        } else {
                            if (temp_color == 0 && isValid(board, i, temp)) {
                                result.push(i, temp);
                            }
                            break;
                        }
                        temp += 9;
                    }
                    temp = i + 11;
                    while (temp < 100 && temp % 10 < 9) {
                        temp_piece = board[temp] & 7;
                        temp_color = (board[temp] >> 3) & 1;
                        if (temp_piece == 0) {
                            if (isValid(board, i, temp)) {
                                result.push(i, temp);
                            }
                        } else {
                            if (temp_color == 0 && isValid(board, i, temp)) {
                                result.push(i, temp);
                            }
                            break;
                        }
                        temp += 11;
                    }
                    temp = i - 10;
                    while (temp > 20) {
                        temp_piece = board[temp] & 7;
                        temp_color = (board[temp] >> 3) & 1;
                        if (temp_piece == 0) {
                            if (isValid(board, i, temp)) {
                                result.push(i, temp);
                            }
                        } else {
                            if (temp_color == 0 && isValid(board, i, temp)) {
                                result.push(i, temp);
                            }
                            break;
                        }
                        temp -= 10;
                    }
                    temp = i + 10;
                    while (temp < 100) {
                        temp_piece = board[temp] & 7;
                        temp_color = (board[temp] >> 3) & 1;
                        if (temp_piece == 0) {
                            if (isValid(board, i, temp)) {
                                result.push(i, temp);
                            }
                        } else {
                            if (temp_color == 0 && isValid(board, i, temp)) {
                                result.push(i, temp);
                            }
                            break;
                        }
                        temp += 10;
                    }
                    temp = i - 1;
                    while (temp % 10 > 0) {
                        temp_piece = board[temp] & 7;
                        temp_color = (board[temp] >> 3) & 1;
                        if (temp_piece == 0) {
                            if (isValid(board, i, temp)) {
                                result.push(i, temp);
                            }
                        } else {
                            if (temp_color == 0 && isValid(board, i, temp)) {
                                result.push(i, temp);
                            }
                            break;
                        }
                        temp--;
                    }
                    temp = i + 1;
                    while (temp % 10 < 9) {
                        temp_piece = board[temp] & 7;
                        temp_color = (board[temp] >> 3) & 1;
                        if (temp_piece == 0) {
                            if (isValid(board, i, temp)) {
                                result.push(i, temp);
                            }
                        } else {
                            if (temp_color == 0 && isValid(board, i, temp)) {
                                result.push(i, temp);
                            }
                            break;
                        }
                        temp++;
                    }
                } else if (piece == 6) {                                        //king
                    temp = i - 10;
                    if (temp > 20) {
                        temp_piece = board[temp] & 7;
                        temp_color = (board[temp] >> 3) & 1;
                        if (temp_piece == 0 || temp_color == 0) {
                            if (isValid(board, i, temp)) {
                                result.push(i, temp);
                            }
                        }
                    }
                    temp = i + 10;
                    if (temp < 100) {
                        temp_piece = board[temp] & 7;
                        temp_color = (board[temp] >> 3) & 1;
                        if (temp_piece == 0 || temp_color == 0) {
                            if (isValid(board, i, temp)) {
                                result.push(i, temp);
                            }
                        }
                    }
                    temp = i - 11;
                    if (temp > 20 && temp % 10 > 0) {
                        temp_piece = board[temp] & 7;
                        temp_color = (board[temp] >> 3) & 1;
                        if (temp_piece == 0 || temp_color == 0) {
                            if (isValid(board, i, temp)) {
                                result.push(i, temp);
                            }
                        }
                    }
                    temp = i - 9;
                    if (temp > 20 && temp % 10 < 9) {
                        temp_piece = board[temp] & 7;
                        temp_color = (board[temp] >> 3) & 1;
                        if (temp_piece == 0 || temp_color == 0) {
                            if (isValid(board, i, temp)) {
                                result.push(i, temp);
                            }
                        }
                    }
                    temp = i + 9;
                    if (temp < 100 && temp % 10 > 0) {
                        temp_piece = board[temp] & 7;
                        temp_color = (board[temp] >> 3) & 1;
                        if (temp_piece == 0 || temp_color == 0) {
                            if (isValid(board, i, temp)) {
                                result.push(i, temp);
                            }
                        }
                    }
                    temp = i + 11;
                    if (temp < 100 && temp % 10 < 9) {
                        temp_piece = board[temp] & 7;
                        temp_color = (board[temp] >> 3) & 1;
                        if (temp_piece == 0 || temp_color == 0) {
                            if (isValid(board, i, temp)) {
                                result.push(i, temp);
                            }
                        }
                    }
                    var castle_left = false, castle_right = false;
                    temp = i - 1;
                    if (temp % 10 > 0) {
                        temp_piece = board[temp] & 7;
                        temp_color = (board[temp] >> 3) & 1;
                        if (temp_piece == 0 || temp_color == 0) {
                            if (isValid(board, i, temp)) {
                                result.push(i, temp);
                                castle_left = true;
                            }
                        }
                    }
                    temp = i + 1;
                    if (temp % 10 < 9) {
                        temp_piece = board[temp] & 7;
                        temp_color = (board[temp] >> 3) & 1;
                        if (temp_piece == 0 || temp_color == 0) {
                            if (isValid(board, i, temp)) {
                                result.push(i, temp);
                                castle_right = true;
                            }
                        }
                    }
                    temp_moved = (board[i] >> 4) & 1;
                    if (temp_moved == 0 && board[1] == 0) {
                        if (castle_left) {
                            temp_piece = board[i - 2] & 7;
                            if (temp_piece == 0) {
                                if (i % 10 == 4) {
                                    temp_piece = board[i - 3] & 7;
                                    temp_color = (board[i - 3] >> 3) & 1;
                                    temp_moved = (board[i - 3] >> 4) & 1;
                                    if (temp_piece == 4 && temp_color == 1 && temp_moved == 0 && isValid(board, i, i - 2)) {
                                        result.push(i, i - 2);
                                    }
                                } else {
                                    temp_piece = board[i - 3] & 7;
                                    if (temp_piece == 0) {
                                        temp_piece = board[i - 4] & 7;
                                        temp_color = (board[i - 4] >> 3) & 1;
                                        temp_moved = (board[i - 4] >> 4) & 1;
                                        if (temp_piece == 4 && temp_color == 1 && temp_moved == 0 && isValid(board, i, i - 2)) {
                                            result.push(i, i - 2);
                                        }
                                    }
                                }
                            }
                        }
                        if (castle_right) {
                            temp_piece = board[i + 2] & 7;
                            if (temp_piece == 0) {
                                if (i % 10 == 5) {
                                    temp_piece = board[i + 3] & 7;
                                    temp_color = (board[i + 3] >> 3) & 1;
                                    temp_moved = (board[i + 3] >> 4) & 1;
                                    if (temp_piece == 4 && temp_color == 1 && temp_moved == 0 && isValid(board, i, i + 2)) {
                                        result.push(i, i + 2);
                                    }
                                } else {
                                    temp_piece = board[i + 3] & 7;
                                    if (temp_piece == 0) {
                                        temp_piece = board[i + 4] & 7;
                                        temp_color = (board[i + 4] >> 3) & 1;
                                        temp_moved = (board[i + 4] >> 4) & 1;
                                        if (temp_piece == 4 && temp_color == 1 && temp_moved == 0 && isValid(board, i, i + 2)) {
                                            result.push(i, i + 2);
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        } else {                                                                //white to move
            for (var i = 21; i < 99; i++) {
                if (i % 10 == 0 || i % 10 == 9) {
                    continue;
                }
                var piece = board[i] & 7;
                if (piece == 0) {
                    continue;
                }
                var color = (board[i] >> 3) & 1;
                if (color == 1) {
                    continue;
                }
                if (piece == 1) {                                               //pawn
                    if (board[i - 10] == 0) {
                        if (isValid(board, i, i - 10)) {
                            result.push(i, i - 10);
                        }
                        if (i > 80 && board[i - 20] == 0) {
                            if (isValid(board, i, i - 20)) {
                                result.push(i, i - 20);
                            }
                        }
                    }
                    if (i % 10 > 1) {
                        temp_piece = board[i - 11] & 7;
                        temp_color = (board[i - 11] >> 3) & 1;
                        if (temp_piece > 0 && temp_color == 1 && isValid(board, i, i - 11)) {
                            result.push(i, i - 11);
                        }
                    }
                    if (i % 10 < 8) {
                        temp_piece = board[i - 9] & 7;
                        temp_color = (board[i - 9] >> 3) & 1;
                        if (temp_piece > 0 && temp_color == 1 && isValid(board, i, i - 9)) {
                            result.push(i, i - 9);
                        }
                    }
                    // if (i > 50 && i < 60) {
                    //     if (board[5] + 1 == i % 10) {
                    //         if (isValid(board, i, i - 11)) {
                    //             result.push(i, i - 11);
                    //         }
                    //     }
                    //     if (board[5] - 1 == i % 10) {
                    //         if (isValid(board, i, i - 9)) {
                    //             result.push(i, i - 9);
                    //         }
                    //     }
                    // }
                } else if (piece == 2) {                                        //knight
                    temp = i - 21;
                    if (temp > 20 && temp % 10 > 0) {
                        temp_piece = board[temp] & 7;
                        temp_color = (board[temp] >> 3) & 1;
                        if (temp_piece == 0 || temp_color == 1) {
                            if (isValid(board, i, temp)) {
                                result.push(i, temp);
                            }
                        }
                    }
                    temp = i - 19;
                    if (temp > 20 && temp % 10 < 9) {
                        temp_piece = board[temp] & 7;
                        temp_color = (board[temp] >> 3) & 1;
                        if (temp_piece == 0 || temp_color == 1) {
                            if (isValid(board, i, temp)) {
                                result.push(i, temp);
                            }
                        }
                    }
                    temp = i - 12;
                    if (temp > 20 && temp % 10 > 0 && temp % 10 < 9) {
                        temp_piece = board[temp] & 7;
                        temp_color = (board[temp] >> 3) & 1;
                        if (temp_piece == 0 || temp_color == 1) {
                            if (isValid(board, i, temp)) {
                                result.push(i, temp);
                            }
                        }
                    }
                    temp = i - 8;
                    if (temp > 20 && temp % 10 > 0 && temp % 10 < 9) {
                        temp_piece = board[temp] & 7;
                        temp_color = (board[temp] >> 3) & 1;
                        if (temp_piece == 0 || temp_color == 1) {
                            if (isValid(board, i, temp)) {
                                result.push(i, temp);
                            }
                        }
                    }
                    temp = i + 8;
                    if (temp < 100 && temp % 10 > 0 && temp % 10 < 9) {
                        temp_piece = board[temp] & 7;
                        temp_color = (board[temp] >> 3) & 1;
                        if (temp_piece == 0 || temp_color == 1) {
                            if (isValid(board, i, temp)) {
                                result.push(i, temp);
                            }
                        }
                    }
                    temp = i + 12;
                    if (temp < 100 && temp % 10 > 0 && temp % 10 < 9) {
                        temp_piece = board[temp] & 7;
                        temp_color = (board[temp] >> 3) & 1;
                        if (temp_piece == 0 || temp_color == 1) {
                            if (isValid(board, i, temp)) {
                                result.push(i, temp);
                            }
                        }
                    }
                    temp = i + 19;
                    if (temp < 100 && temp % 10 > 0) {
                        temp_piece = board[temp] & 7;
                        temp_color = (board[temp] >> 3) & 1;
                        if (temp_piece == 0 || temp_color == 1) {
                            if (isValid(board, i, temp)) {
                                result.push(i, temp);
                            }
                        }
                    }
                    temp = i + 21;
                    if (temp < 100 && temp % 10 < 9) {
                        temp_piece = board[temp] & 7;
                        temp_color = (board[temp] >> 3) & 1;
                        if (temp_piece == 0 || temp_color == 1) {
                            if (isValid(board, i, temp)) {
                                result.push(i, temp);
                            }
                        }
                    }
                } else if (piece == 3) {                                        //bishop
                    temp = i - 11;
                    while (temp > 20 && temp % 10 > 0) {
                        temp_piece = board[temp] & 7;
                        temp_color = (board[temp] >> 3) & 1;
                        if (temp_piece == 0) {
                            if (isValid(board, i, temp)) {
                                result.push(i, temp);
                            }
                        } else {
                            if (temp_color == 1 && isValid(board, i, temp)) {
                                result.push(i, temp);
                            }
                            break;
                        }
                        temp -= 11;
                    }
                    temp = i - 9;
                    while (temp > 20 && temp % 10 < 9) {
                        temp_piece = board[temp] & 7;
                        temp_color = (board[temp] >> 3) & 1;
                        if (temp_piece == 0) {
                            if (isValid(board, i, temp)) {
                                result.push(i, temp);
                            }
                        } else {
                            if (temp_color == 1 && isValid(board, i, temp)) {
                                result.push(i, temp);
                            }
                            break;
                        }
                        temp -= 9;
                    }
                    temp = i + 9;
                    while (temp < 100 && temp % 10 > 0) {
                        temp_piece = board[temp] & 7;
                        temp_color = (board[temp] >> 3) & 1;
                        if (temp_piece == 0) {
                            if (isValid(board, i, temp)) {
                                result.push(i, temp);
                            }
                        } else {
                            if (temp_color == 1 && isValid(board, i, temp)) {
                                result.push(i, temp);
                            }
                            break;
                        }
                        temp += 9;
                    }
                    temp = i + 11;
                    while (temp < 100 && temp % 10 < 9) {
                        temp_piece = board[temp] & 7;
                        temp_color = (board[temp] >> 3) & 1;
                        if (temp_piece == 0) {
                            if (isValid(board, i, temp)) {
                                result.push(i, temp);
                            }
                        } else {
                            if (temp_color == 1 && isValid(board, i, temp)) {
                                result.push(i, temp);
                            }
                            break;
                        }
                        temp += 11;
                    }
                } else if (piece == 4) {                                        //rook
                    temp = i - 10;
                    while (temp > 20) {
                        temp_piece = board[temp] & 7;
                        temp_color = (board[temp] >> 3) & 1;
                        if (temp_piece == 0) {
                            if (isValid(board, i, temp)) {
                                result.push(i, temp);
                            }
                        } else {
                            if (temp_color == 1 && isValid(board, i, temp)) {
                                result.push(i, temp);
                            }
                            break;
                        }
                        temp -= 10;
                    }
                    temp = i + 10;
                    while (temp < 100) {
                        temp_piece = board[temp] & 7;
                        temp_color = (board[temp] >> 3) & 1;
                        if (temp_piece == 0) {
                            if (isValid(board, i, temp)) {
                                result.push(i, temp);
                            }
                        } else {
                            if (temp_color == 1 && isValid(board, i, temp)) {
                                result.push(i, temp);
                            }
                            break;
                        }
                        temp += 10;
                    }
                    temp = i - 1;
                    while (temp % 10 > 0) {
                        temp_piece = board[temp] & 7;
                        temp_color = (board[temp] >> 3) & 1;
                        if (temp_piece == 0) {
                            if (isValid(board, i, temp)) {
                                result.push(i, temp);
                            }
                        } else {
                            if (temp_color == 1 && isValid(board, i, temp)) {
                                result.push(i, temp);
                            }
                            break;
                        }
                        temp--;
                    }
                    temp = i + 1;
                    while (temp % 10 < 9) {
                        temp_piece = board[temp] & 7;
                        temp_color = (board[temp] >> 3) & 1;
                        if (temp_piece == 0) {
                            if (isValid(board, i, temp)) {
                                result.push(i, temp);
                            }
                        } else {
                            if (temp_color == 1 && isValid(board, i, temp)) {
                                result.push(i, temp);
                            }
                            break;
                        }
                        temp++;
                    }
                } else if (piece == 5) {                                        //queen
                    temp = i - 11;
                    while (temp > 20 && temp % 10 > 0) {
                        temp_piece = board[temp] & 7;
                        temp_color = (board[temp] >> 3) & 1;
                        if (temp_piece == 0) {
                            if (isValid(board, i, temp)) {
                                result.push(i, temp);
                            }
                        } else {
                            if (temp_color == 1 && isValid(board, i, temp)) {
                                result.push(i, temp);
                            }
                            break;
                        }
                        temp -= 11;
                    }
                    temp = i - 9;
                    while (temp > 20 && temp % 10 < 9) {
                        temp_piece = board[temp] & 7;
                        temp_color = (board[temp] >> 3) & 1;
                        if (temp_piece == 0) {
                            if (isValid(board, i, temp)) {
                                result.push(i, temp);
                            }
                        } else {
                            if (temp_color == 1 && isValid(board, i, temp)) {
                                result.push(i, temp);
                            }
                            break;
                        }
                        temp -= 9;
                    }
                    temp = i + 9;
                    while (temp < 100 && temp % 10 > 0) {
                        temp_piece = board[temp] & 7;
                        temp_color = (board[temp] >> 3) & 1;
                        if (temp_piece == 0) {
                            if (isValid(board, i, temp)) {
                                result.push(i, temp);
                            }
                        } else {
                            if (temp_color == 1 && isValid(board, i, temp)) {
                                result.push(i, temp);
                            }
                            break;
                        }
                        temp += 9;
                    }
                    temp = i + 11;
                    while (temp < 100 && temp % 10 < 9) {
                        temp_piece = board[temp] & 7;
                        temp_color = (board[temp] >> 3) & 1;
                        if (temp_piece == 0) {
                            if (isValid(board, i, temp)) {
                                result.push(i, temp);
                            }
                        } else {
                            if (temp_color == 1 && isValid(board, i, temp)) {
                                result.push(i, temp);
                            }
                            break;
                        }
                        temp += 11;
                    }
                    temp = i - 10;
                    while (temp > 20) {
                        temp_piece = board[temp] & 7;
                        temp_color = (board[temp] >> 3) & 1;
                        if (temp_piece == 0) {
                            if (isValid(board, i, temp)) {
                                result.push(i, temp);
                            }
                        } else {
                            if (temp_color == 1 && isValid(board, i, temp)) {
                                result.push(i, temp);
                            }
                            break;
                        }
                        temp -= 10;
                    }
                    temp = i + 10;
                    while (temp < 100) {
                        temp_piece = board[temp] & 7;
                        temp_color = (board[temp] >> 3) & 1;
                        if (temp_piece == 0) {
                            if (isValid(board, i, temp)) {
                                result.push(i, temp);
                            }
                        } else {
                            if (temp_color == 1 && isValid(board, i, temp)) {
                                result.push(i, temp);
                            }
                            break;
                        }
                        temp += 10;
                    }
                    temp = i - 1;
                    while (temp % 10 > 0) {
                        temp_piece = board[temp] & 7;
                        temp_color = (board[temp] >> 3) & 1;
                        if (temp_piece == 0) {
                            if (isValid(board, i, temp)) {
                                result.push(i, temp);
                            }
                        } else {
                            if (temp_color == 1 && isValid(board, i, temp)) {
                                result.push(i, temp);
                            }
                            break;
                        }
                        temp--;
                    }
                    temp = i + 1;
                    while (temp % 10 < 9) {
                        temp_piece = board[temp] & 7;
                        temp_color = (board[temp] >> 3) & 1;
                        if (temp_piece == 0) {
                            if (isValid(board, i, temp)) {
                                result.push(i, temp);
                            }
                        } else {
                            if (temp_color == 1 && isValid(board, i, temp)) {
                                result.push(i, temp);
                            }
                            break;
                        }
                        temp++;
                    }
                } else if (piece == 6) {                                        //king
                    temp = i - 10;
                    if (temp > 20) {
                        temp_piece = board[temp] & 7;
                        temp_color = (board[temp] >> 3) & 1;
                        if (temp_piece == 0 || temp_color == 1) {
                            if (isValid(board, i, temp)) {
                                result.push(i, temp);
                            }
                        }
                    }
                    temp = i + 10;
                    if (temp < 100) {
                        temp_piece = board[temp] & 7;
                        temp_color = (board[temp] >> 3) & 1;
                        if (temp_piece == 0 || temp_color == 1) {
                            if (isValid(board, i, temp)) {
                                result.push(i, temp);
                            }
                        }
                    }
                    temp = i - 11;
                    if (temp > 20 && temp % 10 > 0) {
                        temp_piece = board[temp] & 7;
                        temp_color = (board[temp] >> 3) & 1;
                        if (temp_piece == 0 || temp_color == 1) {
                            if (isValid(board, i, temp)) {
                                result.push(i, temp);
                            }
                        }
                    }
                    temp = i - 9;
                    if (temp > 20 && temp % 10 < 9) {
                        temp_piece = board[temp] & 7;
                        temp_color = (board[temp] >> 3) & 1;
                        if (temp_piece == 0 || temp_color == 1) {
                            if (isValid(board, i, temp)) {
                                result.push(i, temp);
                            }
                        }
                    }
                    temp = i + 9;
                    if (temp < 100 && temp % 10 > 0) {
                        temp_piece = board[temp] & 7;
                        temp_color = (board[temp] >> 3) & 1;
                        if (temp_piece == 0 || temp_color == 1) {
                            if (isValid(board, i, temp)) {
                                result.push(i, temp);
                            }
                        }
                    }
                    temp = i + 11;
                    if (temp < 100 && temp % 10 < 9) {
                        temp_piece = board[temp] & 7;
                        temp_color = (board[temp] >> 3) & 1;
                        if (temp_piece == 0 || temp_color == 1) {
                            if (isValid(board, i, temp)) {
                                result.push(i, temp);
                            }
                        }
                    }
                    var castle_left = false, castle_right = false;
                    temp = i - 1;
                    if (temp % 10 > 0) {
                        temp_piece = board[temp] & 7;
                        temp_color = (board[temp] >> 3) & 1;
                        if (temp_piece == 0 || temp_color == 1) {
                            if (isValid(board, i, temp)) {
                                result.push(i, temp);
                                castle_left = true;
                            }
                        }
                    }
                    temp = i + 1;
                    if (temp % 10 < 9) {
                        temp_piece = board[temp] & 7;
                        temp_color = (board[temp] >> 3) & 1;
                        if (temp_piece == 0 || temp_color == 1) {
                            if (isValid(board, i, temp)) {
                                result.push(i, temp);
                                castle_right = true;
                            }
                        }
                    }                    
                    temp_moved = (board[i] >> 4) & 1;
                    if (temp_moved == 0 && board[1] == 0) {
                        if (castle_left) {
                            temp_piece = board[i - 2] & 7;
                            if (temp_piece == 0) {
                                if (i % 10 == 4) {
                                    temp_piece = board[i - 3] & 7;
                                    temp_color = (board[i - 3] >> 3) & 1;
                                    temp_moved = (board[i - 3] >> 4) & 1;
                                    if (temp_piece == 4 && temp_color == 0 && temp_moved == 0 && isValid(board, i, i - 2)) {
                                        result.push(i, i - 2);
                                    }
                                } else {
                                    temp_piece = board[i - 3] & 7;
                                    if (temp_piece == 0) {
                                        temp_piece = board[i - 4] & 7;
                                        temp_color = (board[i - 4] >> 3) & 1;
                                        temp_moved = (board[i - 4] >> 4) & 1;
                                        if (temp_piece == 4 && temp_color == 0 && temp_moved == 0 && isValid(board, i, i - 2)) {
                                            result.push(i, i - 2);
                                        }
                                    }
                                }
                            }
                        }
                        if (castle_right) {
                            temp_piece = board[i + 2] & 7;
                            if (temp_piece == 0) {
                                if (i % 10 == 5) {
                                    temp_piece = board[i + 3] & 7;
                                    temp_color = (board[i + 3] >> 3) & 1;
                                    temp_moved = (board[i + 3] >> 4) & 1;
                                    if (temp_piece == 4 && temp_color == 0 && temp_moved == 0 && isValid(board, i, i + 2)) {
                                        result.push(i, i + 2);
                                    }
                                } else {
                                    temp_piece = board[i + 3] & 7;
                                    if (temp_piece == 0) {
                                        temp_piece = board[i + 4] & 7;
                                        temp_color = (board[i + 4] >> 3) & 1;
                                        temp_moved = (board[i + 4] >> 4) & 1;
                                        if (temp_piece == 4 && temp_color == 0 && temp_moved == 0 && isValid(board, i, i + 2)) {
                                            result.push(i, i + 2);
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        return result;
    }

    function update(board, from, to, actual) {
        var temp_piece = board[to] & 7;
        if (actual && temp_piece > 0) {
            board[4]--;
        }
        var from_loc = convert_board_to_loc(from), to_loc = convert_board_to_loc(to);
        if (board[0] % 2 == 1) {
            if (board[115] == to && board[116] == from) {
                board[119]++;
            } else {
                board[119] = 0;
            }
            board[115] = from;
            board[116] = to;
            if (temp_piece == 1) {
                board[5] += 10;
            } else if (temp_piece == 2 || temp_piece == 3) {
                board[5] += 30;
            } else if (temp_piece == 4) {
                board[5] += 50;
            } else if (temp_piece == 5) {
                board[5] += 90;
            } else if (temp_piece == 6) {
                board[5] += 1000;
            }
        } else {
            if (board[117] == to && board[118] == from) {
                board[119]++;
            } else {
                board[119] = 0;
            }
            board[117] = from;
            board[118] = to;
            if (temp_piece == 1) {
                board[5] -= 10 + weight_b_pawn[to_loc];
            } else if (temp_piece == 2) {
                board[5] -= 30 + weight_b_knight[to_loc];
            } else if (temp_piece == 3) {
                board[5] -= 30 + weight_b_bishop[to_loc];
            } else if (temp_piece == 4) {
                board[5] -= 50 + weight_b_rook[to_loc];
            } else if (temp_piece == 5) {
                board[5] -= 90 + weight_b_queen[to_loc];
            } else if (temp_piece == 6) {
                board[5] = -1000;
            }
        }
        board[to] = board[from];
        board[from] = 0;
        var castled = false, c_from, c_to;
        if (from == board[2]) {
            board[2] = to;
            if (from - 2 == to) {
                if (from % 10 == 4) {
                    board[from - 1] = board[to - 1];
                    board[to - 1] = 0;
                    c_to = to_loc - 1;
                } else {
                    board[from - 1] = board[to - 2];
                    board[to - 2] = 0;
                    c_to = to_loc - 2;
                }
                castled = true;
                c_from = from_loc - 1;
            } else if (from + 2 == to) {
                if (from % 10 == 5) {
                    board[from + 1] = board[to + 1];
                    board[to + 1] = 0;
                    c_to = to_loc + 1;
                } else {
                    board[from + 1] = board[to + 2];
                    board[to + 2] = 0;
                    c_to = to_loc + 2;
                }
                castled = true;
                c_from = from_loc + 1;
            }
        } else if (from == board[3]) {
            board[3] = to;
            if (from - 2 == to) {
                if (from % 10 == 4) {
                    board[from - 1] = board[to - 1];
                    board[to - 1] = 0;
                    c_to = to_loc - 1;
                } else {
                    board[from - 1] = board[to - 2];
                    board[to - 2] = 0;
                    c_to = to_loc - 2;
                }
                castled = true;
                c_from = from_loc - 1;
            } else if (from + 2 == to) {
                if (from % 10 == 5) {
                    board[from + 1] = board[to + 1];
                    board[to + 1] = 0;
                    c_to = to_loc + 1;
                } else {
                    board[from + 1] = board[to + 2];
                    board[to + 2] = 0;
                    c_to = to_loc + 2;
                }
                castled = true;
                c_from = from_loc + 1;
            }
        }
        temp_piece = board[to] & 7;
        if (temp_piece == 4 || temp_piece == 6) {
            var temp_moved = (board[to] >> 4) & 1;
            if (temp_moved == 0) {
                board[to] += 16;
            }
        }
        if (actual) {
            $(boardlocation[to_loc]).text($(boardlocation[from_loc]).text());
            $(boardlocation[from_loc]).text('');
            if (castled) {
                $(boardlocation[c_from]).text($(boardlocation[c_to]).text());
                $(boardlocation[c_to]).text('');
            }
        }
        if (board[0] % 2 == 1) {
            if (temp_piece == 1) {
                board[5] += weight_b_pawn[to_loc] - weight_b_pawn[from_loc];
                if (to > 90) {
                    board[to] += 4;
                    board[5] += 80 + weight_b_queen[to_loc];
                    if (actual) {
                        $(boardlocation[to_loc]).text(String.fromCharCode(9819));
                    }
                }
            } else if (temp_piece == 2) {
                board[5] += weight_b_knight[to_loc] - weight_b_knight[from_loc];
            } else if (temp_piece == 3) {
                board[5] += weight_b_bishop[to_loc] - weight_b_bishop[from_loc];
            } else if (temp_piece == 4) {
                board[5] += weight_b_rook[to_loc] - weight_b_rook[from_loc];
            } else if (temp_piece == 5) {
                board[5] += weight_b_queen[to_loc] - weight_b_queen[from_loc];
            } else if (temp_piece == 6) {
                board[5] += weight_b_king[to_loc] - weight_b_king[from_loc];
            }
        } else {
            if (temp_piece == 1) {
                if (to < 30) {
                    board[to] += 4;
                    board[5] -= 80;
                    if (actual) {
                        $(boardlocation[to_loc]).text(String.fromCharCode(9813));
                    }
                }
            }
        }
        check(board);
        board[0]++;
        if (actual) {
            delete_display(true);
            $prev_move_from = $(boardlocation[from_loc]).parent();
            $prev_move_to = $(boardlocation[to_loc]).parent();
            $prev_move_from.css("background-color", "#96ff96");
            $prev_move_to.css("background-color", "#96ff96");
            if (board[1] == 1) {
                $square[convert_board_to_loc(board[3])].style.backgroundColor = "#ff0000";
            } else if (board[1] == 2) {
                $square[convert_board_to_loc(board[2])].style.backgroundColor = "#ff0000";
            }
            moves = possible_moves(board);
            moves_size = moves.length;
            if (moves_size == 0 || board[4] < 3) {
                if (board[1] == 1) {
                    $('#analysis').text('Checkmate! You win!');
                } else if (board[1] == 2) {
                    $('#analysis').text('Checkmate! Computer wins!');
                } else {
                    $('#analysis').text('Draw!');
                }
                game_mode = 0;
            }
        }
    }

    function max_dfs(board, depth, alpha, beta) {
        if (depth == 0) {
            return [-1, -1, board[5]];
        }
        var temp_moves = possible_moves(board);
        var sz = temp_moves.length;
        var from = -1, to = -1, best_value = -10001;
        if (sz == 0) {
            if (board[1] == 1) {
                return [-1, -1, -10000];
            }
            return [-1, -1, 0];
        }
        for (var i = 0; i < sz; i += 2) {
            var next = board.slice();
            update(next, temp_moves[i], temp_moves[i + 1], false);
            var temp = min_dfs(next, depth - 1, alpha, beta);
            if (best_value < temp[2]) {
                from = temp_moves[i];
                to = temp_moves[i + 1];
                best_value = temp[2];
            }
            if (alpha < best_value) {
                alpha = best_value;
            }
            if (beta <= alpha) {
                break;
            }
        }
        return [from, to, best_value];
    }

    function min_dfs(board, depth, alpha, beta) {
        if (depth == 0) {
            return [-1, -1, board[5]];
        }
        var temp_moves = possible_moves(board);
        var sz = temp_moves.length;
        var from = -1, to = -1, best_value = 10001;
        if (sz == 0) {
            if (board[1] == 2) {
                return [-1, -1, 10000];
            }
            return [-1, -1, 0];
        }
        for (var i = 0; i < sz; i += 2) {
            var next = board.slice();
            update(next, temp_moves[i], temp_moves[i + 1], false);
            var temp = max_dfs(next, depth - 1, alpha, beta);
            if (best_value > temp[2]) {
                from = temp_moves[i];
                to = temp_moves[i + 1];
                best_value = temp[2];
            }
            if (beta > best_value) {
                beta = best_value;
            }
            if (beta <= alpha) {
                break;
            }
        }
        return [from, to, best_value];
    }

    function minimax() {
        var board = chessboard.slice();
        var search_depth = 4;
        if (board[4] < 11) {
            if (board[4] < 5) {
                search_depth = 8;
            } else {
                search_depth = 6;
            }
        }
        var st = new Date();
        var temp = max_dfs(board, search_depth, -10001, 10001);
        var et = new Date();
        while (et - st < 500) {
            search_depth++;
            temp = max_dfs(board, search_depth, -10001, 10001);
            et = new Date();
        }
        if (temp[2] < -500) {
            $('#analysis').text('Computer resigns! You win!');
            game_mode = 0;
            return;
        }
        $('#analysis').text(temp[2].toString());
        update(chessboard, temp[0], temp[1], true);
    }

    $('#play_2p').on('click', function() {
        game_mode = 0;
        resetBoard();
    });
    $('#play_ai').on('click', function() {
        game_mode = 2;
        resetBoard();
    });
    $square.on('click', function() {
        if (just_moved) {
            just_moved = false;
        } else {
            $clicked = $(this).children('p');
            if (display_on >= 0) {
                var old = display_on, current = $square.index(this);
                delete_display(false);
                if (old != current && $clicked.text().length != 0) {
                    display_on = current;
                    find_display();
                }
            } else {
                if ($clicked.text().length != 0) {
                    display_on = $square.index(this);
                    find_display();
                }
            }
        }
    });
    var $prev;
    var prev_bc;
    $arr_possible_move.mouseenter(function() {
        $prev = $(this).parent();
        prev_bc = $prev.css("background-color");
        $prev.css("background-color", "#90cc70");
    });
    $arr_possible_move.mouseleave(function() {
        $prev.css("background-color", prev_bc);
    });
    $arr_possible_move.on('click', function() {
        var index1 = convert_loc_to_board($arr_possible_move.index(this)), index2 = convert_loc_to_board(display_on);
        update(chessboard, index2, index1, true);
        just_moved = true;
        $prev = null;
    });

    function loop() {
        if (game_mode > 1) {
            if (chessboard[0] % 2 == 1) {
                minimax();
            }
        }
        setTimeout(loop, 10);
    }
    $(document).ready(function() {
        loop();
    });

    resetBoard();

});