<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="frmSudoku.aspx.cs" Inherits="UIL.frmSudoku" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>SUDOKU</title> <%--Título de la ventana--%>
    <link href="Estilos/cssSudoku.css" rel="stylesheet" type="text/css" />
    <link href="https://fonts.googleapis.com/css?family=Asap" rel="stylesheet" />
    
</head>
    <script src="Scripts/jquery-1.12.4.min.js"></script>
    <script src="Scripts/jquery-ui-1.12.1.min.js"></script>
<script type="text/javascript" src="Javascript/jsSudoku.js"></script> <%--Importación del script JS--%>
<body>
    <form id="form1" runat="server">
        <div id="titulo">

<h1>SUDOKU</h1></div>

        

        <div id="contenedor_sudoku"></div> <%--Div contenedor del sudoku--%>
    </form>
</body>
</html>
