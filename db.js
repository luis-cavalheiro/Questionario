const indexedDB = window.indexedDB;
const nomeDatabase = "Questionarios";
const nomeTabelaQuestionario = "questionarios";
const nomeTabelaPerguntas = "perguntas";

// Abrir ou criar o database
const request = indexedDB.open(nomeDatabase, 1);

// Mensagem de erro ao tentar abrir o database
request.onerror = function(event){
    console.error("Erro ao acessar a database de questionarios");
    console.error(event);
}

// Cria a estrutura da base de dados (caso ela ainda não exista)
request.onupgradeneeded = function(event){
    upgradeDatabase(event);
};

function upgradeDatabase(event){
    //const db = request.result;
    const db = event.target.result;

    // Cria tabela de questionarios
    // const store = db.createObjectStore(nomeTabelaQuestionario, { keyPath: "id", autoIncrement: true });
    if (!db.objectStoreNames.contains(nomeTabelaQuestionario)) {
        const store = db.createObjectStore(nomeTabelaQuestionario, { keyPath: "id", autoIncrement: true });
    }

    // Cria tabela de perguntas
    // const storePerguntas = db.createObjectStore(nomeTabelaPerguntas, { keyPath: "id"});
    if (!db.objectStoreNames.contains(nomeTabelaPerguntas)) {
        const storePerguntas = db.createObjectStore(nomeTabelaPerguntas, { keyPath: "id"});
    }

    // storePerguntas.createIndex("temas", ["temas"], { unique: false});
    // storePerguntas.createIndex("banca", ["banca"], { unique: false});
}

// ------------------------------ Transição -----------------------------------
async function portarQuestionario(questionario){
    console.log(`----------questionario`);
    if (!questionario.pergunta)
        questionario.perguntas = [];
    console.log(questionario);

    console.log(`----------salvando perguntas`);
    //var idCriado = await tryAdicionarQuestionario(questionario);
    questionario.listaPerguntas

    // para cada pergunta dentro do questionario
    for(var item of questionario.data){
        // adicionar na tabela de perguntas
        item.id = undefined;
        //console.log(item);
        var idCriado = await tryAdicionarItemTabela(nomeTabelaPerguntas, item);
        questionario.perguntas.push(idCriado);
    }

    console.log(`----------questionario FIM`);
    console.log(questionario);

    var novoQuestionario = {
        name: questionario.name,
        data: questionario.perguntas
    }

    await tryAdicionarItemTabela(nomeTabelaQuestionario, novoQuestionario);
}

// ------------------------------ Operações DB -----------------------------------
function adicionarItemTabela(nomeTabela, itemTabela){
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(nomeDatabase);

        request.onsuccess = function(event) {
            const db = event.target.result;
            // Cria uma transaction - agrupa operações e se uma falhar, faz o rollback
            const transaction = db.transaction([nomeTabela], 'readwrite');
            // Pega a tabela de perguntas
            const objectStore = transaction.objectStore(nomeTabela);

            // Cria um id para a pergunta, caso ela já não tenha
            if (!itemTabela.id)
                itemTabela.id = criarID();

            // Adicionar item na tabela
            const addRequest = objectStore.put(itemTabela);

            // Sucesso ao adicionar item na tabela
            addRequest.onsuccess = function() {
                resolve(addRequest.result);
            };

            // Erro ao adicionar item na tabela
            addRequest.onerror = function() {
                reject('Erro ao adicionar item de tabela: ' + addRequest.error);
            };

            transaction.oncomplete = function() {
                db.close();
            }
        };

        // Erro ao tentar acessar a database
        request.onerror = function(event) {
            reject('Erro ao tentar encontrar o database: ' + event.target.error);
        };
    });
}

async function tryAdicionarItemTabela(nomeTabela, itemTabela){
    var idCriado = null;

    await adicionarItemTabela(nomeTabela, itemTabela)
    .then((message) => idCriado = message)
    .catch(error => console.error(error));

    console.log(idCriado)

    return idCriado;
}

function retornarItemDeUmaTabela(nomeTabela, id){
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(nomeDatabase);

        request.onsuccess = function(event) {
            const db = event.target.result;
            const transaction = db.transaction([nomeTabela], 'readonly');
            const objectStore = transaction.objectStore(nomeTabela);
            // Procura por um id, se não tiver fornecido um id, traz todos os itens da tabela
            
            const getRequest = id != undefined   ? objectStore.get(id) : objectStore.getAll();
            
            getRequest.onsuccess = function() {
                if (getRequest.result) {
                    resolve(getRequest.result);
                } else {
                    reject('No entry found with the specified key.');
                }
            };
            getRequest.onerror = function() {
                reject('Error retrieving item: ' + getRequest.error);
            };
            transaction.oncomplete = function() {
                db.close();
            }
        };

        request.onerror = function(event) {
            reject('Database error: ' + event.target.error);
        };
    });
}

