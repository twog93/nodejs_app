'use strict'

const Entities = require('html-entities').XmlEntities
const {ipcRenderer} = require('electron')
const entities = new Entities()
let message
let currentUser

const { ChatManager, TokenProvider } = require('@pusher/chatkit')

const chatManager = new ChatManager({
    instanceLocator: "v1:us1:ed63e27b-a829-427d-b30d-f9d3818d59d7",
    userId: "gaga",
    tokenProvider: new TokenProvider({
        url: "https://us1.pusherplatform.io/services/chatkit_token_provider/v1/ed63e27b-a829-427d-b30d-f9d3818d59d7/token"
    })
})

chatManager.connect().then(cUser => {
    currentUser = cUser
    window.currentUser = cUser

}).catch(err => {
    console.log(`Error fetching messages: ${err}`)
})


chatManager
    .connect()
    .then(cUser => {
        currentUser = cUser
        window.currentUser = cUser

        currentUser.fetchMessages({
            roomId: 19875528,
            limit: 20,
        })
            .then(messages => {
                messages.forEach(function (e) {
                    let node = document.createElement("li")
                    node.setAttribute("class", "messages")
                    let textnode = document.createTextNode(e.text);
                    node.appendChild(textnode)
                    document.getElementById("list-message").appendChild(node)
                })

            })
            .catch(err => {
                console.log(`Error fetching messages: ${err}`)
            })

    })
    .catch(err => {
        console.log('Error on connection', err)
    })


console.log(currentUser)
/*
chatManager
    .connect()
    .then(currentUser => {

        return currentUser.subscribeToRoom({
        roomId: currentUser.rooms[0].id,
        hooks: {
            onMessage: message => {
                listMessages.push(message)
                console.log("received message", message)
            }
        },
        messageLimit: 0
    })})
*/




document.querySelector('#submitMessage').addEventListener('click', function(e) {

    e.preventDefault()
    message = entities.decode(document.getElementById("message").value);

    if(message) {
        currentUser.sendMessage({
            text: message,
            roomId: currentUser.rooms[0].id
        });
        let node = document.createElement("li")
        node.setAttribute("class", "messages")
        let textnode = document.createTextNode(message);
        node.appendChild(textnode)
        document.getElementById("list-message").appendChild(node)
        document.getElementById('message').value  = ''
    }

    else{

        alert(console.error())
    }


})





document.querySelector('#submit').addEventListener('click', function() {


    let username = entities.decode(document.getElementById("username").value);

    if(username)
    // send username to main.js
        ipcRenderer.send('add-user-chat', username )
    else{

        alert(console.error())
    }


})
