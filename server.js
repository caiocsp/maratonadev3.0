// configurar o servidor - Configure the server
const express = require("express");
const server = express();

// Configurar apresentação de arquivos estáticos (css, js) - Configure presentation of static files (css, js)
server.use(express.static('public'));

// Habilitar o corpo do formulário - Enable the form's body
server.use(express.urlencoded({ extended : true }));

// Habilitar a conexão com o banco de dados - Enable connection to the database
const Pool = require('pg').Pool
const db = new Pool({//Nesse caso por exemplo, utilizamos o Postgres, mas a conexão fica a sua preferência - In this example, we use Postgres, but the connection is your preference
    user: '',//user's choice
    password: '',//user's choice
    host: 'localhost',
    port: 5432,
    database: 'donate'
});

// Configurar a template engine - Configure the template engine
const nunjucks = require("nunjucks");
nunjucks.configure("./", {
    express: server,
    noCache: true,
});

// Configurar a apresentação da página - Set up the page display
server.get("/", function(req, res) {

    db.query("SELECT * FROM donors", function(err, result) {

        if (err) return res.send("Erro de banco de dados.");//Database error

        const donors = result.rows;
        return res.render("index.html", { donors })
    })
    
});

server.post("/", function(req, res){
    // Obter os dados do form (requisição) - Get the form data (request)
    const name = req.body.name
    const email = req.body.email
    const blood = req.body.blood


    if(name == "" || email == ""){
        return res.send("Todos os campos são obrigatórios!");//All fields are mandatory!
    }

    // Inserir os valores no bando de dados - Insert the values ​​in the database
    const query = `INSERT INTO donors ("name", "email", "blood")
    VALUES ($1, $2, $3)`;

    db.query(query, [name, email, blood], function(err) {
        if (err) return res.send("Erro no banco de dados");//Database error
        
        //Fluxo ideal - Ideal flow
        return res.redirect("/");
    });
});

// Iniciar o servidor e permitir acesso a porta 3001 - Start the server and allow access to port 3001
server.listen(3001);
