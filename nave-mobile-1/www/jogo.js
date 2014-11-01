var canvas, context;
var imagens, animacao, colisor, nave, painel, criadorInimigos;
var totalImagens = 0, carregadas = 0;

window.onload = function() {
	//document.addEventListener('deviceready', iniciar);
	iniciar();
}

var iniciar = function() {
	canvas = document.getElementById('jogo_nave');
	context = canvas.getContext('2d');
	carregarImagens();
}

var carregarImagens = function() {
	imagens = {
		espaco: 'fundo-espaco.png',
		estrelas: 'fundo-estrelas.png',
		nuvens: 'fundo-nuvens.png',
		nave: 'nave-spritesheet.png',
		ovni: 'ovni.png',
		explosao: 'explosao.png'
	};

	for (var i in imagens) {
		var img = new Image();
		img.src = 'img/' + imagens[i];
		img.onload = carregando;
		totalImagens++;
		imagens[i] = img;
	}
}

var carregando = function() {
	carregadas++;

	if (carregadas == totalImagens) {
		iniciarObjetos();
		document.getElementById('link_jogar').style.display = 'block';
	}
}