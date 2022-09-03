/*
  O arquivo (createDatabase.js) será o arquivo responsável por gerar de forma automática o banco de dados e a tabela 
  necessária para o funcionamento do sistema.
*/


/*  1º
  No primeiro passo será criada uma conexão com o mysql. Na mesma não será necessário passar o valor do campo 
  (database), pois o banco será gerando de forma automática mais na frente 

  Requisitando a dependência do mysql, criamos a conexão com o mysql  passamos os demais parâmetros nos campos (host) (user) 
  (password) dentro de uma constante ou uma variável 

  Em seguida usamos a constante ou a variável criada, para verificar se o banco foi conectado 
  corretamente.
*/
const mysql = require('mysql')
const criandoBancoDeDados = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  port: 3306
  //database: ''
})


criandoBancoDeDados.connect((erro) => {
  if (erro) {
    console.log("1º-- conexão da criação do Banco de Dados = " + erro)
  } else {
    console.log("1º -- conexão da criação do banco de dados feito com sucesso")
  }
})


/*  2º
   Após a verificação, executa-se uma query criando o banco de dados do sistema.
   Para criar a tabela, iremos executar uma query para selecionar ou usar o banco de dados
*/

criandoBancoDeDados.query('CREATE DATABASE IF NOT EXISTS gerenciador_de_pessoas', (errBanco, resultBanco) => {
  if (errBanco) {
    console.log(errBanco)
  } else if (resultBanco) {
    console.log(resultBanco)
  }
})

module.exports = {
  criandoBancoDeDados: criandoBancoDeDados
}