const express = require('express');
const app = express();
const port = 3000;
const ejs = require('ejs');
const bodyParser = require('body-parser');
const session = require('express-session');
const multer = require('multer');
const uploadMulter = multer({ storage: multer.memoryStorage() });

// Configura EJS como el motor de plantillas
app.set('view engine', 'ejs');

const secretToken = "TokenPremioDonBosco";
app.use(session({
    secret: secretToken, // Clave secreta para encriptar la sesión
    resave: false,
    saveUninitialized: true
}));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public'))

function authenticate(req, res, next) {
    // Verifica si el usuario ha iniciado sesión
    if (req.session.email) {
        // Si ha iniciado sesión, permite que el usuario acceda a la ruta protegida
        return next();
    }
    // Si no ha iniciado sesión, redirige al usuario al formulario de inicio de sesión
    res.redirect('/login');
}

// Define una ruta para registrar usuarios
const { register } = require('./src/routes/post/register');
app.post('/register', register);

// Define ruta para iniciar sesión
const { login } = require('./src/routes/post/login');
app.post('/login', login);

// Define ruta para cerrar sesión
const { logout } = require('./src/routes/get/logout');
app.get('/logout', logout);

// Define ruta que devuelve el dashboard
const { dashboard } = require('./src/routes/get/dashboard/this');
app.get('/dashboard', authenticate, dashboard);

// Define ruta que devuelve la lista de proyectos
const { proyects } = require('./src/routes/get/dashboard/proyects');
app.get('/dashboard/proyects/:page', authenticate, proyects);

// Define ruta que devuelve la información del proyecto
const { info } = require('./src/routes/get/dashboard/info')
app.get('/dashboard/info/:id', authenticate, info)

// Define ruta que devuelve el formulario de actualización
const { update } = require('./src/routes/get/dashboard/update')
app.get('/dashboard/update', authenticate, update)

// Define ruta que devuelve el segundo paso de la ruta de actualización
const { update2 } = require('./src/routes/get/dashboard/update-2')
app.get('/dashboard/update/:id', authenticate, update2)

// Define ruta para actualizar proyecto
const { updateProyect } = require('./src/routes/post/updateProyect')
app.post('/update-final', authenticate, uploadMulter.single('website'), updateProyect)

// Define ruta que devuelve el formulario de creación
const { create } = require('./src/routes/get/dashboard/create');
app.get('/dashboard/create', authenticate, create);

// Define ruta que devuelve el pago correcto
const { successPayment } = require('./src/routes/get/success-payment');
app.get('/success-payment/:id', authenticate, successPayment);

// Define ruta que devuelve la lista de planes en función de la ruta /dashboard/create
const { create2step } = require('./src/routes/get/dashboard/create-2-step');
app.post('/dashboard/create-2-step', authenticate, uploadMulter.single('website'), create2step);

// Define una redirección de subdominio
app.get('/ws/:id', (req, res) => {
    res.send('<iframe src=""></iframe>')
});

// Define una ruta para mostrar un mensaje de bienvenida
app.get('/', (req, res) => {
    res.render('index')
});

// Define una ruta para subir archivos
const { createProyect } = require('./src/routes/post/createProyect');
app.post('/createProyect', authenticate, uploadMulter.single('website'), createProyect);

// Define una ruta para subir archivos
const { calculateQuote } = require('./src/routes/post/proyects/calculateQuote');
app.post('/proyects/calculateQuote', authenticate, uploadMulter.single('website'), calculateQuote);

// Define una ruta para el formulario de inicio de sesión
app.get('/login', (req, res) => {
    res.render('login');
});

// Define una ruta para el formulario de registro
app.get('/register', (req, res) => {
    res.render('register');
});

// Inicia el servidor
app.listen(port, () => {
    console.log(`El servidor se está ejecutando en el puerto ${port}`);
});