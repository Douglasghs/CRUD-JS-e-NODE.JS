const sequelize = require('sequelize')  // Importação da bilblioteca sequelize
const Sequelize = new sequelize('gerenciador_de_pessoas', 'root','',{
    dialect:'mysql',
    host: "localhost",
    define: {
        timestamps: false
    }
})

Sequelize.authenticate().then(()=>{
    console.log('Sequelize Ok')
}).catch((err)=>{
    console.log("Sequelize erro :" + err)
})

const Post = Sequelize.define('tba_destinations',{
    DTN_ID: {
        type: sequelize.STRING(20),
        primaryKey: true
    },
    DTN_DESTINATION: {
        type: sequelize.STRING(10)
    }
})

//Post.sync({forcer: true})

module.exports = Post