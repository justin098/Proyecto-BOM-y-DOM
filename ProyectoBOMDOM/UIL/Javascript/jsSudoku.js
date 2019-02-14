function Sudoku(params) {
    var t = this;

    //this.INIT = 0;
    //this.RUNNING = 1;
    //this.END = 2;

    this.id = 'contenedor_sudoku';
    this.celdasFijas = 32;//Celdas con respuesta
    this.n = 3;//Número de columnas
    this.nn = this.n * this.n;//Número de celdas por lado
    this.totalCeldas = this.nn * this.nn; 

    if (this.celdasFijas < 10) this.celdasFijas = 10;
    if (this.celdasFijas > 70) this.celdasFijas = 70;

    this.init();

    //counter    
    setInterval(function () {
        t.timer();
    }, 1000);

    return this;
}

Sudoku.prototype.init = function () {
    this.status = this.INIT;
    this.celdasLlenas = 0;
    this.tablero = [];
    this.tableroSolucion = [];
    this.cell = null;
    //this.markNotes = 0;
    this.tiempoTranscurrido = 0;

    if (this.displayTitle == 0) {
        $('#titulo_sudoku').hide();
    }

    this.tablero = this.constructorTablero(this.n, this.celdasFijas);

    return this;
};

//Sudoku.prototype.timer = function () {
//    if (this.status === this.RUNNING) {
//        this.tiempoTranscurrido++;
//        $('.time').text('' + this.tiempoTranscurrido);
//    }
//};

/**
Sortea el arreglo
*/
Sudoku.prototype.shuffle = function (arreglo) {
    var indice = arreglo.length,
        valorTemporal = 0,
        indiceAleatorio = 0;

    while (0 !== indice) {
        indiceAleatorio = Math.floor(Math.random() * indice);
        indice -= 1;
        valorTemporal = arreglo[indice];
        arreglo[indice] = arreglo[indiceAleatorio];
        arreglo[indiceAleatorio] = valorTemporal;
    }

    return arreglo;
};

/*Genera la tabla del sudoku*/
Sudoku.prototype.constructorTablero = function (n, celdasFijas) {
    var matrix_fields = [],
        index = 0,
        i = 0,
        j = 0,
        j_start = 0,
        j_stop = 0;

    //generate solution
    this.tableroSolucion = [];

    //shuffle matrix indexes
    for (i = 0; i < this.nn; i++) {
        matrix_fields[i] = i + 1;
    }

    //shuffle sudoku 'collors'
    matrix_fields = this.shuffle(matrix_fields);
    for (i = 0; i < n * n; i++) {
        for (j = 0; j < n * n; j++) {
            var value = Math.floor((i * n + i / n + j) % (n * n) + 1);
            this.tableroSolucion[index] = value;
            index++;
        }
    }

    //shuffle sudokus indexes of bands on horizontal and vertical
    var blank_indexes = [];
    for (i = 0; i < this.n; i++) {
        blank_indexes[i] = i + 1;
    }


    //shuffle sudokus bands horizontal
    var bands_horizontal_indexes = this.shuffle(blank_indexes);
    var matriz_solution_tmp = [];
    index = 0;
    for (i = 0; i < bands_horizontal_indexes.length; i++) {
        j_start = (bands_horizontal_indexes[i] - 1) * this.n * this.nn;
        j_stop = bands_horizontal_indexes[i] * this.n * this.nn;

        for (j = j_start; j < j_stop; j++) {
            matriz_solution_tmp[index] = this.tableroSolucion[j];
            index++;
        }
    }
    this.tableroSolucion = matriz_solution_tmp;


    //shuffle sudokus bands vertical
    var bands_vertical_indexes = this.shuffle(blank_indexes);
    matriz_solution_tmp = [];
    index = 0;
    for (k = 0; k < this.nn; k++) {
        for (i = 0; i < this.n; i++) {
            j_start = (bands_vertical_indexes[i] - 1) * this.n;
            j_stop = bands_vertical_indexes[i] * this.n;

            for (j = j_start; j < j_stop; j++) {
                matriz_solution_tmp[index] = this.tableroSolucion[j + (k * this.nn)];
                index++;
            }
        }
    }
    this.tableroSolucion = matriz_solution_tmp;

    //tablero init
    var indicesMatriz = [],
        matriz_init = [];

    //shuffle tablero indexes and cut empty cells    
    for (i = 0; i < this.tableroSolucion.length; i++) {
        indicesMatriz[i] = i;
        matriz_init[i] = 0;
    }

    indicesMatriz = this.shuffle(indicesMatriz);
    indicesMatriz = indicesMatriz.slice(0, this.celdasFijas);/*Dado un objeto jQuery que representa un conjunto de elementos DOM, 
    el método .slice () construye un nuevo objeto jQuery que contiene un subconjunto de los elementos especificados por el inicio y,
    opcionalmente, el argumento final. El índice de inicio suministrado identifica la posición de uno de los elementos en el conjunto;
    si se omite el final, todos los elementos después de éste se incluirán en el resultado.
    https://api.jquery.com/slice/*/

    //build the init tablero    
    for (i = 0; i < indicesMatriz.length; i++) {
        matriz_init[indicesMatriz[i]] = this.tableroSolucion[indicesMatriz[i]];
        if (parseInt(matriz_init[indicesMatriz[i]]) > 0) {
            this.celdasLlenas++;
        }
    }

    return (this.displaySolutionOnly) ? this.tableroSolucion : matriz_init;
};

