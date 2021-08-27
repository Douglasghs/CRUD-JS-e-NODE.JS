const express = require('express')
const app = express()
const port = process.env.PORT || 8081
const server = require('http').createServer(app)
const io = require('socket.io')(server)


// Configurando o express-handlebar (HTML DA PÁGINA)
const handlebars = require('express-handlebars')
app.engine('handlebars', handlebars({
    defaultLayout: 'main',
    runtimeOptions: {
        allowProtoPropertiesByDefault: true,
        allowProtoMethodsByDefault: true,
    },
}))
app.set('view engine', 'handlebars')


//  configurando body parser (vai entrar no corpo do html/handlebars para pegar valores de alguns inputs)
const parser = require('body-parser')
app.use(parser.urlencoded({ extended: false }))
app.use(parser.json())


// Configurando arquivos estáticos (CSS, JS)
const path = require('path')
app.use(express.static(path.join(__dirname, "/public")))


const mysql = require('./modules/createDatabase') // Importção do arquivo de criação do banco de dados
const Tabela = require('./modules/Tabela')  // importação do arquivo de criação da tabela do banco de dados
const readline = require('readline')  // permite a opção de input e output no console da aplicação


server.listen(port, () => {      // Iremos passar nesse campo a porta onde o servidor vai escutar (port = 8081)
    console.log("Servidor rodando na porta " + port)
})




/* =============================================                 ================================================
  ===============================================  ROTAS PADRÃO =================================================
   -- Baseia-se em rotas que vão ser executadas no próprio programa sem a ajuda no insomnia

   Todas as rotas foram definidas como get nesse trecho ROTAS PADRÃO. Mas, na parte inferior do código tem as rotas com 
   as definições correamente declaradas com o escopo da requisição do projeto, as mesma ja foram testadas no 
   Insomnia
*/

//                                       (MOSTRAR TODOS OS REGISTROS DO BANCO DE DADO)
app.get("/destination/", (req, res) => {
    Tabela.findAll().then((posts) => {
        res.render('index.handlebars', { posts: posts })
    })
})

//                                                       (INSERIR DADOS NO BANCO DE DADOS) 
app.get("/destination/inserte/:id/:nome", (req, res) => {
    mysql.criandoBancoDeDados.query('USE gerenciador_de_pessoas')
    mysql.criandoBancoDeDados.query("INSERT INTO tba_destinations (DTN_ID,DTN_DESTINATION) VALUE (?,?)",
        [req.params.id, req.params.nome], (err, result) => {
            if (err) {
                res.status(404).json({
                    erro: 404,
                    message: "Usuário já é cadastrado"
                })
            } else if (result) {
                res.status(204).json({
                    erro: 204,
                    message: "Usuário cadastrado com sucesso"
                })
            }
        })
})


//                                                     (EDIÇÃO DOS DADOS DO BANCO DE DADO (update))
app.get("/destination/edite/:id/:nome", (req, res) => {
    mysql.criandoBancoDeDados.query('USE gerenciador_de_pessoas')
    mysql.criandoBancoDeDados.query('INSERT INTO tba_destinations (DTN_ID) VALUE (?)', [req.params.id], (err, result) => { //inserção para validar registros
        /*
          Usei uma query de INSERTE para verificar se o (DTN_ID) já estava registrado.
    
          Se o resultado da inserção for um ERR, esse erro vai ser causado por uma  duplicação do (DTN_ID), ou seja, já existe registro
          com essa identação. Logo só será feito o update do campo (DTN_DESTINATION)
    
          Se o resultado da inserção for um RESULT, será lanchado uma função input para pegar valor de atribuição ao campo de (DTN_DESTINATION)
          e logo em seguida será realizada uma inserção de registro no banco
        */

        if (err) {
            // Será realizado o update 
            mysql.criandoBancoDeDados.query('UPDATE tba_destinations SET DTN_DESTINATION = ? WHERE DTN_ID = ?',
                [req.params.nome, req.params.id], (err, result) => {
                    if (result) {
                        res.status(204).json({
                            erro: 204,
                            message: "No Content"
                        })
                    }
                })
        }
        else if (result) {
            // Apagando a primeira inserção que fiz para ver se o registro já existia
            mysql.criandoBancoDeDados.query('DELETE FROM tba_destinations WHERE DTN_ID = ?', [req.params.id], (errDELETE, resultDELETE) => {
                if (resultDELETE) {
                    // Execução da nova inserção com os valores certos para o campo de (DTN_DESTINATION) 
                    mysql.criandoBancoDeDados.query('INSERT INTO tba_destinations(DTN_ID, DTN_DESTINATION) VALUES (?,?)',
                        [req.params.id, req.params.nome], (err, result) => {
                            if (result) {
                                res.status(204).json({
                                    erro: 204,
                                    message: "No Content"
                                })
                            }
                            else if (err) {
                                console.log(err)
                            }
                        })
                }
            })
        }
    })
})

