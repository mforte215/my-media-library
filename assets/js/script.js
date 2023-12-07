document.addEventListener('DOMContentLoaded', () => {

    // Get "navbar-burger" element
    const navbarBurger = document.querySelector('.navbar-burger');
    const navbarMenu = document.querySelector('.navbar-menu');
    // Add a click event on each of them

    navbarBurger.addEventListener('click', (event) => {
        event.preventDefault();
        navbarBurger.classList.toggle('is-active');
        navbarMenu.classList.toggle('is-active');
    });
});
