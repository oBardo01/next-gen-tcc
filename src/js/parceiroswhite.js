const toggleCheckbox = document.getElementById('toggle-theme');
const body = document.body;

// Seleção de elementos que precisam de ajustes
const customShapeDivider = document.querySelector('.custom-shape-divider-bottom-1683068753');
const svgElement = customShapeDivider?.querySelector('svg');
const logoImg = document.querySelector('.logo img');
const h1 = document.querySelector('.body.light-mode .container h1');
const h2 = document.querySelector('.body.light-mode .container h2');
const reviewsli = document.querySelector('.body.light-mode .reviews li');
const reviewFormLabel = document.querySelector('body.light-mode .review-form label');
const button = document.querySelector('.body.light-mode .button');
const coment = document.querySelector('.body.light-mode #comment');
const rating = document.querySelector('.body.light-mode #rating');



// Verifica se o light mode está ativado no carregamento
if (localStorage.getItem('light-mode') === 'enabled') {
    body.classList.add('light-mode');
    toggleCheckbox.checked = true;
  
    // Ajusta elementos específicos para o light mode
    if (customShapeDivider) {
      customShapeDivider.style.backgroundColor = '#ffffff';
      svgElement.style.fill = '#eaeaea';
    }
    if (logoImg) {
      logoImg.src = './src/imagem/logowhite.png'; // Caminho da imagem do light mode
    }
}

// Alterna entre modo escuro e claro
toggleCheckbox.addEventListener('change', function () {
  if (this.checked) {
    body.classList.add('light-mode');

    // Ajusta elementos para o light mode
        if (customShapeDivider) {
         customShapeDivider.style.backgroundColor = '#ffffff';
         svgElement.style.fill = '#eaeaea';
        }
        if (logoImg) {
         logoImg.src = './src/imagem/logowhite.png'; // Define a imagem do light mode
        }

        localStorage.setItem('light-mode', 'enabled');
    }   else {
        body.classList.remove('light-mode');

        // Reverte os ajustes para o dark mode
        if (customShapeDivider) {
         customShapeDivider.style.backgroundColor = '#121212';
         svgElement.style.fill = ''; // Volta ao estilo padrão
        }
        if (logoImg) {
         logoImg.src = './src/imagem/logoblack.png'; // Caminho da imagem padrão (dark mode)
        }

        localStorage.setItem('light-mode', 'disabled');
    }
});