/**
dibujar sudoku tablero in the specified container
*/
Sudoku.prototype.dibujarBoard = function () {
    var index = 0,
        position = { x: 0, y: 0 },
        group_position = { x: 0, y: 0 };

    var sudoku_board = $('<div></div>').addClass('sudoku_board');
    //var sudoku_statistics = $('<div></div>')
    //                            .addClass('statistics')
    //.html('<b>Cells:</b> <span class="cells_complete">' + this.celdasLlenas + '/' + this.totalCeldas + '</span> <b>Time:</b> <span class="time">' + this.tiempoTranscurrido + '</span>');

    $('#' + this.id).empty();

    //dibujar tablero 
    for (i = 0; i < this.nn; i++) {
        for (j = 0; j < this.nn; j++) {
            position = { x: i + 1, y: j + 1 };
            group_position = { x: Math.floor((position.x - 1) / this.n), y: Math.floor((position.y - 1) / this.n) };

            var value = (this.tablero[index] > 0 ? this.tablero[index] : ''),
                value_solution = (this.tableroSolucion[index] > 0 ? this.tableroSolucion[index] : ''),
                cell = $('<div></div>')
                            .addClass('cell')
                            .attr('x', position.x)
                            .attr('y', position.y)
                            .attr('gr', group_position.x + '' + group_position.y)
                            .html('<span>' + value + '</span>');

            if (this.displaySolution) {
                $('<span class="solution">(' + value_solution + ')</span>').appendTo(cell);
            }

            if (value > 0) {
                cell.addClass('fija');
            }

            if (position.x % this.n === 0 && position.x != this.nn) {
                cell.addClass('border_h');
            }

            if (position.y % this.n === 0 && position.y != this.nn) {
                cell.addClass('border_v');
            }

            cell.appendTo(sudoku_board);
            index++;
        }
    }

    sudoku_board.appendTo('#' + this.id);

    //adjust size
    this.resizeWindow();
};

Sudoku.prototype.resizeWindow = function () {
    console.time("resizeWindow");

    var screen = { w: $(window).width(), h: $(window).height() };

    //adjust the tablero
    var b_pos = $('#' + this.id + ' .sudoku_board').offset(),
        b_dim = { w: $('#' + this.id + ' .sudoku_board').width(), h: $('#' + this.id + ' .sudoku_board').height() },
        s_dim = { w: $('#' + this.id + ' .statistics').width(), h: $('#' + this.id + ' .statistics').height() };

    var screen_wr = screen.w + s_dim.h + b_pos.top + 10;

    if (screen_wr > screen.h) {
        $('#' + this.id + ' .sudoku_board').css('width', (screen.h - b_pos.top - s_dim.h - 14));
        $('#' + this.id + ' .matriz_console').css('width', (b_dim.h / 2));
    } else {
        $('#' + this.id + ' .sudoku_board').css('width', '98%');
        $('#' + this.id + ' .matriz_console').css('width', '50%');
    }

    var cell_width = $('#' + this.id + ' .sudoku_board .cell:first').width(),
        note_with = Math.floor(cell_width / 2) - 1;

    $('#' + this.id + ' .sudoku_board .cell').height(cell_width);
    $('#' + this.id + ' .sudoku_board .cell span').css('line-height', cell_width + 'px');
    $('#' + this.id + ' .sudoku_board .cell .note').css({ 'line-height': note_with + 'px', 'width': note_with, 'height': note_with });

    //adjust the console
    var console_cell_width = $('#' + this.id + ' .matriz_console .num:first').width();
    $('#' + this.id + ' .matriz_console .num').css('height', console_cell_width);
    $('#' + this.id + ' .matriz_console .num').css('line-height', console_cell_width + 'px');

    //adjust console
    b_dim = { w: $('#' + this.id + ' .sudoku_board').width(), h: $('#' + this.id + ' .sudoku_board').width() };
    b_pos = $('#' + this.id + ' .sudoku_board').offset();
    c_dim = { w: $('#' + this.id + ' .matriz_console').width(), h: $('#' + this.id + ' .matriz_console').height() };

    var c_pos_new = { left: (b_dim.w / 2 - c_dim.w / 2 + b_pos.left), top: (b_dim.h / 2 - c_dim.h / 2 + b_pos.top) };
    $('#' + this.id + ' .matriz_console').css({ 'left': c_pos_new.left, 'top': c_pos_new.top });

    //adjust the gameover container
    var gameover_pos_new = { left: (screen.w / 20), top: (screen.w / 20 + b_pos.top) };

    $('#' + this.id + ' .gameover').css({ 'left': gameover_pos_new.left, 'top': gameover_pos_new.top });

    console.log('screen', screen);
    console.timeEnd("resizeWindow");
};

