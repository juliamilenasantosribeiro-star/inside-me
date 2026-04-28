/* =============================================
   INSIDE-ME · script.js
   ============================================= */

// ── Frases motivacionais ──
const frases = [
  "Você é mais forte do que pensa. 💜",
  "Um passo de cada vez é suficiente.",
  "Falar sobre o que sente é um ato de coragem.",
  "Você merece apoio e cuidado.",
  "Respire. Cada momento difícil passa.",
  "Sua história importa. Você importa.",
  "Não existe sentimento errado — existe você, humano.",
  "Hoje pode ser difícil, mas você chegou até aqui.",
  "Pedir ajuda não é fraqueza — é sabedoria.",
  "Você não está sozinho nessa jornada.",
  "Cada amanhecer é uma nova chance de recomeçar.",
  "Cuidar de si mesmo é o maior ato de amor.",
];

let fraseAtual = -1;

function novaFrase() {
  let idx;
  do { idx = Math.floor(Math.random() * frases.length); } while (idx === fraseAtual);
  fraseAtual = idx;
  const el = document.getElementById("frase");
  if (!el) return;
  el.style.opacity = 0;
  setTimeout(() => {
    el.textContent = frases[idx];
    el.style.transition = "opacity .4s";
    el.style.opacity = 1;
  }, 200);
}

// Inicializa frase
(function() {
  const el = document.getElementById("frase");
  if (el) {
    fraseAtual = Math.floor(Math.random() * frases.length);
    el.textContent = frases[fraseAtual];
  }
})();

// ── Menu mobile ──
function toggleMenu() {
  const nav = document.querySelector("nav");
  nav.classList.toggle("aberto");
}

// ── Humor selecionado ──
let humorSelecionado = "";

function selecionarHumor(btn, emoji) {
  document.querySelectorAll(".humor-btn").forEach(b => b.classList.remove("selecionado"));
  btn.classList.add("selecionado");
  humorSelecionado = emoji;
}

// ── Contador de caracteres ──
const textarea = document.getElementById("mensagem");
if (textarea) {
  textarea.addEventListener("input", function() {
    const num = document.getElementById("charNum");
    if (num) num.textContent = this.value.length;
    if (this.value.length > 300) this.value = this.value.slice(0, 300);
  });
}

// ── Mural ──
function criarPost(nome, texto, humor, tempo) {
  const mural = document.getElementById("mural");
  if (!mural) return;

  // Remove empty state
  const empty = mural.querySelector(".empty-state");
  if (empty) empty.remove();

  const post = document.createElement("div");
  post.className = "post";
  post.dataset.humor = humor || "todos";

  const nomeDisplay = nome.trim() || "Anônimo";
  const tempoDisplay = tempo || formatarTempo(new Date());

  post.innerHTML = `
    <div class="post-header">
      <span class="post-nome">💜 ${nomeDisplay}</span>
      <span class="post-humor">${humor || ""}</span>
    </div>
    <div class="post-texto">${escapeHTML(texto)}</div>
    <div class="post-tempo">${tempoDisplay}</div>
  `;

  mural.prepend(post);
}

function formatarTempo(date) {
  const agora = new Date();
  const diff = Math.floor((agora - date) / 1000);
  if (diff < 60) return "agora mesmo";
  if (diff < 3600) return `há ${Math.floor(diff/60)} min`;
  if (diff < 86400) return `há ${Math.floor(diff/3600)}h`;
  return date.toLocaleDateString("pt-br");
}

function escapeHTML(str) {
  return str.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
}

function enviarMensagem() {
  const nome   = document.getElementById("nome")?.value || "";
  const texto  = document.getElementById("mensagem")?.value || "";
  const feedback = document.getElementById("feedback");

  if (texto.trim() === "") {
    mostrarFeedback("Por favor, escreva algo antes de publicar. 💜", "erro");
    return;
  }

  criarPost(nome, texto, humorSelecionado, "agora mesmo");

  // Salvar no localStorage
  const dados = JSON.parse(localStorage.getItem("insideme_msgs") || "[]");
  dados.push({
    nome:   nome,
    texto:  texto,
    humor:  humorSelecionado,
    tempo:  new Date().toISOString(),
  });
  localStorage.setItem("insideme_msgs", JSON.stringify(dados));

  // Atualiza contador
  atualizarContador(dados.length);

  // Limpa campos
  document.getElementById("mensagem").value = "";
  document.getElementById("nome").value = "";
  const charNum = document.getElementById("charNum");
  if (charNum) charNum.textContent = "0";
  humorSelecionado = "";
  document.querySelectorAll(".humor-btn").forEach(b => b.classList.remove("selecionado"));

  mostrarFeedback("Sua mensagem foi publicada no mural! Obrigado por compartilhar. 💜", "sucesso");
}

function mostrarFeedback(msg, tipo) {
  const el = document.getElementById("feedback");
  if (!el) return;
  el.textContent = msg;
  el.className = `feedback ${tipo}`;
  setTimeout(() => { el.className = "feedback hidden"; }, 4000);
}

function limparMural() {
  if (!confirm("Tem certeza que quer limpar todas as mensagens do mural?")) return;
  localStorage.removeItem("insideme_msgs");
  const mural = document.getElementById("mural");
  if (mural) {
    mural.innerHTML = `<div class="empty-state"><p>✨ Seja o primeiro a compartilhar algo hoje.</p></div>`;
  }
  atualizarContador(0);
}

function atualizarContador(n) {
  const el = document.getElementById("contador");
  if (el) el.textContent = n;
}

