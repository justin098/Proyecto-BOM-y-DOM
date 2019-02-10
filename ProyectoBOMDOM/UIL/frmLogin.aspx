<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="frmLogin.aspx.cs" Inherits="UIL.frmLogin" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Inicio de sesión</title>
    <link href="https://fonts.googleapis.com/css?family=Asap" rel="stylesheet" />
    <link href="Estilos/cssLogin.css" rel="stylesheet" type="text/css" />
</head>
<body>
    <form id="form1" class="login" runat="server">
        <input type="text" placeholder="Usuario" class="Textos" runat="server" id="txtUsuario" onkeypress="return ValidarIdUsuario(event)" />
        <input type="password" placeholder="Contraseña" id="txtContrasena" class="Textos" />
        <asp:Label Text="" ID="lblMensaje" ForeColor="Red" runat="server" />
        <br />
        <asp:Button Text="Iniciar Sesión" CssClass="Boton" ID="btnIniciar" runat="server" OnClientClick="return ValidacionBoton()" OnClick="btnIniciar_Click" />
    </form>
</body>
<script type="text/javascript" src="Javascript/jsLogin.js"></script>
</html>