/**
Show console
*/
Sudoku.prototype.showConsole = function (cell) {
    $('#' + this.id + ' .contenedor_consola').show();

    var
      t = this,
      oldNotes = $(this.cell).find('.note');

    //init
    $('#' + t.id + ' .matriz_console .num').removeClass('selected');

    //mark buttons
    if (t.markNotes) {
        //select markNote button  
        $('#' + t.id + ' .matriz_console .num.note').addClass('selected');

        //select buttons
        $.each(oldNotes, function () {
            var noteNum = $(this).text();
            $('#' + t.id + ' .matriz_console .num:contains(' + noteNum + ')').addClass('selected');
        });
    }

    return this;
};

/**
Hide console
*/
Sudoku.prototype.hideConsole = function (cell) {
    $('#' + this.id + ' .contenedor_consola').hide();
    return this;
};

/**
Select cell and prepare it for input from sudoku tablero console
*/
Sudoku.prototype.cellSelect = function (cell) {
    this.cell = cell;

    var value = $(cell).text() | 0,
        position = { x: $(cell).attr('x'), y: $(cell).attr('y') },
        group_position = { x: Math.floor((position.x - 1) / 3), y: Math.floor((position.y - 1) / 3) },
        horizontal_cells = $('#' + this.id + ' .sudoku_board .cell[x="' + position.x + '"]'),
        vertical_cells = $('#' + this.id + ' .sudoku_board .cell[y="' + position.y + '"]'),
        group_cells = $('#' + this.id + ' .sudoku_board .cell[gr="' + group_position.x + '' + group_position.y + '"]'),
        same_value_cells = $('#' + this.id + ' .sudoku_board .cell span:contains(' + value + ')');

    //remove all other selections
    $('#' + this.id + ' .sudoku_board .cell').removeClass('selected current group');
    $('#' + this.id + ' .sudoku_board .cell span').removeClass('samevalue');
    //select current cell
    $(cell).addClass('selected current');

    //highlight select cells
    if (this.highlight > 0) {
        horizontal_cells.addClass('selected');
        vertical_cells.addClass('selected');
        group_cells.addClass('selected group');
        same_value_cells.not($(cell).find('span')).addClass('samevalue');
    }

    if ($(this.cell).hasClass('fija')) {
        $('#' + this.id + ' .matriz_console .num').addClass('no');
    } else {
        $('#' + this.id + ' .matriz_console .num').removeClass('no');

        this.showConsole();
        this.resizeWindow();
    }
};

/**
Add value from sudoku console to selected tablero cell
*/
Sudoku.prototype.addValue = function (value) {
    console.log('prepare for addValue', value);

    var
        position = { x: $(this.cell).attr('x'), y: $(this.cell).attr('y') },
        group_position = { x: Math.floor((position.x - 1) / 3), y: Math.floor((position.y - 1) / 3) },

        horizontal_cells = '#' + this.id + ' .sudoku_board .cell[x="' + position.x + '"]',
        vertical_cells = '#' + this.id + ' .sudoku_board .cell[y="' + position.y + '"]',
        group_cells = '#' + this.id + ' .sudoku_board .cell[gr="' + group_position.x + '' + group_position.y + '"]',

        horizontal_cells_exists = $(horizontal_cells + ' span:contains(' + value + ')'),
        vertical_cells_exists = $(vertical_cells + ' span:contains(' + value + ')'),
        group_cells_exists = $(group_cells + ' span:contains(' + value + ')'),

        horizontal_notes = horizontal_cells + ' .note:contains(' + value + ')',
        vertical_notes = vertical_cells + ' .note:contains(' + value + ')',
        group_notes = group_cells + ' .note:contains(' + value + ')',

        old_value = parseInt($(this.cell).not('.notvalid').text()) || 0;


    if ($(this.cell).hasClass('fija')) {
        return;
    }

    //delete value or write it in cell
    $(this.cell).find('span').text((value === 0) ? '' : value);

    if (this.cell !== null && (horizontal_cells_exists.length || vertical_cells_exists.length || group_cells_exists.length)) {
        if (old_value !== value) {
            $(this.cell).addClass('notvalid');
        } else {
            $(this.cell).find('span').text('');
        }
    } else {
        //add value
        $(this.cell).removeClass('notvalid');
        console.log('Value added ', value);

        //remove all notes from current cell,  line column and group
        $(horizontal_notes).remove();
        $(vertical_notes).remove();
        $(group_notes).remove();
    }

    //recalculate completed cells
    this.celdasLlenas = $('#' + this.id + ' .sudoku_board .cell:not(.notvalid) span:not(:empty)').length;
    console.log('is game over? ', this.celdasLlenas, this.totalCeldas, (this.celdasLlenas === this.totalCeldas));
    //game over
    if (this.celdasLlenas === this.totalCeldas) {
        this.gameOver();
    }

    $('#' + this.id + ' .statistics .cells_complete').text('' + this.celdasLlenas + '/' + this.totalCeldas);

    return this;
};


