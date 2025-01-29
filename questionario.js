const NOME_QUESTIONARIO = "questionario";
const NOME_QUESTIONARIOS_LISTA = "questionarios";

function aloMundo(){
    alert("alo mundo");
}

var newID = 0;


function identificarTudo(listaQuestionarios){
    identificarItens(listaQuestionarios);

    for(var quest of listaQuestionarios)
    {
        // Perguntas
        identificarItens(quest.data);

        for(var pergunta of quest.data){
            // Alternativas
            identificarItens(pergunta.data);
        }
    }
}

// Da um id único para todos os questionarios
function identificarItens(lista){
    for(var item of lista){
        // Se não tem id
        if (!item.id){
            // Existe o id na lista de questionarios?
            while(lista.findIndex(x => x.id == newID) != -1){
                // Muda o valor
                newID++;
            }

            // Adiciona um id para o questionario
            item.id = newID;
            //console.log(newID);
            newID++;
        }
    }
}

function gerarNovoId(lista){
    let novoId = 0;

    // Existe o id na lista de questionarios?
    while(lista.findIndex(x => x.id == novoId) != -1){
        // Muda o valor
        novoId++;
    }

    return novoId;
}

function aleatorizarQuestionario(questionario){
    questionario.data = aleatorizarItens(questionario.data);

    for(var pergunta of questionario.data){
        // Alternativas
        pergunta = aleatorizarItens(pergunta.data);
    }
}

function aleatorizarItens(array){
    let currentIndex = array.length,  randomIndex;

    // While there remain elements to shuffle...
    while (currentIndex != 0) {
    
        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        
        // And swap it with the current element.
        [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }
    
    copiaArray = []
    
    // Copia o array embaralhado
    for(item of array){
        copiaArray.push(item);
    }
    
    return copiaArray;
}

function salvarItemSessao(nome, valorJSON){
    sessionStorage.setItem(nome, JSON.stringify(valorJSON));
    console.log('Item salvo em ' + nome);
}

function recuperarQuestionariosSessao(nome){
    valor = JSON.parse(sessionStorage.getItem(nome));

    console.log(valor);

    return valor;
}

function baixar(questionario){
    downloadTextFile(JSON.stringify(questionario), questionario.questionarios ? "savefile_questionario_list.txt" : "savefile_questionario.txt");
}

function downloadTextFile(text, filename) {
    const blob = new Blob([text], { type: 'text/plain' }); // Create a Blob
    const url = URL.createObjectURL(blob); // Create a URL for the Blob

    const link = document.createElement('a');
    link.href = url;
    link.download = filename || 'download.txt';
    link.style.display = 'none';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url); // Release the object URL
}