function Sudoku(params) {
    this.id = 'contenedor_sudoku';
   
    this.iniciar();

    return this;
}

Sudoku.prototype.iniciar = function () {
    this.status = this.iniciar;
    this.celdasLlenas = 0;
    this.tablero = [];
    this.tableroSolucion = [];
    this.cell = null;   

    this.tablero = this.constructorTablero();

    return this;
};

/*Sortea el arreglo*/
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
Sudoku.prototype.constructorTablero = function () {
    var matrix_fields = [],
        index = 0,
        i = 0,
        j = 0,
        j_start = 0,
        j_stop = 0;

    //Baraja los índices del tablero
    for (i = 0; i < 9; i++) {
        matrix_fields[i] = i + 1;
    }

    //Baraja los colores
    matrix_fields = this.shuffle(matrix_fields);
    for (i = 0; i < 9; i++) {
        for (j = 0; j < 9; j++) {
            var value = Math.floor((i * 3 + i / 3 + j) % (9) + 1);
            this.tableroSolucion[index] = value;
            index++;
        }
    }

    //Baraja los índices de las bandas en horizontal y vertical
    var blank_indexes = [];
    for (i = 0; i < 3; i++) {
        blank_indexes[i] = i + 1;
    }


    //Ordenar divisores horizontales
    var bands_horizontal_indexes = this.shuffle(blank_indexes);
    var matriz_solution_tmp = [];
    index = 0;
    for (i = 0; i < bands_horizontal_indexes.length; i++) {
        j_start = (bands_horizontal_indexes[i] - 1) * 27;
        j_stop = bands_horizontal_indexes[i] * 27;

        for (j = j_start; j < j_stop; j++) {
            matriz_solution_tmp[index] = this.tableroSolucion[j];
            index++;
        }
    }
    this.tableroSolucion = matriz_solution_tmp;


    //Ordenar divisores verticales
    var bands_vertical_indexes = this.shuffle(blank_indexes);
    matriz_solution_tmp = [];
    index = 0;
    for (k = 0; k < 9; k++) {
        for (i = 0; i < 3; i++) {
            j_start = (bands_vertical_indexes[i] - 1) * 3;
            j_stop = bands_vertical_indexes[i] * 3;

            for (j = j_start; j < j_stop; j++) {
                matriz_solution_tmp[index] = this.tableroSolucion[j + (k * 9)];
                index++;
            }
        }
    }
    this.tableroSolucion = matriz_solution_tmp;

    //Inicializar tablero
    var indicesMatriz = [],
        matriz_iniciar = [];

    //Índices aleatorios del tablero
    for (i = 0; i < this.tableroSolucion.length; i++) {
        indicesMatriz[i] = i;
        matriz_iniciar[i] = 0;
    }

    indicesMatriz = this.shuffle(indicesMatriz);
    indicesMatriz = indicesMatriz.slice(0, 32);/*Dado un objeto jQuery que representa un conjunto de elementos DOM, 
    el método .slice () construye un nuevo objeto jQuery que contiene un subconjunto de los elementos especificados por el inicio y,
    opcionalmente, el argumento final. El índice de inicio suministrado identifica la posición de uno de los elementos en el conjunto;
    si se omite el final, todos los elementos después de éste se incluirán en el resultado.
    https://api.jquery.com/slice/*/

    //Crear tablero inicial   
    for (i = 0; i < indicesMatriz.length; i++) {
        matriz_iniciar[indicesMatriz[i]] = this.tableroSolucion[indicesMatriz[i]];
        if (parseInt(matriz_iniciar[indicesMatriz[i]]) > 0) {
            this.celdasLlenas++;
        }
    }

    return (this.displaySolutionOnly) ? this.tableroSolucion : matriz_iniciar;
};