async function tryRetornarItemDeUmaTabela(nomeTabela, id){
    var itemRecuperado;
    
    await retornarItemDeUmaTabela(nomeTabela, id)
    .then(item => itemRecuperado = item)
    .catch(error => console.error(error));
    
     return itemRecuperado;
}

function removerItemDeUmaTabela(tabela, item){
    return new Promise((resolve, reject) => {
        // Conecta ao banco
        const request = indexedDB.open(nomeDatabase, 1);

        // Conseguiu se conectar ao database
        request.onsuccess = function(event) {
            const db = event.target.result;
            const transaction = db.transaction([tabela], 'readwrite');
            // Acessa a tabela
            const objectStore = transaction.objectStore(tabela);
            // Deleta o item
            const addRequest = objectStore.delete(item.id);

            // Conseguiu deletar o item
            addRequest.onsuccess = function() {
                resolve('Item deleted successfully!');
            };

            // Falha ao deletar o item
            addRequest.onerror = function() {
                reject('Error deleting item: ' + addRequest.error);
            };

            transaction.oncomplete = function() {
                db.close();
            }
        };

        // Falha ao conectar ao database
        request.onerror = function(event) {
            reject('Database error: ' + event.target.error);
        };
    });
}

async function tryRemoverItemDeUmaTabela(tabela, item){
    if (id != null){
        await removerItemDeUmaTabela(tabela, item)
        .then(message => console.log(message))
        .catch(error => console.error(error));
    }
}


// ------------------------------ Auxiliar -----------------------------------
function criarID(){
    // O UUID v4 possui um formato fixo com a estrutura "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx"
    return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11)
    .replace(/[018]/g, c =>
        // Para cada caractere, substituímos por um valor aleatório hexadecimal
        (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    );
}

// ------------------------------ OLD -----------------------------------
// function getItemFromIndexedDB(dbName, storeName, key) {
//     return new Promise((resolve, reject) => {
//         const request = indexedDB.open(dbName);

//         request.onsuccess = function(event) {
//             const db = event.target.result;
//             const transaction = db.transaction([storeName], 'readonly');
//             const objectStore = transaction.objectStore(storeName);
//             const getRequest = objectStore.get(key);

//             getRequest.onsuccess = function() {
//                 if (getRequest.result) {
//                     resolve(getRequest.result);
//                 } else {
//                     reject('No entry found with the specified key.');
//                 }
//             };

//             getRequest.onerror = function() {
//                 reject('Error retrieving item: ' + getRequest.error);
//             };
//         };

//         request.onerror = function(event) {
//             reject('Database error: ' + event.target.error);
//         };
//     });
// }

// function getAll(dbName, storeName) {
//     return new Promise((resolve, reject) => {
//         const request = indexedDB.open(dbName);

//         request.onsuccess = function(event) {
//             const db = event.target.result;
//             const transaction = db.transaction([storeName], 'readonly');
//             const objectStore = transaction.objectStore(storeName);
//             const getRequest = objectStore.getAll();

//             getRequest.onsuccess = function() {
//                 if (getRequest.result) {
//                     resolve(getRequest.result);
//                 } else {
//                     reject('No entry found with the specified key.');
//                 }
//             };

//             getRequest.onerror = function() {
//                 reject('Error retrieving item: ' + getRequest.error);
//             };
//         };

//         request.onerror = function(event) {
//             reject('Database error: ' + event.target.error);
//         };
//     });
// }

// function addItemToIndexedDB(dbName, storeName, item) {
//     return new Promise((resolve, reject) => {
//         const request = indexedDB.open(dbName, 1);

//         request.onupgradeneeded = function(event) {
//             const db = event.target.result;
//             // Create an object store if it doesn't exist
//             if (!db.objectStoreNames.contains(storeName)) {
//                 db.createObjectStore(storeName, { keyPath: 'id' });
//             }
//         };

//         request.onsuccess = function(event) {
//             const db = event.target.result;
//             const transaction = db.transaction([storeName], 'readwrite');
//             const objectStore = transaction.objectStore(storeName);
//             const addRequest = objectStore.put(item);

//             addRequest.onsuccess = function() {
//                 resolve('Item added successfully!');
//             };