// Filtrar por humor
let filtroAtivo = "todos";

function filtrarHumor(btn, humor) {
  filtroAtivo = humor;
  document.querySelectorAll(".filtro-btn").forEach(b => b.classList.remove("active"));
  btn.classList.add("active");

  document.querySelectorAll(".post").forEach(post => {
    if (humor === "todos" || post.dataset.humor === humor) {
      post.style.display = "";
    } else {
      post.style.display = "none";
    }
  });
}

// ── Carregar mensagens salvas ──
window.addEventListener("load", function() {
  const dados = JSON.parse(localStorage.getItem("insideme_msgs") || "[]");
  dados.forEach(m => criarPost(m.nome, m.texto, m.humor, m.tempo ? formatarTempo(new Date(m.tempo)) : ""));
  atualizarContador(dados.length);
});

// ── Respiração ──
const tecnicas = {
  "478": {
    desc: "<strong>Técnica 4-7-8:</strong> Inspire por 4 segundos, segure por 7 e expire lentamente por 8. Ativa o sistema nervoso parassimpático e reduz o estado de alerta.",
    fases: [
      { nome: "Inspire", dur: 4 },
      { nome: "Segure", dur: 7 },
      { nome: "Expire", dur: 8 },
    ]
  },
  "box": {
    desc: "<strong>Box Breathing:</strong> Inspire por 4, segure por 4, expire por 4, segure por 4. Usada por atletas e militares para controlar o estresse rapidamente.",
    fases: [
      { nome: "Inspire", dur: 4 },
      { nome: "Segure", dur: 4 },
      { nome: "Expire", dur: 4 },
      { nome: "Segure", dur: 4 },
    ]
  },
  "365": {
    desc: "<strong>Coerência Cardíaca (3-6-5):</strong> 5 segundos inspirando, 5 expirando — 6 vezes por minuto. Praticada 3x ao dia, equilibra o sistema nervoso autônomo.",
    fases: [
      { nome: "Inspire", dur: 5 },
      { nome: "Expire", dur: 5 },
    ]
  }
};

let tecnicaAtual = "478";
let respiracaoAtiva = false;
let timeoutRespiracao = null;
let ciclos = 0;

function selecionarTecnica(btn, id) {
  tecnicaAtual = id;
  document.querySelectorAll(".tecnica-btn").forEach(b => b.classList.remove("active"));
  btn.classList.add("active");
  const desc = document.getElementById("tecnicaDesc");
  if (desc) desc.innerHTML = tecnicas[id].desc;
  pararRespiracao();
}

function iniciarRespiracao() {
  if (respiracaoAtiva) return;
  respiracaoAtiva = true;
  document.getElementById("btnIniciar")?.classList.add("hidden");
  document.getElementById("btnParar")?.classList.remove("hidden");
  ciclos = 0;
  atualizarCiclos();
  executarFase(0);
}

function pararRespiracao() {
  respiracaoAtiva = false;
  clearTimeout(timeoutRespiracao);
  document.getElementById("btnIniciar")?.classList.remove("hidden");
  document.getElementById("btnParar")?.classList.add("hidden");
  const texto = document.getElementById("respirarTexto");
  const cont  = document.getElementById("respirarCont");
  const circ  = document.getElementById("circulo");
  if (texto) texto.textContent = "Pronto?";
  if (cont)  cont.textContent = "";
  if (circ)  circ.parentElement.style.transform = "";
  resetProgresso();
}

function executarFase(idxFase) {
  if (!respiracaoAtiva) return;
  const fases = tecnicas[tecnicaAtual].fases;
  const fase  = fases[idxFase];

  const texto = document.getElementById("respirarTexto");
  const cont  = document.getElementById("respirarCont");
  const ext   = document.getElementById("circulo")?.parentElement;

  if (texto) texto.textContent = fase.nome;

  // Animação do círculo
  if (ext) {
    if (fase.nome === "Inspire") {
      ext.style.transition = `transform ${fase.dur}s ease-in`;
      ext.style.transform  = "scale(1.18)";
    } else if (fase.nome === "Expire") {
      ext.style.transition = `transform ${fase.dur}s ease-out`;
      ext.style.transform  = "scale(1)";
    } else {
      ext.style.transition = "none";
    }
  }

  // Progresso circular
  animarProgresso(fase.dur);

  // Contagem regressiva
  let restante = fase.dur;
  if (cont) cont.textContent = restante;

  const intervalo = setInterval(() => {
    restante--;
    if (cont) cont.textContent = restante > 0 ? restante : "";
    if (restante <= 0) clearInterval(intervalo);
  }, 1000);

  timeoutRespiracao = setTimeout(() => {
    const proxFase = (idxFase + 1) % fases.length;
    if (proxFase === 0) {
      ciclos++;
      atualizarCiclos();
    }
    executarFase(proxFase);
  }, fase.dur * 1000);
}

function animarProgresso(dur) {
  const bar = document.getElementById("progressoBar");
  if (!bar) return;
  bar.style.transition = "none";
  bar.style.strokeDashoffset = "565";
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      bar.style.transition = `stroke-dashoffset ${dur}s linear`;
      bar.style.strokeDashoffset = "0";
    });
  });
}

function resetProgresso() {
  const bar = document.getElementById("progressoBar");
  if (bar) { bar.style.transition = "none"; bar.style.strokeDashoffset = "565"; }
}

function atualizarCiclos() {
  const el = document.getElementById("ciclosNum");
  if (el) el.textContent = ciclos;
}