/*Dibujar tablero en el contenedor*/
Sudoku.prototype.dibujarBoard = function () {
    var index = 0,
        position = { x: 0, y: 0 },
        group_position = { x: 0, y: 0 };

    var sudoku_board = $('<div></div>').addClass('sudoku_board');

    $('#' + this.id).empty();

    //Dibujar tablero 
    for (i = 0; i < 9; i++) {
        for (j = 0; j < 9; j++) {
            position = { x: i + 1, y: j + 1 };
            group_position = { x: Math.floor((position.x - 1) / 3), y: Math.floor((position.y - 1) / 3) };

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

            if (position.x % 3 === 0 && position.x != 9) {
                cell.addClass('border_h');
            }

            if (position.y % 3 === 0 && position.y != 9) {
                cell.addClass('border_v');
            }

            cell.appendTo(sudoku_board);
            index++;
        }
    }

    sudoku_board.appendTo('#' + this.id);

    //Ajustar el tamaño
    this.resizeWindow();
};

Sudoku.prototype.resizeWindow = function () {

    var screen = { w: $(window).width(), h: $(window).height() };

    //Ajustar el tablero
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

};

/*Prototipo de la función para seleccionar las celdas*/
Sudoku.prototype.cellSelect = function (cell) {
    this.cell = cell;

    var value = $(cell).text() | 0,
        position = { x: $(cell).attr('x'), y: $(cell).attr('y') },
        group_position = { x: Math.floor((position.x - 1) / 3), y: Math.floor((position.y - 1) / 3) },
        horizontal_cells = $('#' + this.id + ' .sudoku_board .cell[x="' + position.x + '"]'),
        vertical_cells = $('#' + this.id + ' .sudoku_board .cell[y="' + position.y + '"]'),
        group_cells = $('#' + this.id + ' .sudoku_board .cell[gr="' + group_position.x + '' + group_position.y + '"]'),
        same_value_cells = $('#' + this.id + ' .sudoku_board .cell span:contains(' + value + ')');

    //Quitar otras selecciones
    $('#' + this.id + ' .sudoku_board .cell').removeClass('selected current group');
    $('#' + this.id + ' .sudoku_board .cell span').removeClass('samevalue');
    //Seleccionar la celda actual
    $(cell).addClass('selected current');

    //Resaltar la celda seleccionada
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
        
        this.resizeWindow();
    }
};


/*Empezar una nueva partida*/
Sudoku.prototype.run = function () {

    var t = this;
    this.dibujarBoard();

    //Click en celda
    $('#' + this.id + ' .sudoku_board .cell').on('click', function (e) {
        t.cellSelect(this);
    });

    //Al presionar una tecla
    $('body').keypress(function (e) {                
        var cell = $('.current');
        if (cell.hasClass('fija')) {
            alert('Celda fija');
        } else {
            if ((e.keyCode || e.which) >= 49 && (e.keyCode || e.which) <= 57) { //Solo permite valores del 1 al 9
                cell.find('span').text("" + String.fromCharCode(e.keyCode || e.which));//Convierte el código Ascii a su respectivo caracter y lo inserta en la celda
            }
        }
        
    });   

    $(window).resize(function () {
        t.resizeWindow();
    });
};

//Main
$(function () {

    //Inicio      
    $('head').append('<meta name="viewport" content="iniciarial-scale=1.0,minimum-scale=1.0,maximum-scale=1.0,width=device-width,height=device-height,target-densitydpi=device-dpi,user-scalable=yes" />');

    //Partida  
    var partida = new Sudoku({
        id: 'contenedor_sudoku',
        celdasFijas: 30,
        highlight: 1,
        displayTitle: 1,

    });

    partida.run();

    $('#sidebar-toggle').on('click', function (e) {
        $('#menu_sudoku').toggleClass("open-sidebar");
    });

    //Reiniciar partida
    $('#' + partida.id + ' .restart').on('click', function () {
        partida.iniciar().run();
    });

    $('#menu_sudoku .restart').on('click', function () {
        partida.iniciar().run();
        $('#menu_sudoku').removeClass('open-sidebar');
    });

});