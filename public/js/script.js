const socket = io()

// O que estiver dentro desse (window.onloa) será carregado primeiro do que qualquer script desse arquivo
window.onload = () => {

    // Chamando método da classe EditandoLayouts para ser carregado no início do programa
    const Layouts = new EditandoLayouts()
    Layouts.ChamadaAdicionarUser()
}



//-----------------------------------  funções ------------------------

// inserir registro no banco 
function AdicionarUser() {
    let DTN_ID = document.getElementById('inputIdsAddUser').value
    let DTN_DESTINATION = document.getElementById('inputDestinationAddUser').value

    window.open('http://localhost:8081/destination/inserte/' + DTN_ID + '/' + DTN_DESTINATION, "_self")
}

// eidtar registro no banco
function EditarUser() {
    let DTN_ID = document.getElementById('inputIdsEditUser').value
    let DTN_DESTINATION = document.getElementById('inputDestinationEditUser').value

    window.open('http://localhost:8081/destination/edite/' + DTN_ID + '/' + DTN_DESTINATION, "_self")
}

// excluir registro no banco
function ExcluirUser() {
    let DTN_ID = document.getElementById('inputIdsExcluirUser').value
    let DTN_DESTINATION = document.getElementById('inputDestinationExcluirUser').value

    window.open('http://localhost:8081/destination/exclude/' + DTN_ID, "_self")
}

// pesquisar registro no banco
function BTNPesquisar() {
    let InputPesquisa = document.getElementById('inputPesquisa').value

    window.open('http://localhost:8081/destination/pesquisa/' + InputPesquisa, "_self")
}

// Botão de adicionar Usuário
function BtnAdicionar() {
    const layouts = new EditandoLayouts()
    layouts.ChamadaAdicionarUser()  // chamada do layout adicionar usuário
}

// Botão de editar Usuário
function BtnEditar(ID) {
    const layouts = new EditandoLayouts()
    layouts.chamadaEditarUser()  // chamada do layout editar 

    window.document.getElementById('inputIdsEditUser').value = ID
}

// Botão de excluir Usuário
function BtnExcluir(ID, Nome) {
    const layouts = new EditandoLayouts()
    layouts.chamadaExcluirUser() // chamada do layout excluir

    window.document.getElementById('inputIdsExcluirUser').value = ID
    window.document.getElementById('inputDestinationExcluirUser').value = Nome
}






// adicionar user a lista do arquivo csv
let dtnId = []
let dtnDestination = []

function AdicionarUserNaListaCSV(ID, NOME) {
    dtnId.push(ID)
    dtnDestination.push(NOME)

    if(dtnId[0] != null){   // habilitar botão salvar lista
        document.getElementById('btn_ListSalvar').style.display = "block"
    }
}

// Botão de criar aquivo csv
function salvarLista() {
    var produtos = [
        {
            codigo: dtnId[0],
            nome: dtnDestination[0],
        },
        {
            codigo: dtnId[1],
            nome: dtnDestination[1],
        },
        {
            codigo: dtnId[2],
            nome: dtnDestination[2],
        },
        {
            codigo: dtnId[3],
            nome: dtnDestination[3],
        },
        {
            codigo: dtnId[4],
            nome: dtnDestination[4],
        },
        {
            codigo: dtnId[5],
            nome: dtnDestination[5],
        },
        {
            codigo: dtnId[6],
            nome: dtnDestination[6],
        },
        {
            codigo: dtnId[7],
            nome: dtnDestination[7],
        },
        {
            codigo: dtnId[8],
            nome: dtnDestination[8],
        },
        {
            codigo: dtnId[9],
            nome: dtnDestination[9],
        },
        {
            codigo: dtnId[10],
            nome: dtnDestination[10],
        },
        {
            codigo: dtnId[11],
            nome: dtnDestination[11],
        },
        {
            codigo: dtnId[12],
            nome: dtnDestination[12],
        },
        {
            codigo: dtnId[13],
            nome: dtnDestination[13],
        },
        {
            codigo: dtnId[14],
            nome: dtnDestination[14],
        },
        {
            codigo: dtnId[15],
            nome: dtnDestination[15],
        },
        {
            codigo: dtnId[16],
            nome: dtnDestination[16],
        },
        {
            codigo: dtnId[17],
            nome: dtnDestination[17],
        },
        {
            codigo: dtnId[18],
            nome: dtnDestination[18],
        },
        {
            codigo: dtnId[19],
            nome: dtnDestination[19],
        },
    ];

    var _gerarCsv = function () {

        var csv = 'DTN_ID, DTN_DESTINATION\n';

        produtos.forEach(function (row) {
            csv += row.codigo;
            csv += ',' + row.nome;
            csv += '\n';
        });

        var hiddenElement = document.createElement('a');
        hiddenElement.href = 'data:text/csv;charset=utf-8,' + encodeURI(csv);
        hiddenElement.target = '_blank';
        hiddenElement.download = 'registros.csv';
        hiddenElement.click();
    };
    _gerarCsv();
}

//-----------------------------------  classes ------------------------

class EditandoLayouts {
    ChamadaAdicionarUser() {  // layout adicionar usuário
        for (let i = 0; i < 7; i++) {
            document.getElementById(LayoutAdicionarUser[i]).style.display = "block" // habilitar tela adicionar user e desabilitar as outras
            document.getElementById(LayoutEditarUser[i]).style.display = "none"
            document.getElementById(LayoutExcluirUser[i]).style.display = "none"
        }
        document.getElementById('btn_ListSalvar').style.display = "none"  // desabilitar botão salvar lista
    }

    chamadaEditarUser() {  // layout editar usuário
        for (let i = 0; i < 7; i++) {
            document.getElementById(LayoutAdicionarUser[i]).style.display = "none"
            document.getElementById(LayoutEditarUser[i]).style.display = "block"  // habilitar tela editar user e desabilitar as outras
            document.getElementById(LayoutExcluirUser[i]).style.display = "none"
        }
        document.getElementById('btn_ListSalvar').style.display = "none"  // desabilitar botão salvar lista
    }

    chamadaExcluirUser() {  // layout excluir usuário
        for (let i = 0; i < 7; i++) {
            document.getElementById(LayoutAdicionarUser[i]).style.display = "none"
            document.getElementById(LayoutEditarUser[i]).style.display = "none"
            document.getElementById(LayoutExcluirUser[i]).style.display = "block"  // habilitar tela excluir user e desabilitar as outras
        }
        document.getElementById('btn_ListSalvar').style.display = "none"  // desabilitar botão salvar lista
    }
}

// ids de referêrencia de cada layout
let LayoutAdicionarUser = ['label_tituloAddUser', 'label_idAddUser', 'inputIdsAddUser', 'label_destinationAddUser',
    'inputDestinationAddUser', 'btnAddUser', 'AreaResultadoAddUser']

let LayoutEditarUser = ['label_tituloEditUser', 'label_idEditUser', 'inputIdsEditUser', 'label_destinationEditUser',
    'inputDestinationEditUser', 'btnEditUser', 'AreaResultadoEditUser']

let LayoutExcluirUser = ['label_tituloExcluirUser', 'label_idExcluirUser', 'inputIdsExcluirUser', 'label_destinationExcluirUser',
    'inputDestinationExcluirUser', 'btnExcluirUser', 'AreaResultadoExcluirUser']