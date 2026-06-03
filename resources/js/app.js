import.meta.glob([
    '../img/**',
]);


const bars = document.getElementById("bars");
const close = document.getElementById("close");
const navigation = document.querySelector('.navigation');
const backdrop = document.querySelector('.backdrop');
const menuLinks = document.querySelectorAll('.menu-link');


bars.addEventListener('click', () => {
  navigation.classList.add('active');
  backdrop.classList.add('active');
});
close.addEventListener('click', () => {
  navigation.classList.remove('active');
  backdrop.classList.remove('active');
});

backdrop.addEventListener('click', () => {
  navigation.classList.remove('active');
  backdrop.classList.remove('active');
});

menuLinks.forEach((link) => {
  link.addEventListener('click', () => {
    navigation.classList.remove('active');
    backdrop.classList.remove('active');
  });
});




// Language dropdown

  let defaultLangText = 'УКР';
  const currentLang = window.location.pathname.split('/')[1];

  if (currentLang === 'en') {
      defaultLangText = 'EN';
  }

  document.querySelector('.dropbtn').childNodes[0].nodeValue = defaultLangText;

  document.querySelector('.dropbtn').addEventListener('click', function() {
    document.querySelector('.dropdown').classList.toggle('show');
  });

  document.querySelectorAll('.dropdown-content a').forEach(item => {
    item.addEventListener('click', event => {
      event.preventDefault();
      const selectedLang = event.target.getAttribute('data-lang');
      document.querySelector('.dropbtn').childNodes[0].nodeValue = event.target.textContent;
      console.log('Selected language:', selectedLang);
      window.location.href = '/'+selectedLang;
      document.querySelector('.dropdown').classList.remove('show');
    });
  });

  window.addEventListener('click', function(event) {
    if (!event.target.matches('.dropbtn') && !event.target.closest('.dropbtn')) {
      const dropdowns = document.querySelectorAll('.dropdown');
      dropdowns.forEach(dropdown => {
        if (dropdown.classList.contains('show')) {
          dropdown.classList.remove('show');
        }
      });
    }
  });


// parallax effect
function handleParallaxScroll() {
    const parallaxText = document.querySelector('.parallax-text');
    const scrollPosition = window.scrollY;

    if (parallaxText) {
        parallaxText.style.transform = `translateY(${scrollPosition * 0.4}px)`;
    }
}

function checkScreenSize() {
    const parallaxContainer = document.querySelector('.what-data-container');

    if (window.innerWidth < 1025) {
        document.removeEventListener('scroll', handleParallaxScroll);
        parallaxContainer.classList.remove('parallax-enabled');
    } else {
        document.addEventListener('scroll', handleParallaxScroll);
        parallaxContainer.classList.add('parallax-enabled');
    }
}

checkScreenSize();
window.addEventListener('resize', checkScreenSize);



// Open integrate working container


const openButton = document.getElementById('open-integrate');
const openContainer = document.querySelector('.integrate-working-items');

const openText = document.getElementById('open-text').textContent.trim();
const closeText = document.getElementById('close-text').textContent.trim();

openButton.addEventListener('click', () => {
    if (openContainer.style.height === '' || openContainer.style.height === '432px') {
        const expandedHeight = openContainer.scrollHeight;
        openContainer.style.height = `${expandedHeight}px`;
        openButton.textContent = closeText;
    } else {
        openContainer.style.height = '432px';
        openButton.textContent = openText;
    }
});




// Feedback form

// const nameInput = document.querySelector('.name-input');
// const emailInput = document.querySelector('.email-input');
// const phoneInput = document.querySelector('.phone-input');
// const submitButton = document.querySelector('.btn-submit');
// const nameHelperText = document.getElementById('name-helper');
// const emailHelperText = document.getElementById('email-helper');
// const phoneHelperText = document.getElementById('phone-helper');
// const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//
// const maskOptions = {
//   mask: '+{38}(000)000-00-00'
// };
// const mask = IMask(phoneInput, maskOptions);
//
// const onSubmitClick = () => {
//   let isValid = true;
//
//   if (!emailRegex.test(emailInput.value)) {
//     emailInput.style.border = '1px solid red';
//     emailHelperText.classList.add('active');
//     isValid = false;
//   } else {
//     emailInput.style.border = '1px solid #efeff0';
//     emailHelperText.classList.remove('active');
//   }
//
//   if (nameInput.value.length <= 0) {
//     nameInput.style.border = '1px solid red';
//     nameHelperText.classList.add('active');
//     isValid = false;
//   } else {
//     nameInput.style.border = '1px solid #efeff0';
//     nameHelperText.classList.remove('active');
//   }
//
//   if (!mask.masked.isComplete) {
//     phoneInput.style.border = '1px solid red';
//     phoneHelperText.classList.add('active');
//     isValid = false;
//   } else {
//     phoneInput.style.border = '1px solid #efeff0';
//     phoneHelperText.classList.remove('active');
//   }
//
//   if (isValid) {
//       submit();
//   }
// };
//
// nameInput.addEventListener('blur', () => {
//   if (nameInput.value.length > 0) {
//     nameInput.style.border = '1px solid #efeff0';
//     nameHelperText.classList.remove('active');
//   } else {
//     nameInput.style.border = '1px solid red';
//     nameHelperText.classList.add('active');
//   }
// });
//
// nameInput.addEventListener('focus', () => {
//   nameInput.style.border = '1px solid #efeff0';
//   nameHelperText.classList.remove('active');
// });
//
// emailInput.addEventListener('blur', () => {
//   if (emailRegex.test(emailInput.value)) {
//     emailInput.style.border = '1px solid #efeff0';
//     emailHelperText.classList.remove('active');
//   } else {
//     emailInput.style.border = '1px solid red';
//     emailHelperText.classList.add('active');
//   }
// });
//
// emailInput.addEventListener('focus', () => {
//   emailInput.style.border = '1px solid #efeff0';
//   emailHelperText.classList.remove('active');
// });
//
// phoneInput.addEventListener('blur', () => {
//   if (mask.masked.isComplete) {
//     phoneInput.style.border = '1px solid #efeff0';
//     phoneHelperText.classList.remove('active');
//   } else {
//     phoneInput.style.border = '1px solid red';
//     phoneHelperText.classList.add('active');
//   }
// });
//
// phoneInput.addEventListener('focus', () => {
//   phoneInput.style.border = '1px solid #efeff0';
//   phoneHelperText.classList.remove('active');
// });
//
// submitButton.addEventListener('click', onSubmitClick);







