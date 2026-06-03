new Swiper('.benefit-swiper-command', {
    direction: 'horizontal',
    loop: true,
    pagination: {
        el: ".benefit-command-swiper-pagination",
        type: "fraction",
    },
    navigation: {
        nextEl: '.benefit-command-button-next',
        prevEl: '.benefit-command-button-prev',
    },

});

new Swiper('.benefit-swiper-team', {
    direction: 'horizontal',
    loop: true,
    pagination: {
        el: ".benefit-team-swiper-pagination",
        type: "fraction",
    },
    navigation: {
        nextEl: '.benefit-team-button-next',
        prevEl: '.benefit-team-button-prev',
    },

});
new Swiper('.swiper-time-items', {
    slidesPerView: 1,
    direction: 'horizontal',
    loop: true,
    pagination: {
        el: ".swiper-pagination-time",
        clickable: true,

    },
    autoplay: true,
    breakpoints: {
        600: {
            slidesPerView: 2,
            spaceBetween: 20,
        },
        1025: {
            slidesPerView: 3,
            spaceBetween: 50,
        },
    },


});
new Swiper('.swiper-what-data-img-mobile', {
    slidesPerView: 1,
    direction: 'horizontal',
    loop: true,
    gap: 10,
    pagination: {
        el: ".swiper-pagination-what-data",
        clickable: true,

    },
    autoplay: true,
    // breakpoints: {
    //     600: {
    //         slidesPerView: 2,
    //         spaceBetween: 20,
    //     },
    //     1025: {
    //         slidesPerView: 3,
    //         spaceBetween: 50,
    //     },
    // },
});
new Swiper('.swiper-integrate-working-items-mobile', {
    slidesPerView: 1,
    direction: 'horizontal',
    loop: true,
    gap: 2,
    pagination: {
        el: ".swiper-pagination-integrate-working",
        clickable: true,

    },
    autoplay: true,
    // breakpoints: {
    //     600: {
    //         slidesPerView: 2,
    //         spaceBetween: 20,
    //     },
    //     1025: {
    //         slidesPerView: 3,
    //         spaceBetween: 50,
    //     },
    // },
});

new Swiper('.swiper-interesting-items', {
    slidesPerView: 1,
    direction: 'horizontal',
    loop: true,
    pagination: {
        el: ".swiper-pagination-interesting",
        clickable: true,

    },
    autoplay: true,
    breakpoints: {

        600: {
            slidesPerView: 3,
            spaceBetween: 20,
        },
        1025: {
            slidesPerView: 4,
            spaceBetween: 32,
        },
    },


});