//                                                 (EXCLUSÃO DOS DADOS SELECIONADOS PELO O ID) 

app.get('/destination/exclude/:id', (req, res) => {
    /*
       Usei uma query de INSERTE para verificar se o (DTN_ID) já estava registrado.
 
           Se o programa me retornasse um erro, indicaria tentativa de duplicação no mysql, ou seja, aquele registro já existia. Logo, deletaria o
           registro e em seguida passaria um status (204). 
           
           E se não desse nenhum erro, o inserte seria realizado e logo em seguida foi jogado outra query deletando o mesmo id.
           Ápos o sucesso da exclusão o site retorna um status(404)
     */
    mysql.criandoBancoDeDados.query('USE gerenciador_de_pessoas')
    mysql.criandoBancoDeDados.query('INSERT INTO tba_destinations (DTN_ID) VALUE (?)', [req.params.id], (err, result) => {
        if (err) {
            mysql.criandoBancoDeDados.query('DELETE FROM tba_destinations WHERE DTN_ID = ?', [req.params.id], (err, result) => {
                if (result) {
                    res.status(204).json({
                        error: 204,
                        message: "No Content"
                    })
                }
            })
        }
        else if (result) {
            mysql.criandoBancoDeDados.query('DELETE FROM tba_destinations WHERE DTN_ID = ?', [req.params.id], (err, result) => {
                if (result) {
                    res.status(404).json({
                        error: 404,
                        message: "Not Found"
                    })
                }
            })
        }

    })
})

//                                                (CAMPO DE PESQUISA)
app.get("/destination/pesquisa/:id", (req, res) => {
    mysql.criandoBancoDeDados.query('USE gerenciador_de_pessoas')
    mysql.criandoBancoDeDados.query('SELECT * FROM tba_destinations WHERE DTN_ID = ?', [req.params.id], (err, result) => {
        if (err) {
            res.status(404).json({
                err: 404,
                message: "Not Found"
            })
        } else if (result) {
            console.log(result)
        }
    })

    mysql.criandoBancoDeDados.query('USE gerenciador_de_pessoas')
    mysql.criandoBancoDeDados.query('SELECT * FROM tba_destinations WHERE DTN_DESTINATION = ?', [req.params.id], (err, result) => {
        if (err) {
            res.status(404).json({
                err: 404,
                message: "Not Found"
            })
        } else if (result) {
            console.log(result)
        }
    })
})










/* =============================================                 ================================================
  ===============================================  ROTAS PRO INSOMINIA =================================================
   -- Baseia-se em rotas que vão ser executadas no próprio programa com a ajuda no insomnia
*/

// ===== GET (MOSTRAR TODOS OS REGISTROS DO BANCO DE DADO )

/*
     • http://domain:port/destination ?id=20&destination=402
              Neste caso, retornar todos os registros que 
              contenham “20” no campo DTN_ID E “402” no campo 
              DTN_DESTINATION
*/
app.get("/destination/:id/:nome", (req, res) => {

    let id = req.params.id    // pegar valor do parâmetro id
    let nome = req.params.nome  // pegar valor do parâmetro nome

    if ((id != null) & (nome != null)) {
        mysql.criandoBancoDeDados.query('USE gerenciador_de_pessoas')
        mysql.criandoBancoDeDados.query("SELECT * FROM tba_destinations WHERE DTN_DESTINATION = ?", [nome], (err, result) => {
            if (err) {
                console.log(err)
            } else if (result) {
                res.send(result)
            }

        })
        mysql.criandoBancoDeDados.query('USE gerenciador_de_pessoas')
        mysql.criandoBancoDeDados.query('SELECT * FROM tba_destinations WHERE DTN_ID = ?', [id], (err, result) => {
            if (err) {
                console.log(err)
            } else if (result) {
                console.log(result)
            }
        })
    }
})

/*
     • http://domain:port/destination ?id=&destination=402
               Neste caso, retornar todos os registros que 
               contenham 402 no campo DTN_DESTINATION, não 
               importando o conteúdo do campo DTN_ID.
*/
app.get("/destination/?:nome", (req, res) => {

    let nome = req.params.nome  // pegar valor do parâmetro nome

    /*
      Após passar os valores dos parâmetros para dentro das variáveis, iremos fazer o condicionamento a pertir delas

       O valor do (id) não será necessario, onde será feito uma busca por meio do DTN_DESTINATION
    */
    mysql.criandoBancoDeDados.query('USE gerenciador_de_pessoas')
    mysql.criandoBancoDeDados.query("SELECT * FROM tba_destinations WHERE DTN_DESTINATION = ?", [nome], (err, result) => {
        if (err) {
            console.log(err)
        } else if (result) {
            res.send(result)
        }
    })
})



