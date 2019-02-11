<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="frmSudoku.aspx.cs" Inherits="UIL.frmSudoku" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <link href="Estilos/cssSudoku.css" rel="stylesheet" type="text/css" />
    <link href="https://fonts.googleapis.com/css?family=Asap" rel="stylesheet" />
    <title>SUDOKU</title> <%--Título de la ventana--%>
</head>
<script type="text/javascript" src="Javascript/jsSudoku.js"></script> <%--Importación del script JS--%>
<body>
    <form id="form1" runat="server">
    <div>      

        <h1 id="titulo_sudoku">SUDOKU</h1> <%--Título del juego--%>


            <nav class="menuCSS3"> <%--Menú principal--%>
		<ul>
			<li><a href="#">Reiniciar juego</a></li>
			<li><a href="#">Ayuda</a>
                <ul>
					<li><a href="#">Instrucciones</a></li>
					<li><a href="#">Pista</a></li>
					<li><a href="#">Resolver Sudoku</a></li>
					<li><a href="#">Comprobar respuestas</a></li>
				</ul>
			</li>	
            <li><a href="#">Preferencias</a></li>            		
			<li><a href="#">Salir</a></li>
		</ul>
	</nav>        
        <div id="contenedor_sudoku"></div> <%--Div contenedor del sudoku--%>
        <div class="sudoku_board"></div>
    </div>
    </form>
</body>
</html>
