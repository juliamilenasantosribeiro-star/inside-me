
const frases=[

"Você é mais forte do que pensa.",
"Um passo de cada vez.",
"Falar ajuda a aliviar.",
"Você merece apoio.",
"Respire. Tudo pode melhorar."

]

document.getElementById("frase").innerText=
frases[Math.floor(Math.random()*frases.length)]

window.onload=function(){

let dados=JSON.parse(localStorage.getItem("mensagens"))||[]

dados.forEach(m=>criarPost(m.nome,m.texto))

document.getElementById("contador").innerText=dados.length

}

function criarPost(nome,texto){

let mural=document.getElementById("mural")

let post=document.createElement("div")

post.className="post"

post.innerHTML=
"<b>"+(nome||"Anônimo")+"</b><br>"+texto

mural.prepend(post)

}

function enviarMensagem(){

let nome=document.getElementById("nome").value

let texto=document.getElementById("mensagem").value

if(texto.trim()=="") return

criarPost(nome,texto)

let dados=JSON.parse(localStorage.getItem("mensagens"))||[]

dados.push({nome:nome,texto:texto})

localStorage.setItem("mensagens",JSON.stringify(dados))

document.getElementById("contador").innerText=dados.length

document.getElementById("mensagem").value=""

}

function limparMural(){

localStorage.removeItem("mensagens")

document.getElementById("mural").innerHTML=""

document.getElementById("contador").innerText=0

}
