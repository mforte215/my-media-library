/********************/
/* Global Functions* /
/******************/

document.addEventListener('DOMContentLoaded', () => {

    // Get "navbar-burger" and "navbar-menu" elements
    const navbarBurger = document.querySelector('.navbar-burger');
    const navbarMenu = document.querySelector('.navbar-menu');
    navbarBurger.addEventListener('click', (event) => {
        event.preventDefault();
        navbarBurger.classList.toggle('is-active');
        navbarMenu.classList.toggle('is-active');
    });
});


/********************/
/* Fetch Functions* /
/******************/

const searchForMovies = async () => {
    //TODO Get the search values out of the controls the results and make sure the text box is not blank.
    let mediaSearchTextInput = document.querySelector('#media-input');



    const url = 'https://movie-database-alternative.p.rapidapi.com/?s=' + searchedMovie + '&r=json&page=1';
    const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': API_KEY,
            'X-RapidAPI-Host': 'movie-database-alternative.p.rapidapi.com'
        }
    };

    try {
        const response = await fetch(url, options);
        const result = await response.json();
        console.log(result);

        //TODO Place the results into the DOM with the Document Object


    } catch (error) {
        console.error(error);
    }

}

