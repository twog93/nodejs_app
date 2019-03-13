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

chatManager
    .connect()
    .then(cUser => {
        currentUser = cUser
        window.currentUser = cUser

        currentUser.fetchMessages({
            roomId: 19875528,
            limit: 10,
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

chatManager.connect()
    .then(currentUser =>{
        currentUser.sendSimpleMessage({
            text: "ca marche",
            roomId: "19875528"
        });
    })
    .then(res => console.log('sent message with id', res.id))
    .catch(err => console.error(err))

document.querySelector('#submitMessage').addEventListener('click', function() {


    message = entities.decode(document.getElementById("message").value);

    if(message) {
        chatManager.connect()
            .then(currentUser =>{
                currentUser.sendSimpleMessage({
                    text: message,
                    roomId: "19875528"
                });
            })
            .then(res => console.log('sent message with id', res.id))
            .catch(err => console.error(err))
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
