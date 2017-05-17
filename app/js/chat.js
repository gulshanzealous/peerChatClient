
const dgram =  require('dgram')
const clientSocket = dgram.createSocket('udp4')
const bluebird = require('bluebird')
let fs = require('fs')
let path = require( 'path')
let id = null;

const filePath = path.join(__dirname,'js','config.txt')
const defaults =  {
  encoding: 'utf8',
  flag: 'r'
};

let notifyCode = document.getElementById('notify-code')
let chatForm  = document.getElementById('chat-form')
let ulChatWindow = document.getElementById('chat-window')
let exitButton = document.getElementById('exit-chat')

chatForm.addEventListener('submit',handleChatSubmit)
exitButton.addEventListener('click',handleExitChat)

document.onload = startScript()

function handleChatSubmit(e){
	e.preventDefault()
	message = this.elements['message'].value
	addMyMessageToDOM(message)
	sendMessage( createPacket(message) )
	this.elements['message'].value = ''
}

function handleExitChat(){
	sendMessage( createPacket(null,true) )
	clientSocket.close()
	showAlertMessage('You have exited this chat. Return home to start again.')
}

function addMyMessageToDOM(message){
	let finalMessageArray = decomposeMessage(message)
	finalMessageArray.map( chunk => {
		if(chunk === 'break'){
			let lineBreak = document.createElement('br')
			ulChatWindow.appendChild(lineBreak)
		} else {
			let messageLi = document.createElement('li')
		    messageLi.setAttribute('class','my-message')
			ulChatWindow.appendChild(messageLi)
			messageLi.innerHTML = chunk
			messageLi.style.marginLeft = `${calculateLeftMargin(chunk.length)}%`  
		}
	})
	ulChatWindow.scrollTop = ulChatWindow.scrollHeight;
}

function addHisMessageToDOM(message){
	let finalMessageArray = decomposeMessage(message)
	finalMessageArray.map( chunk => {
		if(chunk === 'break'){
			let lineBreak = document.createElement('br')
			ulChatWindow.appendChild(lineBreak)
		} else {
			let messageLi = document.createElement('li')
		    messageLi.setAttribute('class','his-message')
			ulChatWindow.appendChild(messageLi)
			messageLi.innerHTML = chunk  
		}
	})
	ulChatWindow.scrollTop = ulChatWindow.scrollHeight;
}

function calculateLeftMargin(len) {
	if(len < 50){
		return 90 - ( ( len / 90 ) * 100 )
	}
	return 25
}

function decomposeMessage(message) {
	let len = message.length
	let lenHalf = parseInt(len/2)
	if(len > 50){
		let messageInit = message.substring(0,lenHalf)
		let messageLast = message.substring(lenHalf, len)
		let finalMessage = [ messageInit, messageLast ]
		console.log(`message: ${finalMessage}`)
		return finalMessage
	}
	return [ message ]
}

function firstPacket(message){
	return message + '|' + 'false' + '|' +  getIdFirst()
}

function createPacket(message, terminated = false){
	let packet = terminated === false? message : ( 'S User exited the chat' + 'true')
	// let packet =  message + '|' + 'false' + '|' +  getIdFirst() 
	return packet
}


function getIdFirst(){
	return fs.readFileSync(filePath, defaults).trim() // reads id from file and returns it
}


function sendMessage(packet){
	clientSocket.send( Buffer.from( packet ), 33476, '192.168.0.102' ) // server's address
}

function showAlertMessage(message){
	alert(message)
}


function startScript(){
	clientSocket.bind(()=>{
		// var address = clientSocket.address()
		// console.log(`client bound at ${address.address}:${address.port}`)
	})

	clientSocket.on('listening', () => {
		// var address = clientSocket.address()
		// console.log(`clientSocket listening ${address.address}:${address.port}`)
		let firstMessage = 'Hi there!'
		sendMessage( firstPacket(firstMessage) )
		addMyMessageToDOM(firstMessage)
	})


	clientSocket.on('error', (err) => {
		// console.log(`clientSocket error:\n${err.stack}`)
		showAlertMessage('Unexpected error occurred. Please restart the application.')
		clientSocket.close()
	})

	notifyCode.innerHTML = `Please share this code : ${getIdFirst()} with the other user to chat`

	clientSocket.on('message',(rawmsg,rinfo) => {
		var receivedMessage = rawmsg.toString('utf8')
		let serverFlag = receivedMessage[0]
		serverFlag === 'S' ? showAlertMessage(receivedMessage.substring(1,513)) : addHisMessageToDOM(receivedMessage)
	})

	// addMyMessageToDOM( 'Hello there' )
	// sendMessage( createPacket('Hello there') )

}

