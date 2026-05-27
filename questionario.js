const NOME_QUESTIONARIO = "ID_questionario";
const LIMITE_PERGUNTAS = "LIMITEPERGUNTAS";
const OPCAO_INVERTER = "INVERTERQUESTIONARIO";
const OPCAO_LIMITAR_TOTAL = "OPCAOLIMITARTOTAL"
const NIGHT_MODE = "NIGHTMODE"
//const NOME_QUESTIONARIOS_LISTA = "questionarios";

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

    // for(var pergunta of questionario.data){
    //     // Alternativas
    //     pergunta = aleatorizarItens(pergunta.data);
    // }
}

function aleatorizarItens(array){
    let currentIndex = array.length,  randomIndex;

    console.log("ALEATORIZANDO", array);

    // Se as alternativas forem de acertou/errou então não muda ordem das alternativas
    if (array.length == 2 && array[0].name == "Acertou" && array[1].name == "Errou")
        return array;

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

    //console.log(valor);

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



function changeNightMode(){
    // Pega variavel night mode e muda
    let nightMode = sessionStorage.getItem(NIGHT_MODE);
    
    if (nightMode == null || nightMode == undefined)
        nightMode = 'false'
    
    // Inverter night mode
    switch(nightMode){
        case 'true':
        case true:
            nightMode = 'false';
            break;
        case 'false':
        case false:
            nightMode = 'true';
            break;
    }
    
    console.log(nightMode);

    $("#night-mode-toggle").css('transform', nightMode == 'true' ? 'translateX(-50%)' : 'translateX(-0%)')

    sessionStorage.setItem(NIGHT_MODE, nightMode);

    changeNightModeClasses(nightMode);
}

function changeNightModeClasses(nightMode){
    if (nightMode == 'true'){
        $("html").css("background-color", "rgb(31 31 31)");
        $(".btn-lista-txt").addClass("night-mode-background");
        $("h2, .fa-caret-left, .fa-caret-right, label, output, .fa-pen-to-square, #pergunta, #explicaco-pergunta, .btn-lista-txt").addClass("night-mode-text");
        
    }
    else {
        $("html").css("background-color", "white");
        $(".btn-lista-txt").removeClass("night-mode-background");
        $("h2, .fa-caret-left, .fa-caret-right, label, output, .fa-pen-to-square, #pergunta, #explicaco-pergunta, .btn-lista-txt").removeClass("night-mode-text");
    }
}

function construirWidget(id){
    $(`#${id}`).html(`
        <!-- night mode -->
        <div style="
            width: 6.2em;
            height: 3.5em;
            position: absolute;
            overflow: hidden;
            right: 2%;
            bottom: 1%;
            border-radius: 6em;
            cursor: pointer;
                ">
            <div onclick="changeNightMode()" id="night-mode-toggle" style="display: flex; transform: translateX(0%); transition: transform 0.2s;    height: 100%;width: 200%;">
                <div class="day text-center " style="background: #6579ad;border-radius: 5px;z-index: -1;display:flex;width:100%">
                    <div class="text-center" style="position:absolute;left: -11%;top: 24%;transform: rotateY(180deg);">
                        <i class="fa-solid fa-cloud fa-2x" style="color: white;"></i>
                    </div>
                    <i class="fa-solid fa-sun" style="color: #f7cb8a;font-size: 2.3em;margin: auto;"></i>
                </div>
                
                
                <div class="night text-center " style="background: #354265;border-radius: 5px;display:flex; width:100%">
                    <div class="text-center" style="position:absolute;left: 40%;top: 24%;">
                        <i class="fa-solid fa-cloud fa-2x" style="color: white;"></i>
                    </div>
                        <div class="text-center" style="position:absolute;right: -10%;top: 24%;transform: rotateY(180deg);">
                        <i class="fa-solid fa-cloud fa-2x" style="color: white;"></i>
                    </div>
                    <i class="fa-solid fa-moon fa" style="color: #fff8d6;font-size: 2.3em; margin: auto;"></i>
                </div>
            </div>
        </div>
        `);

    changeNightMode();
    changeNightMode();
}