const nameInput = document.querySelector('.name-input');
const emailInput = document.querySelector('.email-input');
const phoneInput = document.querySelector('.phone-input');
const submitButton = document.querySelector('.btn-submit');
const nameHelperText = document.getElementById('name-helper');
const emailHelperText = document.getElementById('email-helper');
const phoneHelperText = document.getElementById('phone-helper');
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const maskOptions = {
    mask: [
        {
            mask: '+00 (000) 000 0000', // Украина
            startsWith: '38',
            lazy: false,
            country: 'Ukraine'
        },
        {
            mask: '+0 (000) 000-0000', // США
            startsWith: '1',
            lazy: false,
            country: 'USA'
        },
        {
            mask: '+00 (0000) 000000', // Великобритания
            startsWith: '44',
            lazy: false,
            country: 'UK'
        },
        {
            mask: '+00 (000) 000 000', // Франция
            startsWith: '33',
            lazy: false,
            country: 'France'
        },
        {
            mask: '+00 (000) 0000000', // Германия
            startsWith: '49',
            lazy: false,
            country: 'Germany'
        },
        {
            mask: '+00 (000) 0000000', // Италия
            startsWith: '39',
            lazy: false,
            country: 'Italy'
        },
        {
            mask: '+00 (000) 000 000', // Испания
            startsWith: '34',
            lazy: false,
            country: 'Spain'
        },
        {
            mask: '+00 (000) 000 0000', // Нидерланды
            startsWith: '31',
            lazy: false,
            country: 'Netherlands'
        },
        {
            mask: '+00 (000) 000 0000', // Швеция
            startsWith: '46',
            lazy: false,
            country: 'Sweden'
        },
        {
            mask: '+00 (000) 000 000', // Бельгия
            startsWith: '32',
            lazy: false,
            country: 'Belgium'
        },
        {
            mask: '+00 (000) 000 000', // Польша
            startsWith: '48',
            lazy: false,
            country: 'Poland'
        },
        {
            mask: '+000 (000) 000 000', // Португалия
            startsWith: '351',
            lazy: false,
            country: 'Portugal'
        },
        {
            mask: '+000 (000) 000 000', // Ирландия
            startsWith: '353',
            lazy: false,
            country: 'Ireland'
        },
        {
            mask: '+000 (000) 000 000', // Словакия
            startsWith: '421',
            lazy: false,
            country: 'Slovakia'
        },
        {
            mask: '+000 (000) 000 000', // Чехия
            startsWith: '420',
            lazy: false,
            country: 'Czech Republic'
        }
    ],
    dispatch: (appended, dynamicMasked) => {
        const number = (dynamicMasked.value + appended).replace(/\D/g, '');
        return dynamicMasked.compiledMasks.find(m => number.startsWith(m.startsWith)) || dynamicMasked.compiledMasks[0];
    }
};

const mask = IMask(phoneInput, maskOptions);

const onSubmitClick = () => {
    let isValid = true;

    if (!emailRegex.test(emailInput.value)) {
        emailInput.style.border = '1px solid red';
        emailHelperText.classList.add('active');
        isValid = false;
    } else {
        emailInput.style.border = '1px solid #efeff0';
        emailHelperText.classList.remove('active');
    }

    if (nameInput.value.length <= 0) {
        nameInput.style.border = '1px solid red';
        nameHelperText.classList.add('active');
        isValid = false;
    } else {
        nameInput.style.border = '1px solid #efeff0';
        nameHelperText.classList.remove('active');
    }

    if (!mask.masked.isComplete) {
        phoneInput.style.border = '1px solid red';
        phoneHelperText.classList.add('active');
        isValid = false;
    } else {
        phoneInput.style.border = '1px solid #efeff0';
        phoneHelperText.classList.remove('active');
    }

    if (isValid) {
        window.location.href = '/accepted';
    }
};

nameInput.addEventListener('blur', () => {
    if (nameInput.value.length > 0) {
        nameInput.style.border = '1px solid #efeff0';
        nameHelperText.classList.remove('active');
    } else {
        nameInput.style.border = '1px solid red';
        nameHelperText.classList.add('active');
    }
});

nameInput.addEventListener('focus', () => {
    nameInput.style.border = '1px solid #efeff0';
    nameHelperText.classList.remove('active');
});

emailInput.addEventListener('blur', () => {
    if (emailRegex.test(emailInput.value)) {
        emailInput.style.border = '1px solid #efeff0';
        emailHelperText.classList.remove('active');
    } else {
        emailInput.style.border = '1px solid red';
        emailHelperText.classList.add('active');
    }
});

emailInput.addEventListener('focus', () => {
    emailInput.style.border = '1px solid #efeff0';
    emailHelperText.classList.remove('active');
});

phoneInput.addEventListener('blur', () => {
    if (mask.masked.isComplete) {
        phoneInput.style.border = '1px solid #efeff0';
        phoneHelperText.classList.remove('active');
    } else {
        phoneInput.style.border = '1px solid red';
        phoneHelperText.classList.add('active');
    }
});

phoneInput.addEventListener('focus', () => {
    phoneInput.style.border = '1px solid #efeff0';
    phoneHelperText.classList.remove('active');
});

submitButton.addEventListener('click', onSubmitClick);

