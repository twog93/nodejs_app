'use strict'

let todoList;

const Entities = require('html-entities').XmlEntities;
const entities = new Entities();
const {ipcRenderer} = require('electron')


const deleteTodo = (e) => {

    console.log(e.target.textContent)
   ipcRenderer.send('delete-todo', e.target.textContent)

}

ipcRenderer.on('store-data', function(event, store) {

        if( store.todos) {

            store.todos.forEach(function (e) {
                let node = document.createElement("li")
                node.setAttribute("class", "todos")
                let textnode = document.createTextNode(e);
                node.appendChild(textnode)
                document.getElementById("todoList").appendChild(node)
            })
        }


    todoList = document.getElementById('todoList').querySelectorAll('.todos')


    todoList.forEach(item => {

        item.addEventListener('click', deleteTodo)
    })

})


document.querySelector('#submit').addEventListener('click', function(e) {


    const newtodo = entities.decode(document.getElementById("newtodo").value);

    if(newtodo) {
        console.log(newtodo)
        // send todos to main.js
        ipcRenderer.send('add-todo', newtodo)

    }
    else{

        alert('Merci de renseigner une tâche')
    }


})
