
let fs = require('fs')
let path = require( 'path')

const defaults =  {
  encoding: 'utf8',
  mode: 0o666,
  flag: 'w+'
};

const filePath = path.join(__dirname,'js','config.txt')

// let writeStream = fs.createWriteStream(filePath, defaults )

// let readStream = fs.createReadStream(filePath, defaults )

// STAGE ONE

let haveCodeBtn = document.getElementById('have-code-btn')

let newCodeBtn = document.getElementById('new-code-btn')

let codeForm = document.getElementById('have-code')

let newCodeBox = document.getElementById('gen-code')

let codeInfo = document.getElementById('code-info')

// console.log(genCodeBtn)

haveCodeBtn.addEventListener('click',showCodeForm)

newCodeBtn.addEventListener('click',showNewCode,false)


function showCodeForm(){
	codeForm.style.display = 'flex'
	codeInfo.style.display = 'flex'
	newCodeBox.style.display = 'none'
}

function showNewCode(){
	let newCode = randomString(16,'0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ')
	document.getElementsByClassName('code-div')[0].innerHTML = newCode
	saveToConfig(newCode)

	newCodeBox.style.display = 'flex'
	codeInfo.style.display = 'flex'
	codeForm.style.display = 'none'
}

function randomString(length, chars) {
    var result = '';
    for (var i = length; i > 0; --i) result += chars[Math.round(Math.random() * (chars.length - 1))];
    return result+'\n';
}


// STAGE TWO

codeForm.addEventListener('submit',submitEnteredCode)

function submitEnteredCode(){
	saveToConfig(this.elements['hasId'].value)
}


function saveToConfig(code){

	fs.writeFileSync(filePath,code,(err)=>{
		if(err){
			return alert('error occurred')
			// console.log(err)
		}
		// console.log(code)

	})

}


// STAGE 3































































// let id = null
// let terminated = 'false'
// let message = 'hello world'

// var packet = id + '|' +terminated + '|' + message


// let submittedCode = getSubmittedCode()

// let code = null
// let form = document.getElementById('code-submit')
// form.addEventListener('submit',function(){


// })


// if(id !== null) {

// }

