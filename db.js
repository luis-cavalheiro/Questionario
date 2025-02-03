const indexedDB = window.indexedDB;

const request = indexedDB.open("Questionarios", 1);

// Mensagem de erro
request.onerror = function(event){
    console.error("Erro ao acessar a database de questionarios");
    console.error(event);
}

// Cria a estrutura da base de dados
request.onupgradeneeded = function(event){
    const db = request.result;
    // Cria uma tabela
    const store = db.createObjectStore("questionarios", { keyPath: "id", autoIncrement: true });
    //store.createIndex("names", ["name"], { unique: false});
};

// // operaçoes
// request.onsuccess = function(){
//     // Acessa o Database
//     const db = request.result;

//     // Operaçoes
//     const transaction = db.transaction("questionarios", "readwrite");

//     // Tabela
//     const store = transaction.objectStore("questionarios");
//     //const index = store.index("names");

//     // Adicionar dados
//     store.put({id:1, name: "Nome Questionario", data: []});

//     // Pegar item
//     const idQuery = store.get(1);
//     //const nameQuery =  index.getAll(["Teste"]);

//     // roda se der tudo certo
//     idQuery.onsucess = function() {
//         console.log("idQuery", idQuery.result)
//     }

//     transaction.oncomplete = function() {
//         // Fecha database
//         db.close();
//     }
// }

function getItemFromIndexedDB(dbName, storeName, key) {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(dbName);

        request.onsuccess = function(event) {
            const db = event.target.result;
            const transaction = db.transaction([storeName], 'readonly');
            const objectStore = transaction.objectStore(storeName);
            const getRequest = objectStore.get(key);

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
        };

        request.onerror = function(event) {
            reject('Database error: ' + event.target.error);
        };
    });
}

function getAll(dbName, storeName) {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(dbName);

        request.onsuccess = function(event) {
            const db = event.target.result;
            const transaction = db.transaction([storeName], 'readonly');
            const objectStore = transaction.objectStore(storeName);
            const getRequest = objectStore.getAll();

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
        };

        request.onerror = function(event) {
            reject('Database error: ' + event.target.error);
        };
    });
}

/*
getItemFromIndexedDB('Questionarios', 'questionarios', 1)
     .then(item => console.log('Retrieved item:', item))
     .catch(error => console.error(error));
*/

function addItemToIndexedDB(dbName, storeName, item) {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(dbName, 1);

        request.onupgradeneeded = function(event) {
            const db = event.target.result;
            // Create an object store if it doesn't exist
            if (!db.objectStoreNames.contains(storeName)) {
                db.createObjectStore(storeName, { keyPath: 'id' });
            }
        };

        request.onsuccess = function(event) {
            const db = event.target.result;
            const transaction = db.transaction([storeName], 'readwrite');
            const objectStore = transaction.objectStore(storeName);
            const addRequest = objectStore.put(item);

            addRequest.onsuccess = function() {
                resolve('Item added successfully!');
            };

            addRequest.onerror = function() {
                reject('Error adding item: ' + addRequest.error);
            };
        };

        request.onerror = function(event) {
            reject('Database error: ' + event.target.error);
        };
    });
}

function removeItemToIndexedDB(dbName, storeName, item) {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(dbName, 1);

        request.onupgradeneeded = function(event) {
            const db = event.target.result;
            // Create an object store if it doesn't exist
            if (!db.objectStoreNames.contains(storeName)) {
                db.createObjectStore(storeName, { keyPath: 'id' });
            }
        };

        request.onsuccess = function(event) {
            const db = event.target.result;
            const transaction = db.transaction([storeName], 'readwrite');
            const objectStore = transaction.objectStore(storeName);
            const addRequest = objectStore.delete(item.id);

            addRequest.onsuccess = function() {
                resolve('Item deleted successfully!');
            };

            addRequest.onerror = function() {
                reject('Error deleting item: ' + addRequest.error);
            };
        };

        request.onerror = function(event) {
            reject('Database error: ' + event.target.error);
        };
    });
}

// Usage
const newItem = {name: 'Novo Questionario', data: []};

// addItemToIndexedDB('Questionarios', 'questionarios', newItem)
//     .then(message => console.log(message))
//     .catch(error => console.error(error));

async function getQuestionario(id){
    var questionarioRecuperado;

    if (id != null){
        await getItemFromIndexedDB('Questionarios', 'questionarios', id)
        .then(item => questionarioRecuperado = item)
        .catch(error => console.error(error));
    }

     return questionarioRecuperado;
}

async function atualizarQuestionarioDB(questionario){
    var questionarioRecuperado = null;

    if (questionario.id)
        await getItemFromIndexedDB('Questionarios', 'questionarios', questionario.id)
        .then(item => questionarioRecuperado = item)
        .catch(error => console.error(error));
    else
        questionarioRecuperado = questionario;

    if (questionarioRecuperado){
        // substitui os dados do questonario
        questionarioRecuperado.data = questionario.data;
        questionarioRecuperado.name = questionario.name;

        // Tentar atualizar
        await addItemToIndexedDB('Questionarios', 'questionarios', questionarioRecuperado)
             .then(message => console.log("Questionario atualizado!"))
             .catch(error => console.error(error)); 
     }
}

async function deletarQuestionarioDB(questionario){
    var questionarioRecuperado = null;

    if (questionario.id)
        await getItemFromIndexedDB('Questionarios', 'questionarios', questionario.id)
        .then(item => questionarioRecuperado = item)
        .catch(error => console.error(error));

    if (questionarioRecuperado){
        console.log("Deletando");
        // Tentar Deletar
        await removeItemToIndexedDB('Questionarios', 'questionarios', questionarioRecuperado)
             .then(message => console.log("Questionario atualizado!"))
             .catch(error => console.error(error)); 
     }
}

async function salvarNovoQuestionarioDB(questionario){
    await  addItemToIndexedDB('Questionarios', 'questionarios', questionario)
    .then(message => console.log("Questionario salvo!"))
    .catch(error => console.error(error)); 
}   

async function recuperarListaQuestionarios(){
    var todosQuestionarios = null;

    await getAll('Questionarios', 'questionarios')
    .then(item => todosQuestionarios = item)
    .catch(error => console.error(error));

    return todosQuestionarios;
}


async function baixarDB(){
    var listaRecuperada = await recuperarListaQuestionarios();

    if (listaRecuperada){
        //console.log(listaRecuperada);
        downloadTextFile(JSON.stringify(listaRecuperada), "listaQuestionarios.txt");
    }
}

async function baixarQuestionarioDB(questionario){
    if (questionario)
        downloadTextFile(JSON.stringify(questionario), "questionario.txt");
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