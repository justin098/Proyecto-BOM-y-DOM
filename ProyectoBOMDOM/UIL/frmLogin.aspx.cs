using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace UIL
{
    public partial class frmLogin : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            if (!IsPostBack)
            {
                this.Form.Attributes.Add("autocomplete", "off");
                Session["UsuarioLogueado"] = null;
            }
        }

        protected void btnIniciar_Click(object sender, EventArgs e)
        {
            try
            {
                Session["UsuarioLogueado"] = txtUsuario.Value.Trim(); ;
                Response.Redirect("frmSudoku.aspx");
            }
            catch (Exception ex)
            {

                lblMensaje.Text = ex.ToString();
            }
        }
    }
}