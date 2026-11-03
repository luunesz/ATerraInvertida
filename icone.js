// A Terra Invertida · feito por Lune, @luunesz
// Alterna o ícone da aba entre duas imagens (olho escuro e olho claro).
// Aba em segundo plano: os navegadores deixam o temporizador mais lento, então a troca pode demorar mais.
(function () {
  var imagens = ['icone1.png', 'icone2.png'];
  var intervalo = 1000; // milissegundos entre uma imagem e outra

  var link = document.querySelector('link[rel~="icon"]');
  if (!link) return;

  // Respeita quem pede menos movimento: o ícone fica parado na primeira imagem.
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  // Carrega as duas antes, para a troca não piscar em branco.
  imagens.forEach(function (src) { new Image().src = src; });

  var atual = 0;
  setInterval(function () {
    atual = (atual + 1) % imagens.length;
    // Trocar o elemento inteiro faz o navegador recarregar o ícone com mais confiança do que mudar só o endereço.
    var novo = link.cloneNode(false);
    novo.href = imagens[atual];
    link.parentNode.replaceChild(novo, link);
    link = novo;
  }, intervalo);
})();
