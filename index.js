document.addEventListener("DOMContentLoaded", function () {
  // Adiciona um evento de clique a todas as divs com a classe 'color'
  var cores = document.querySelectorAll(".color");
  cores.forEach(function (cor) {
    cor.addEventListener("click", function () {
      selecionarCor(this, this.closest(".card").classList[1]);
    });
  });
});

function selecionarCor(elemento, card) {
  // Remove a classe 'cor_selected' de todas as cores do card
  var coresDoCard = document.querySelectorAll("." + card + " .color");
  coresDoCard.forEach(function (cor) {
    cor.classList.remove("cor_selected");
  });
  // Adiciona a classe 'cor_selected' apenas na cor selecionada
  elemento.classList.add("cor_selected");

  // Altera o src da imagem com base na cor selecionada
  var corSelecionada = elemento.id;
  var img = document.querySelector("." + card + " img.img-product");
  switch (corSelecionada) {
    case "op1":
      img.src = "./assets/produtos/1.png";
      break;
    case "op2":
      img.src = "./assets/produtos/2.png";
      break;
    case "op3":
      img.src = "./assets/produtos/3.png";
      break;
    case "op4":
      img.src = "./assets/produtos/4.png";
      break;
    //++
    default:
      break;
  }
}

function mudarIcone(elemento) {
  var icone = elemento.querySelector("i");
  if (icone.classList.contains("fa-check")) {
    icone.classList.remove("fa-check");
    icone.classList.add("fa-plus");
    icone.style.color = "";
    icone.style.padding = "0.7em 0.8em";
  } else {
    icone.classList.remove("fa-plus");
    icone.classList.add("fa-check");
    icone.style.color = "green";
    icone.style.padding = "0.7em 0.7em";
  }
}
