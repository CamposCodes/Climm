document.addEventListener("DOMContentLoaded", function () {
  // ========================================
  // VIDEO PLAYER ROBUSTO COM FALLBACK
  // ========================================
  const heroVideo = document.getElementById("hero-video");
  const videoContainer = document.getElementById("video-container");
  const fallbackImage = document.querySelector(".home-fallback");
  let videoInitialized = false;
  let videoPlayedOnce = false;
  
  if (heroVideo && videoContainer) {
    // Configurar atributos essenciais do vídeo
    heroVideo.muted = true;
    heroVideo.defaultMuted = true;
    heroVideo.volume = 0;
    heroVideo.controls = false;
    
    // Força o vídeo a ficar visível por padrão
    videoContainer.style.display = 'block';
    if (fallbackImage) fallbackImage.style.display = 'none';
    
    /**
     * Função para tentar reproduzir o vídeo
     * Tenta múltiplas vezes com diferentes estratégias
     */
    function attemptVideoPlay() {
      if (videoPlayedOnce) return;
      
      // Se o vídeo não está carregado, retornar
      if (heroVideo.readyState < 2) {
        console.log("[Video] Aguardando carregamento...");
        return;
      }
      
      // Tentar reproduzir
      const playPromise = heroVideo.play();
      
      if (playPromise !== undefined) {
        playPromise
          .then(function() {
            videoPlayedOnce = true;
            videoInitialized = true;
            console.log("✓ [Video] Reprodução iniciada com sucesso");
            // Garantir que vídeo está visível
            videoContainer.style.display = 'block';
            if (fallbackImage) fallbackImage.style.display = 'none';
          })
          .catch(function(error) {
            console.warn("⚠ [Video] Autoplay bloqueado:", error.name);
            // Se não conseguir reproduzir após 5 tentativas, mostrar fallback
            if (!videoPlayedOnce) {
              showFallback();
            }
          });
      } else {
        // Navegador não suporta Promise
        console.log("[Video] Navegador antigo, usando fallback");
        showFallback();
      }
    }
    
    /**
     * Mostrar imagem de fallback
     */
    function showFallback() {
      console.log("✓ [Video] Mostrando imagem de fallback");
      videoContainer.style.display = 'none';
      if (fallbackImage) fallbackImage.style.display = 'block';
      videoPlayedOnce = true;
    }
    
    /**
     * Listeners para eventos de carregamento
     */
    heroVideo.addEventListener("loadstart", function() {
      console.log("[Video] Iniciando carregamento...");
    });
    
    heroVideo.addEventListener("loadedmetadata", function() {
      console.log("[Video] Metadados carregados");
      attemptVideoPlay();
    });
    
    heroVideo.addEventListener("canplay", function() {
      console.log("[Video] Pode reproduzir");
      if (!videoPlayedOnce) attemptVideoPlay();
    });
    
    heroVideo.addEventListener("canplaythrough", function() {
      console.log("[Video] Pode reproduzir sem pausa");
      if (!videoPlayedOnce) attemptVideoPlay();
    });
    
    /**
     * Listener para erro
     */
    heroVideo.addEventListener("error", function(e) {
      console.error("✗ [Video] Erro ao carregar vídeo:", e.target.error);
      showFallback();
    });
    
    /**
     * Listener para quando vídeo é pausado (indica que autoplay foi bloqueado)
     */
    heroVideo.addEventListener("pause", function() {
      if (!videoPlayedOnce && heroVideo.readyState >= 2) {
        console.log("[Video] Vídeo pausado automaticamente (autoplay bloqueado)");
        // Aguardar um pouco e mostrar fallback
        setTimeout(showFallback, 1000);
      }
    });
    
    /**
     * Estratégia agressiva: tentar reproduzir repetidamente
     */
    const playAttempts = [100, 300, 800, 1500, 2500, 4000];
    playAttempts.forEach((delay) => {
      setTimeout(attemptVideoPlay, delay);
    });
    
    /**
     * Fallback final: se nada funcionar, mostrar imagem após 5 segundos
     */
    setTimeout(function() {
      if (!videoPlayedOnce) {
        console.log("✓ [Video] Timeout - mostrando fallback");
        showFallback();
      }
    }, 5000);
    
    /**
     * Permitir ao usuário clicar no vídeo para reproduzir manualmente
     */
    heroVideo.addEventListener("click", function(e) {
      if (!videoPlayedOnce) {
        attemptVideoPlay();
      }
    });
  }

  // ========================================
  // DESTAQUE DE SEÇÃO ATIVA NA NAVEGAÇÃO
  // ========================================

  // ========================================
  // DESTAQUE DE SEÇÃO ATIVA NA NAVEGAÇÃO
  // ========================================
  const navLinks = document.querySelectorAll("#navegacao a");
  const sections = document.querySelectorAll("section");

  function updateActiveNav() {
    let current = "";
    const navbarHeight = 120; // altura do navbar

    // Encontrar a seção mais próxima do topo da viewport
    sections.forEach((section) => {
      const sectionTop = section.getBoundingClientRect().top;
      const sectionBottom = section.getBoundingClientRect().bottom;

      // Se a seção está visível na viewport
      if (sectionTop <= window.innerHeight / 2 && sectionBottom >= window.innerHeight / 2) {
        current = section.getAttribute("id");
      }
    });

    // Remover classe ativa de todos os links
    navLinks.forEach((link) => {
      link.classList.remove("nav-active");
    });

    // Adicionar classe ativa ao link da seção atual
    if (current !== "") {
      const activeLink = document.querySelector(`#navegacao a[href="#${current}"]`);
      if (activeLink) {
        activeLink.classList.add("nav-active");
      }
    }
  }

  // Atualizar ao fazer scroll
  window.addEventListener("scroll", updateActiveNav, { passive: true });
  
  // Atualizar na carga da página
  updateActiveNav();

  // ========================================
  // SCROLL SUAVE COM VELOCIDADE CONTROLADA
  // ========================================
  navLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      const targetId = this.getAttribute("href");
      const targetSection = document.querySelector(targetId);
      
      if (targetSection) {
        targetSection.scrollIntoView({
          behavior: "smooth",
          block: "start"
        });
      }
    });
  });

  // ========================================
  // VOLTAR AO TOPO AO CLICAR NA LOGO
  // ========================================
  const logoLink = document.querySelector(".logo-link");
  if (logoLink) {
    logoLink.addEventListener("click", function (e) {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    });
  }

  // ========================================
  // SELETOR DE COR E ÍCONE
  // ========================================
  var cores = document.querySelectorAll(".color");
  cores.forEach(function (cor) {
    cor.addEventListener("click", function () {
      selecionarCor(this, this.closest(".card").classList[1]);
    });
  });

  // Inicializar cores selecionadas (op1) ao carregar a página
  var coresIniciais = document.querySelectorAll(".color.cor_selected");
  coresIniciais.forEach(function (cor) {
    selecionarCor(cor, cor.closest(".card").classList[1]);
  });

  // ========================================
  // FECHAR MENU HAMBURGER AO CLICAR EM LINK
  // ========================================
  // Menu hamburger foi removido - este código não é mais necessário

  // ========================================
  // INTERSECTION OBSERVER PARA ANIMAÇÕES AO SCROLL
  // ========================================
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  };

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("animate");

        // Se é um card de resultado, animar os contadores
        if (
          entry.target.classList.contains("resultado-card") &&
          !entry.target.dataset.animated
        ) {
          animateCounters(entry.target);
          entry.target.dataset.animated = "true";
        }

        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Observar elementos com classe scroll-animate
  const animatedElements = document.querySelectorAll(".scroll-animate");
  animatedElements.forEach((element) => {
    observer.observe(element);
  });

  // ========================================
  // SCROLL-TO-TOP BUTTON
  // ========================================
  const scrollToTopBtn = document.getElementById("scroll-to-top");

  if (scrollToTopBtn) {
    window.addEventListener("scroll", function () {
      if (window.pageYOffset > 300) {
        scrollToTopBtn.classList.add("show");
      } else {
        scrollToTopBtn.classList.remove("show");
      }
    }, { passive: true });

    scrollToTopBtn.addEventListener("click", function () {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    });
  }

  // ========================================
  // BARRA DE PROGRESSO (Fallback JS)
  // ========================================
  const scrollProgress = document.querySelector(".scroll-progress");
  
  // Verifica se o navegador NÃO suporta scroll-driven animations
  if (scrollProgress && !CSS.supports('animation-timeline', 'scroll()')) {
    scrollProgress.style.display = 'block';
    
    window.addEventListener("scroll", function () {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrollPercent = scrollTop / scrollHeight;
      scrollProgress.style.transform = `translateX(-50%) scaleX(${scrollPercent})`;
    }, { passive: true });
  }
});

// ========================================
// FUNÇÕES UTILITÁRIAS
// ========================================

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

// ========================================
// ANIMAÇÃO DE CONTADORES (NÚMEROS SUBINDO)
// ========================================

function animateCounters(card) {
  const counterElements = card.querySelectorAll(".counter-number");

  counterElements.forEach((element) => {
    const target = parseInt(element.dataset.target);
    const duration = 2000; // 2 segundos
    const steps = 60; // 60 frames
    const increment = target / steps;
    let current = 0;
    let frameCount = 0;

    const interval = setInterval(() => {
      frameCount++;
      current += increment;

      if (frameCount >= steps) {
        element.textContent = target;
        clearInterval(interval);
      } else {
        element.textContent = Math.floor(current);
      }
    }, duration / steps);
  });
}
