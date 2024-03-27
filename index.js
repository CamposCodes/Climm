function selecionarCor(elemento, card) {
    var coresDoCard = document.querySelectorAll('.' + card + ' .color');
    coresDoCard.forEach(function(cor) {
      cor.classList.remove('cor_selected');
    });
    elemento.classList.add('cor_selected');
}