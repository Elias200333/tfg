// Destruye el token de sesión y devuelve al login
function logout(req, res) {
    req.session.destroy(() => {
        res.redirect("/login");
    });
}

module.exports = { logout }