/**
Add note from sudoku console to selected tablero cell
*/
Sudoku.prototype.addNote = function (value) {
    console.log('addNote', value);

    var
      t = this,
      oldNotes = $(t.cell).find('.note'),
      note_width = Math.floor($(t.cell).width() / 2);

    //add note to cell
    if (oldNotes.length < 4) {
        $('<div></div>')
            .addClass('note')
            .css({ 'line-height': note_width + 'px', 'height': note_width - 1, 'width': note_width - 1 })
            .text(value)
            .appendTo(this.cell);
    }

    return this;
};

/**
Remove note from sudoku console to selected tablero cell
*/
Sudoku.prototype.eliminarNota = function (value) {
    if (value === 0) {
        $(this.cell).find('.note').remove();
    } else {
        $(this.cell).find('.note:contains(' + value + ')').remove();
    }

    return this;
};

/**
End game routine
*/
Sudoku.prototype.gameOver = function () {
    console.log('GAME OVER!');
    this.status = this.END;

    $('#' + this.id + ' .contenedor_gameover').show();
};

/**
Run a new sudoku game
*/
Sudoku.prototype.run = function () {
    this.status = this.RUNNING;

    var t = this;
    this.dibujarBoard();

    //click on tablero cell
    $('#' + this.id + ' .sudoku_board .cell').on('click', function (e) {
        t.cellSelect(this);
    });

    //click on console num
    $('#' + this.id + ' .matriz_console .num').on('click', function (e) {
        var
            value = $.isNumeric($(this).text()) ? parseInt($(this).text()) : 0,
            clickMarkNotes = $(this).hasClass('note'),
            clickRemove = $(this).hasClass('remove'),
            numSelected = $(this).hasClass('selected');

        if (clickMarkNotes) {
            console.log('clickMarkNotes');
            t.markNotes = !t.markNotes;

            if (t.markNotes) {
                $(this).addClass('selected');
            } else {
                $(this).removeClass('selected');
                t.eliminarNota(0).showConsole();
            }

        } else {
            if (t.markNotes) {
                if (!numSelected) {
                    if (!value) {
                        t.eliminarNota(0).hideConsole();
                    } else {
                        t.addValue(0).addNote(value).hideConsole();
                    }
                } else {
                    t.eliminarNota(value).hideConsole();
                }
            } else {
                t.eliminarNota(0).addValue(value).hideConsole();
            }
        }
    });

    //click outer console
    $('#' + this.id + ' .contenedor_consola').on('click', function (e) {
        if ($(e.target).is('.contenedor_consola')) {
            $(this).hide();
        }
    });

    $(window).resize(function () {
        t.resizeWindow();
    });
};

//main
$(function () {
    console.time("Cargando tiempo...");

    //init        
    $('head').append('<meta name="viewport" content="initial-scale=1.0,minimum-scale=1.0,maximum-scale=1.0,width=device-width,height=device-height,target-densitydpi=device-dpi,user-scalable=yes" />');

    //game  
    var game = new Sudoku({
        id: 'contenedor_sudoku',
        celdasFijas: 30,
        highlight: 1,
        displayTitle: 1,

    });

    game.run();

    $('#sidebar-toggle').on('click', function (e) {
        $('#menu_sudoku').toggleClass("open-sidebar");
    });

    //restart game
    $('#' + game.id + ' .restart').on('click', function () {
        game.init().run();
    });

    $('#menu_sudoku .restart').on('click', function () {
        game.init().run();
        $('#menu_sudoku').removeClass('open-sidebar');
    });

    console.timeEnd("Cargando tiempo...");
});