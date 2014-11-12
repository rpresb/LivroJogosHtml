var canvas, context;
var imagens, animacao, colisor, nave, painel, criadorInimigos;
var totalImagens = 0, carregadas = 0;
var musicaAcao, somTiro, somExplosao;

window.onload = function() {
	document.addEventListener('deviceready', iniciar);
	//iniciar();
}

var iniciar = function() {
	canvas = document.getElementById('jogo_nave');
	context = canvas.getContext('2d');
	carregarImagens();
	carregarSons();
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

var carregarSons = function() {
	try {
		musicaAcao = new Media('file:///android_asset/musica-acao.mp3');
		somTiro = new Media('file:///android_asset/tiro.mp3');
		somExplosao = new Media('file:///android_asset/explosao.mp3');
	} catch(e) {
	}
}

var carregando = function() {
	carregadas++;

	if (carregadas == totalImagens) {
		iniciarObjetos();
		document.getElementById('link_jogar').style.display = 'block';
	}
}

var iniciarObjetos = function() {
	animacao = new Animacao(context);
	colisor = new Colisor();
	espaco = new Fundo(context, imagens.espaco);
	estrelas = new Fundo(context, imagens.estrelas);
	nuvens = new Fundo(context, imagens.nuvens);

	nave = new Nave(context, imagens.nave, imagens.explosao);
	painel = new Painel(context, nave);

	animacao.novoSprite(espaco);
	animacao.novoSprite(estrelas);
	animacao.novoSprite(nuvens);
	animacao.novoSprite(painel);
	animacao.novoSprite(nave);

	colisor.novoSprite(nave);
	animacao.novoProcessamento(colisor);

	configuracoesIniciais();
}

var configuracoesIniciais = function() {
	espaco.velocidade = 60;
	estrelas.velocidade = 150;
	nuvens.velocidade = 500;

	nave.posicionar();
	nave.velocidade = 200;

	criacaoInimigos();

	nave.acabaramVidas = function() {
		animacao.desligar();
		gameOver();
	}

	colisor.aoColidir = function(o1, o2) {
		if ( (o1 instanceof Tiro && o2 instanceof Ovni) || (o1 instanceof Ovni && o2 instanceof Tiro) ) {
			painel.pontuacao += 10;

			somExplosao.seekTo(0);
			somExplosao.play();
		}

		if ( (o1 instanceof Nave && o2 instanceof Ovni) || (o1 instanceof Ovni && o2 instanceof Nave) ) {
			somExplosao.seekTo(0);
			somExplosao.play();
		}
	}
}

var criacaoInimigos = function() {
	criadorInimigos = {
		ultimoOvni: Date.now(),
		processar: function () {
			var agora = Date.now();
			var decorrido = agora - this.ultimoOvni;

			if (decorrido > 1000) {
				novoOvni();
				this.ultimoOvni = agora;
			}
		}
	};

	animacao.novoProcessamento(criadorInimigos);
}

var novoOvni = function() {
	var imgOvni = imagens.ovni;
	var ovni = new Ovni(context, imgOvni, imagens.explosao);

	ovni.velocidade = Math.floor(500 + Math.random() * (1000 - 500 + 1));

	ovni.x = Math.floor(Math.random() * (canvas.width - imgOvni.width + 1));
	ovni.y = -imgOvni.height;

	animacao.novoSprite(ovni);
	colisor.novoSprite(ovni);
}

var iniciarJogo = function() {
	criadorInimigos.ultimoOvni = Date.now();
	document.getElementById('link_jogar').style.display = 'none';
	painel.pontuacao = 0;
	animacao.ligar();

	musicaAcao.seekTo(0);
	musicaAcao.play();
}

var gameOver = function() {
	musicaAcao.pause();

	document.getElementById('link_jogar').style.display = 'block';
	nave.vidasExtras = 3;
	nave.posicionar();

	animacao.novoSprite(nave);
	colisor.novoSprite(nave);

	removerInimigos();

	//alert('Game Over');
}

var removerInimigos = function() {
	for (var i in animacao.sprites) {
		if (animacao.sprites[i] instanceof Ovni || animacao.sprites[i] instanceof Tiro) {
			animacao.excluirSprite(animacao.sprites[i]);
		}
	}
}