//             addRequest.onerror = function() {
//                 reject('Error adding item: ' + addRequest.error);
//             };
//         };

//         request.onerror = function(event) {
//             reject('Database error: ' + event.target.error);
//         };
//     });
// }

// function removeItemToIndexedDB(dbName, storeName, item) {
//     return new Promise((resolve, reject) => {
//         const request = indexedDB.open(dbName, 1);

//         request.onupgradeneeded = function(event) {
//             const db = event.target.result;
//             // Create an object store if it doesn't exist
//             if (!db.objectStoreNames.contains(storeName)) {
//                 db.createObjectStore(storeName, { keyPath: 'id' });
//             }
//         };

//         request.onsuccess = function(event) {
//             const db = event.target.result;
//             const transaction = db.transaction([storeName], 'readwrite');
//             const objectStore = transaction.objectStore(storeName);
//             const addRequest = objectStore.delete(item.id);

//             addRequest.onsuccess = function() {
//                 resolve('Item deleted successfully!');
//             };

//             addRequest.onerror = function() {
//                 reject('Error deleting item: ' + addRequest.error);
//             };
//         };

//         request.onerror = function(event) {
//             reject('Database error: ' + event.target.error);
//         };
//     });
// }

// Usage
const newItem = {name: 'Novo Questionario', data: []};

// addItemToIndexedDB('Questionarios', 'questionarios', newItem)
//     .then(message => console.log(message))
//     .catch(error => console.error(error));

// async function getQuestionario(id){
//     var questionarioRecuperado;

//     if (id != null){
//         await getItemFromIndexedDB('Questionarios', 'questionarios', id)
//         .then(item => questionarioRecuperado = item)
//         .catch(error => console.error(error));
//     }

//      return questionarioRecuperado;
// }

// async function atualizarQuestionarioDB(questionario){
//     var questionarioRecuperado = null;

//     if (questionario.id)
//         await getItemFromIndexedDB('Questionarios', 'questionarios', questionario.id)
//         .then(item => questionarioRecuperado = item)
//         .catch(error => console.error(error));
//     else
//         questionarioRecuperado = questionario;

//     if (questionarioRecuperado){
//         // substitui os dados do questonario
//         questionarioRecuperado.data = questionario.data;
//         questionarioRecuperado.name = questionario.name;

//         // Tentar atualizar
//         await addItemToIndexedDB('Questionarios', 'questionarios', questionarioRecuperado)
//              .then(message => console.log("Questionario atualizado!"))
//              .catch(error => console.error(error)); 
//      }
// }

// async function deletarQuestionarioDB(questionario){
//     var questionarioRecuperado = null;

//     if (questionario.id)
//         await getItemFromIndexedDB('Questionarios', 'questionarios', questionario.id)
//         .then(item => questionarioRecuperado = item)
//         .catch(error => console.error(error));

//     if (questionarioRecuperado){
//         console.log("Deletando");
//         // Tentar Deletar
//         await removeItemToIndexedDB('Questionarios', 'questionarios', questionarioRecuperado)
//              .then(message => console.log("Questionario atualizado!"))
//              .catch(error => console.error(error)); 
//      }
// }

// async function salvarNovoQuestionarioDB(questionario){
//     await  addItemToIndexedDB('Questionarios', 'questionarios', questionario)
//     .then(message => console.log("Questionario salvo!"))
//     .catch(error => console.error(error)); 
// }   

// async function recuperarListaQuestionarios(){
//     var todosQuestionarios = null;

//     await getAll('Questionarios', 'questionarios')
//     .then(item => todosQuestionarios = item)
//     .catch(error => console.error(error));

//     return todosQuestionarios;
// }


// async function baixarDB(){
//     var listaRecuperada = await recuperarListaQuestionarios();

//     if (listaRecuperada){
//         //console.log(listaRecuperada);
//         downloadTextFile(JSON.stringify(listaRecuperada), "listaQuestionarios.txt");
//     }
// }

// async function baixarQuestionarioDB(questionario){
//     if (questionario)
//         downloadTextFile(JSON.stringify(questionario), "questionario.txt");
// }

// function downloadTextFile(text, filename) {
//     const blob = new Blob([text], { type: 'text/plain' }); // Create a Blob
//     const url = URL.createObjectURL(blob); // Create a URL for the Blob

//     const link = document.createElement('a');
//     link.href = url;
//     link.download = filename || 'download.txt';
//     link.style.display = 'none';

//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);

//     URL.revokeObjectURL(url); // Release the object URL
// }