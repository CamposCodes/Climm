document.addEventListener("DOMContentLoaded", function () {
  // ========================================
  // VIDEO PLAYER ROBUSTO - COMPATIBILIDADE TOTAL
  // ========================================
  
  // Função auxiliar para inicializar video
  function setupVideo(videoId) {
    const heroVideo = document.getElementById(videoId);
    const fallbackImage = heroVideo ? heroVideo.parentElement.querySelector(".home-fallback") : null;
    let videoAttempts = 0;
    const MAX_ATTEMPTS = 10;
    
    if (!heroVideo) return;
    
    // ETAPA 1: Configuração Essencial
    heroVideo.muted = true;
    heroVideo.defaultMuted = true;
    heroVideo.volume = 0;
    heroVideo.controls = false;
    
    // Força visibilidade do vídeo
    heroVideo.style.display = 'block';
    heroVideo.style.visibility = 'visible';
    if (fallbackImage) {
      fallbackImage.style.display = 'none';
      fallbackImage.style.visibility = 'hidden';
    }
    
    console.log("[Video] Sistema iniciado - " + videoId);
    
    // ETAPA 2: Função de Reprodução
    function playVideo() {
      videoAttempts++;
      
      if (!heroVideo.paused && heroVideo.currentTime > 0) {
        console.log("[Video] Já está tocando");
        return;
      }
      
      if (heroVideo.readyState < 2) {
        console.log("[Video] Tentativa " + videoAttempts + ": Aguardando carregamento");
        return;
      }
      
      console.log("[Video] Tentativa " + videoAttempts + ": Iniciando reprodução");
      
      try {
        const playPromise = heroVideo.play();
        
        if (playPromise && typeof playPromise.then === 'function') {
          playPromise
            .then(function() {
              console.log("[Video] Reprodução bem-sucedida");
            })
            .catch(function(error) {
              console.warn("[Video] Tentativa " + videoAttempts + ": " + error.name);
              if (videoAttempts >= MAX_ATTEMPTS) {
                showFallback();
              }
            });
        } else {
          console.log("[Video] Navegador antigo (sem Promise)");
        }
      } catch (error) {
        console.error("[Video] Erro na reprodução:", error);
        if (videoAttempts >= MAX_ATTEMPTS) {
          showFallback();
        }
      }
    }
    
    // ETAPA 3: Fallback
    function showFallback() {
      console.log("[Video] Ativando fallback de imagem");
      heroVideo.style.display = 'none';
      heroVideo.style.visibility = 'hidden';
      if (fallbackImage) {
        fallbackImage.style.display = 'block';
        fallbackImage.style.visibility = 'visible';
      }
    }
    
    // ETAPA 4: Listeners
    heroVideo.addEventListener("loadedmetadata", function() {
      console.log("[Video] Metadados carregados");
      playVideo();
    }, { once: true });
    
    heroVideo.addEventListener("canplay", function() {
      if (videoAttempts === 0) playVideo();
    }, { once: true });
    
    heroVideo.addEventListener("play", function() {
      console.log("[Video] Evento play disparado");
    });
    
    heroVideo.addEventListener("error", function(e) {
      console.error("[Video] Erro de carregamento:", e.target.error);
      showFallback();
    });
    
    // ETAPA 5: Tentativas Progressivas
    const timings = [50, 150, 400, 800, 1200, 1800, 2500, 3500, 4500];
    timings.forEach(function(delay) {
      setTimeout(playVideo, delay);
    });
    
    // ETAPA 6: Timeout final
    setTimeout(function() {
      if (heroVideo.paused || heroVideo.readyState < 3) {
        console.log("[Video] Timeout - mostrando fallback");
        showFallback();
      }
    }, 5000);
  }
  
  // Inicializar ambos os vídeos
  setupVideo("hero-video");
  setupVideo("hero-video-mobile");

  // ========================================
  // SELETOR DE CORES DOS PRODUTOS
  // ========================================
  
  const colorOptions = document.querySelectorAll(".color-option");
  
  colorOptions.forEach(function(colorOption) {
    colorOption.addEventListener("click", function() {
      const card = this.closest(".product-card");
      const productId = card.getAttribute("data-product-id");
      const selectedColor = this.getAttribute("data-color");
      
      // Remover classe 'selected' de todas as cores do card
      const allColorsInCard = card.querySelectorAll(".color-option");
      allColorsInCard.forEach(function(color) {
        color.classList.remove("selected");
      });
      
      // Adicionar classe 'selected' à cor clicada
      this.classList.add("selected");
      
      // Atualizar a imagem do produto
      updateProductImage(card, selectedColor, productId);
    });
  });
  
  // Inicializar primeira cor como selecionada
  colorOptions.forEach(function(colorOption) {
    const card = colorOption.closest(".product-card");
    if (card && colorOption.getAttribute("data-color") === "1") {
      colorOption.classList.add("selected");
    }
  });
  
  // Função para atualizar a imagem do produto
  function updateProductImage(card, colorNumber, productId) {
    const image = card.querySelector(".product-image");
    const imageWrapper = card.querySelector(".product-image-wrapper");
    
    if (image) {
      // Mostrar loading
      imageWrapper.classList.add("loading");
      
      // Mapear cores para imagens
      const imageSrc = "./assets/produtos/" + colorNumber + ".png";
      
      // Criar uma nova imagem para pré-carregar
      const preloadImg = new Image();
      
      preloadImg.onload = function() {
        // Aguardar um pouco para garantir renderização
        setTimeout(function() {
          image.src = imageSrc;
          image.style.transition = "opacity 0.4s ease";
          
          // Garantir que a imagem foi renderizada
          requestAnimationFrame(function() {
            imageWrapper.classList.remove("loading");
          });
        }, 300);
      };
      
      preloadImg.onerror = function() {
        image.src = imageSrc;
        imageWrapper.classList.remove("loading");
      };
      
      preloadImg.src = imageSrc;
    }
  }

  // ========================================
  // ADICIONAR AO CARRINHO / COMPLEMENTO
  // ========================================
  
  window.adicionarAoCarrinho = function(button) {
    const productTitle = button.closest(".product-card").querySelector(".product-title").textContent;
    
    // Se for botão de complemento
    if (button.classList.contains("btn-add-complement")) {
      button.classList.toggle("selected");
      
      if (button.classList.contains("selected")) {
        // Mostrar texto de confirmação quando selecionado
        button.innerHTML = 'Proteção Adicionada';
        console.log("✓ " + productTitle + " adicionado como complemento");
      } else {
        // Restaurar o ícone e texto original
        button.innerHTML = '<i class="fa fa-plus"></i> Adicionar Proteção';
        console.log("✗ " + productTitle + " removido");
      }
    } else {
      // Comportamento original para btn-add-cart
      const card = button.closest(".product-card");
      const originalText = button.textContent;
      button.textContent = 'Interesse registrado!';
      button.style.background = 'linear-gradient(135deg, #1e3a52 0%, #152a3e 100%)';
      
      console.log("✓ Interesse registrado: " + productTitle);
      
      setTimeout(function() {
        button.textContent = originalText;
        button.style.background = '';
      }, 2000);
    }
  };

  // ========================================
  // DESTAQUE DE SEÇÃO ATIVA NA NAVEGAÇÃO
  // ========================================

  const navLinks = document.querySelectorAll("#navegacao a");
  const sections = document.querySelectorAll("section");

  function updateActiveNav() {
    let current = "";
    const navbarHeight = 120;

    sections.forEach((section) => {
      const sectionTop = section.getBoundingClientRect().top;
      const sectionBottom = section.getBoundingClientRect().bottom;

      if (sectionTop <= window.innerHeight / 2 && sectionBottom >= window.innerHeight / 2) {
        current = section.getAttribute("id");
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove("nav-active");
    });

    if (current !== "") {
      const activeLink = document.querySelector(`#navegacao a[href="#${current}"]`);
      if (activeLink) {
        activeLink.classList.add("nav-active");
      }
    }
  }

  window.addEventListener("scroll", updateActiveNav, { passive: true });
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
// FUNÇÃO PARA ANIMAÇÃO DE CONTADORES
// ========================================

function animateCounters(card) {
  const counterElements = card.querySelectorAll(".counter-number");

  counterElements.forEach((element) => {
    const target = parseInt(element.dataset.target);
    const duration = 2000;
    const steps = 60;
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
