// Benefit for you

const buttonForCompany = document.getElementById('for-company');
const buttonForTeam = document.getElementById('for-team');
const buttons = document.querySelectorAll('.benefit-button');
const gridItem = document.querySelectorAll('.benefit-for-you-grid');


buttonForCompany.addEventListener('click', () => {
    buttons.forEach((button) => {
        button.classList.remove('active');
    });
    buttonForCompany.classList.add('active');
    gridItem.forEach((item) => {
        item.classList.remove('active');
    });
    gridItem[0].classList.add('active');
});
buttonForTeam.addEventListener('click', () => {
    buttons.forEach((button) => {
        button.classList.remove('active');
    });
    buttonForTeam.classList.add('active');
    gridItem.forEach((item) => {
        item.classList.remove('active');
    });
    gridItem[1].classList.add('active');

});

// accordion

const accordions = document.querySelectorAll('.accordion');
const questionItems = document.querySelectorAll('.questions-item');
const questions = document.querySelectorAll('.questions-item-desc');
const titleIdx = document.querySelectorAll('.title-idx');
let activeQuestion = null;
let activeQuestionItem = null;
let activeTitleIdx = null;
let activeAccordion = null;

if (questions.length > 0) {
    accordions[0].classList.add('active');
    questions[0].classList.add('active');
    questionItems[0].classList.add('active');
    titleIdx[0].classList.add('active');
    questions[0].style.maxHeight = questions[0].scrollHeight + "px";
    activeQuestion = questions[0];
    activeQuestionItem = questionItems[0];
    activeTitleIdx = titleIdx[0];
    activeAccordion = accordions[0];
}

accordions.forEach((accordion, index) => {
    accordion.addEventListener('click', () => {
        const nextElement = accordion.nextElementSibling;
        const nextQuestionItem = questionItems[index];
        const nextTitleIdx = titleIdx[index];

        if (activeQuestion && activeQuestion !== nextElement) {
            activeQuestion.style.maxHeight = null;
            activeQuestion.classList.remove('active');
            activeQuestionItem.classList.remove('active');
            activeTitleIdx.classList.remove('active');
            activeAccordion.classList.remove('active');
        }

        if (nextElement.classList.contains('active')) {
            nextElement.style.maxHeight = null;
            nextElement.classList.remove('active');
            nextQuestionItem.classList.remove('active');
            nextTitleIdx.classList.remove('active');
            accordion.classList.remove('active');
            activeQuestion = null;
            activeQuestionItem = null;
            activeTitleIdx = null;
            activeAccordion = null;
        } else {
            nextElement.classList.add('active');
            nextElement.style.maxHeight = nextElement.scrollHeight + "px";
            nextQuestionItem.classList.add('active');
            nextTitleIdx.classList.add('active');
            accordion.classList.add('active');
            activeQuestion = nextElement;
            activeQuestionItem = nextQuestionItem;
            activeTitleIdx = nextTitleIdx;
            activeAccordion = accordion;
        }
    });
});