// PUT (INSERÇÃO OU EDIÇÃO DO ID)
app.put('/destination/:id', (req, res) => {
    /*
      Já que só passamos um único parâmetro(id) na rota, para realizar a opção de inserir ou alterar, precisamos pegar o valor
      do campo DTN_DESTINATION. Usando a biblioteca (readline) conseguimos fazer um input via console e captar o valor do campo 
      em uma variável definida
    */
    var pegarObjetoDTN_DESTINATION = ""

    let leitor = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    })

    /*
      Começamos a partir daqui a funcionalidade da rota normalmente, onde será feita uma inserção para validar se já existe o registro 
      passado com o parãmetro pela url 
    */

    mysql.criandoBancoDeDados.query('USE gerenciador_de_pessoas')
    mysql.criandoBancoDeDados.query('INSERT INTO tba_destinations (DTN_ID) VALUE (?)', [req.params.id], (err, result) => { //inserção para validar registros
        /*
          Se o resultado da inserção for um ERR, esse erro vai ser causado por uma  duplicação do (DTN_ID), ou seja, já existe registro
          com essa identação. Logo só será feito o update do campo (DTN_DESTINATION)

          Se o resultado da inserção for um RESULT, será lanchado uma função input para pegar valor de atribuição ao campo de (DTN_DESTINATION)
          e logo em seguida será realizada uma inserção de registro no banco
        */
        if (err) {
            // Momento em que será atribuido valor a variável responsável pelo preenchimento do campo (DTN_DESTINATION)
            leitor.question("Qual o novo valor do campo DTN_DESTINATION?", function (answer) {
                let pegarObjetoDTN_DESTINATION = answer;
                console.log("\nSua resposta '" + pegarObjetoDTN_DESTINATION + "' foi gravada");
                leitor.close();

                // Será realizado o update 
                mysql.criandoBancoDeDados.query('UPDATE tba_destinations SET DTN_DESTINATION = ? WHERE DTN_ID = ?',
                    [pegarObjetoDTN_DESTINATION, req.params.id], (err, result) => {
                        if (result) {
                            res.status(204).json({
                                erro: 204,
                                message: "No Content"
                            })
                        }
                        else if (err) {
                            console.log(err)
                        }
                    })
            })
        }
        else if (result) {
            mysql.criandoBancoDeDados.query('DELETE FROM tba_destinations WHERE DTN_ID = ?', [req.params.id], (errDELETE, resultDELETE) => {
                if (resultDELETE) {
                    // Momento em que será atribuido valor a variável responsável pelo preenchimento do campo (DTN_DESTINATION)
                    leitor.question("Qual o nome valor para o campo do DTN_DESTINATION?", function (answer) {
                        let pegarObjetoDTN_DESTINATION = answer;
                        console.log("\nSua resposta '" + pegarObjetoDTN_DESTINATION + "' foi gravada");
                        leitor.close();

                        // Execução da nova inserção com os valores certos para o campo de (DTN_DESTINATION) 
                        mysql.criandoBancoDeDados.query('INSERT INTO tba_destinations(DTN_ID, DTN_DESTINATION) VALUES (?,?)',
                            [req.params.id, pegarObjetoDTN_DESTINATION], (err, result) => {
                                if (result) {
                                    res.status(204).json({
                                        erro: 204,
                                        message: "No Content"
                                    })
                                }
                                else if (err) {
                                    console.log(err)
                                }
                            })
                    })
                }
            })
        }
    })
})




// DELETE (EXCLUSÃO DOS DADOS SELECIONADOS PELO O ID) 
app.delete('/destination/:id', (req, res) => {
    /*
      Usei uma query de INSERTE para verificar se o (DTN_ID) já estava registrado.

          Se o programa me retornasse um erro, indicaria tentativa de duplicação no mysql, ou seja, aquele registro já existia. Logo, deletaria o
          registro e em seguida passaria um status (204). 
          
          E se não desse nenhum erro, o inserte seria realizado e logo em seguida foi jogado outra query deletando o mesmo id.
          Ápos o sucesso da exclusão o site retorna um status(404)
    */
    mysql.criandoBancoDeDados.query('USE gerenciador_de_pessoas')
    mysql.criandoBancoDeDados.query('INSERT INTO tba_destinations (DTN_ID) VALUE (?)', [req.params.id], (err, result) => {
        if (err) {
            mysql.criandoBancoDeDados.query('DELETE FROM tba_destinations WHERE DTN_ID = ?', [req.params.id], (err, result) => {
                if (result) {
                    res.status(204).json({
                        error: 204,
                        message: "No Content"
                    })
                }
            })
        }
        else if (result) {
            mysql.criandoBancoDeDados.query('DELETE FROM tba_destinations WHERE DTN_ID = ?', [req.params.id], (err, result) => {
                if (result) {
                    res.status(404).json({
                        error: 404,
                        message: "Not Found"
                    })
                }
            })
        }

    })
})