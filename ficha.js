// A Terra Invertida · feito por Lune, @luunesz
// Guarda no navegador de quem joga os valores da ficha: atributos, feridas, dados perdidos e marcadores.
// Nada é enviado para fora do aparelho. Se o navegador bloquear o armazenamento, a ficha funciona, mas não lembra.
(function () {
  var ficha = document.querySelector('.ficha');
  if (!ficha) return;

  var chave = 'terra-invertida:ficha:' + (ficha.getAttribute('data-ficha') || 'sem-nome');
  var estado = {};
  try { estado = JSON.parse(localStorage.getItem(chave) || '{}') || {}; } catch (e) { estado = {}; }
  function salvar() { try { localStorage.setItem(chave, JSON.stringify(estado)); } catch (e) {} }

  // Campos de texto e número (atributos e idade)
  ficha.querySelectorAll('input[data-id]').forEach(function (campo) {
    var id = campo.getAttribute('data-id');
    if (estado[id] !== undefined) campo.value = estado[id];
    campo.addEventListener('input', function () {
      if (campo.value === '') delete estado[id]; else estado[id] = campo.value;
      salvar();
    });
  });

  // Feridas e dados: botões que ligam e desligam
  ficha.querySelectorAll('button[data-alternar]').forEach(function (botao) {
    var id = botao.getAttribute('data-alternar');
    botao.setAttribute('aria-pressed', estado[id] ? 'true' : 'false');
    botao.addEventListener('click', function () {
      var ligado = botao.getAttribute('aria-pressed') !== 'true';
      botao.setAttribute('aria-pressed', ligado ? 'true' : 'false');
      if (ligado) estado[id] = 1; else delete estado[id];
      salvar();
    });
  });

  // Marcadores: contadores de 0 até o máximo de cada um (data-max)
  ficha.querySelectorAll('.marcador').forEach(function (marcador) {
    var id = marcador.getAttribute('data-contador');
    var saida = marcador.querySelector('output');
    var maximo = parseInt(marcador.getAttribute('data-max'), 10) || 9;
    saida.textContent = String(Math.min(maximo, parseInt(estado[id], 10) || 0));
    marcador.querySelectorAll('button[data-passo]').forEach(function (botao) {
      botao.addEventListener('click', function () {
        var atual = parseInt(estado[id], 10) || 0;
        atual = Math.max(0, Math.min(maximo, atual + parseInt(botao.getAttribute('data-passo'), 10)));
        saida.textContent = String(atual);
        if (atual) estado[id] = atual; else delete estado[id];
        salvar();
      });
    });
  });

  // Limpar marcações: zera feridas, dados e marcadores. Atributos e idade ficam.
  var limpar = ficha.querySelector('[data-limpar]');
  if (limpar) {
    limpar.addEventListener('click', function () {
      ficha.querySelectorAll('button[data-alternar]').forEach(function (botao) {
        botao.setAttribute('aria-pressed', 'false');
        delete estado[botao.getAttribute('data-alternar')];
      });
      ficha.querySelectorAll('.marcador').forEach(function (marcador) {
        delete estado[marcador.getAttribute('data-contador')];
        marcador.querySelector('output').textContent = '0';
      });
      salvar();
    });
  }
})();
