/*************************************/
/* Global Functions and References * /
/***********************************/

//Form Element
let searchForm = document.querySelector('.media-form');

//Search Results Container
let searchResultsContainer = document.querySelector('.search-results');

//Search Box
let mediaSearchTextBox = document.getElementById('media-input');

//Dropdown Box
let mediaSearchType = document.getElementById('media-type');

//Add an event listener to the Document object that determines which Nav elements to display (Bulma CSS Navbar: https://bulma.io/documentation/components/navbar/#navbar-menu)
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
/* Fetch Functions */
/******************/

//When given an IMDB Movie ID, the function fetchs and retrieves more information for the movie including the description which is not available in the Search by Title API
const loadMoreMovieDetails = async (movieId) => {
    console.log("LOGGING MOVIE ID");
    console.log(movieId);
    const url = 'https://movie-database-alternative.p.rapidapi.com/?r=json&i=' + movieId;
    const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': '1f7d21f524msha8ec2b27679b7a9p1fc378jsnb4e51c042015',
            'X-RapidAPI-Host': 'movie-database-alternative.p.rapidapi.com'
        }
    };

    try {
        const response = await fetch(url, options);
        const result = await response.json();
        //find the modal text places
        let modalTitleText = document.querySelector('.modal-title-text');
        if (modalTitleText) {
            //set the found title

            console.log(result);
            modalTitleText.textContent = result.Title;
            let directorText = document.createElement('p');
            directorText.classList.add('modal-info-text');
            directorText.textContent = "Director: " + result.Director;
            modalTitleText.after(directorText);
            let yearText = document.createElement('p');
            yearText.classList.add('modal-info-text');
            yearText.textContent = "Year: " + result.Year;
            directorText.after(yearText);
            let descriptionText = document.createElement('p');
            descriptionText.classList.add('modal-info-text');
            descriptionText.textContent = "Plot: " + result.Plot;
            yearText.after(descriptionText);

        }



    } catch (error) {
        console.error(error);
    }

}

const loadMoreBookDetails = async (bookISBN, bookObject) => {
    console.log("LOGGING BOOK ID");
    console.log(bookISBN);

    const url = 'https://openlibrary.org/isbn/' + bookISBN + ".json";
    const options = {
        method: 'GET',
    };

    try {
        const response = await fetch(url, options);
        const result = await response.json();
        //find the modal text places
        console.log(result);
        let modalTitleText = document.querySelector('.modal-title-text');
        if (modalTitleText) {
            //set the found title
            console.log("LOGGING BOOK DETAIL RESULT");
            console.log(result);
            modalTitleText.textContent = bookObject.title;
            let authorText = document.createElement('p');
            authorText.classList.add('modal-info-text');
            authorText.textContent = "Author: " + bookObject.author;
            modalTitleText.after(authorText);
            let yearText = document.createElement('p');
            yearText.classList.add('modal-info-text');
            yearText.textContent = "Year: " + bookObject.year;
            authorText.after(yearText);
            let descriptionText = document.createElement('p');
            descriptionText.classList.add('modal-info-text');
            descriptionText.textContent = "Plot: " + bookObject.description;
            yearText.after(descriptionText);

        }
        else {
            console.log("Modal Not Found");
        }



    } catch (error) {
        console.error(error);
    }


}

//When given a movie title to search for, the function fetchs and retrieves the first 10 movie results from the Movie Alternative Database.
const searchForMovies = async (currentSearchText) => {
    //remove any previous search results;
    removePreviousSearchResults();
    //TODO Get the search values out of the controls the results and make sure the text box is not blank.
    console.log("Searching Movies");
    let messageDisplay = document.querySelector('.message-display');
    if (messageDisplay) {
        document.querySelector('.message-display').style.display = "block";
        document.getElementById("search-message").textContent = "LOADING...";
    }
    else {
        //message Display no longer exists, need to recreate
        let newMessageDisplay = document.createElement('div');
        newMessageDisplay.className = "message-display";
        //recreate h2 and append
        let newSearchHeader = document.createElement('h2');
        newSearchHeader.textContent = "LOADING...";
        newMessageDisplay.appendChild(newSearchHeader);
        searchResultsContainer.append(newMessageDisplay);
    }

    const url = 'https://movie-database-alternative.p.rapidapi.com/?s=' + currentSearchText + '&r=json&page=1';
    console.log(url);
    const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': '1f7d21f524msha8ec2b27679b7a9p1fc378jsnb4e51c042015',
            'X-RapidAPI-Host': 'movie-database-alternative.p.rapidapi.com'
        }
    };

    try {
        const response = await fetch(url, options);
        const result = await response.json();

        //parse out relevant values
        //first value: Response - did we get a value back or not
        if (result.Response) {
            //we found a movie that matched the search value
            //Search is the list of results
            console.log(result.Search)
            document.querySelector('.message-display').style.display = "none";
            //Loop through the results and put the correct values in the correct spots.
            for (let i = 0; i < result.Search.length && i < 5; i++) {
                let foundMovie = {
                    id: result.Search[i].imdbID,
                    title: result.Search[i].Title,
                    year: result.Search[i].Year,
                    PosterURL: result.Search[i].Poster,
                }
                console.log("Logging Found Movie");
                console.log(foundMovie);

                //Create the HTML searchResult List Item and append it to the correct container
                let foundMovieContainer = document.createElement('div');
                foundMovieContainer.id = "movie-" + foundMovie.id;
                foundMovieContainer.classList.add('movie-tile');


                //poster title container
                let titlePosterContainer = document.createElement('div');
                titlePosterContainer.classList.add('title-poster-container');



                //img for poster
                let posterImage = document.createElement('img');
                posterImage.classList.add('search-result-poster');
                posterImage.src = foundMovie.PosterURL;
                posterImage.alt = "Poster for the movie " + foundMovie.title;
                //h3 for title
                let foundMovieTitle = document.createElement('h3');
                foundMovieTitle.classList.add('search-result-title');
                foundMovieTitle.textContent = foundMovie.title + " (" + foundMovie.year + ")";
                //two buttons

                //button container
                let btnContainer = document.createElement('div');
                btnContainer.classList.add('search-btn-container')

                //favorite button
                let favoritesBtn = document.createElement('button');
                favoritesBtn.textContent = "ADD TO FAVORITES";
                favoritesBtn.classList.add("info-favorite");
                favoritesBtn.addEventListener("click", () => {
                    addMovieToFavorites(foundMovie);
                });


                let moreInfoBtn = document.createElement('button');
                moreInfoBtn.textContent = "SEE MORE INFO";
                moreInfoBtn.classList.add("info-favorite");
                moreInfoBtn.addEventListener("click", () => {
                    openModal("movie", foundMovie.id);
                });


                titlePosterContainer.appendChild(posterImage);
                btnContainer.appendChild(foundMovieTitle);

                btnContainer.appendChild(favoritesBtn);
                btnContainer.appendChild(moreInfoBtn);
                foundMovieContainer.appendChild(btnContainer);
                foundMovieContainer.appendChild(titlePosterContainer);
                searchResultsContainer.append(foundMovieContainer)

            }


        }

        else {
            //we did not find any movies with the typed in name
        }



    } catch (error) {
        console.error(error);
    }

}


const searchForBooks = async (currentSearchText) => {
    console.log("Searching Books");
    removePreviousSearchResults();
    let messageDisplay = document.querySelector('.message-display');
    if (messageDisplay) {
        document.querySelector('.message-display').style.display = "block";
        document.getElementById("search-message").textContent = "LOADING...";
    }
    else {
        //message Display no longer exists, need to recreate
        let newMessageDisplay = document.createElement('div');
        newMessageDisplay.className = "message-display";
        //recreate h2 and append
        let newSearchHeader = document.createElement('h2');
        newSearchHeader.textContent = "LOADING...";
        newMessageDisplay.appendChild(newSearchHeader);
        searchResultsContainer.append(newMessageDisplay);
    }

    const url = 'https://openlibrary.org/search.json?q=' + new URLSearchParams(currentSearchText + "&limit=5");
    console.log(url);
    const options = {
        method: 'GET',
    };

    try {
        const response = await fetch(url, options);
        const result = await response.json();
        console.log(result.docs);
        for (let i = 0; i < result.docs.length; i++) {
            if (result.docs[i]) {


                let foundBookSearch = {
                    isbn: result.docs[i].isbn[0],
                    title: result.docs[i].title,
                    author: result.docs[i].author_name[0],
                    year: result.docs[i].first_publish_year,
                    description: result.docs[i].first_sentence[0],
                    coverURL: 'https://covers.openlibrary.org/b/isbn/' + result.docs[i].isbn[0] + '.jpg'
                }
                //Create the HTML searchResult List Item and append it to the correct container
                let foundBookContainer = document.createElement('div');
                foundBookContainer.isbn = "movie-" + foundBookSearch.isbn;
                foundBookContainer.classList.add('movie-tile');


                //poster title container
                let titlePosterContainer = document.createElement('div');
                titlePosterContainer.classList.add('title-poster-container');



                //img for poster
                let posterImage = document.createElement('img');
                posterImage.classList.add('search-result-poster');
                posterImage.src = foundBookSearch.coverURL;
                posterImage.alt = "Poster for the movie " + foundBookSearch.title;
                //h3 for title
                let foundBookTitle = document.createElement('h3');
                foundBookTitle.classList.add('search-result-title');
                foundBookTitle.textContent = foundBookSearch.title + " (" + foundBookSearch.year + ")";
                //two buttons

                //button container
                let btnContainer = document.createElement('div');
                btnContainer.classList.add('search-btn-container')

                //favorite button
                let favoritesBtn = document.createElement('button');
                favoritesBtn.textContent = "ADD TO FAVORITES";
                favoritesBtn.classList.add("info-favorite");
                favoritesBtn.addEventListener("click", () => {
                    addBookToFavorites(foundBookSearch);
                });


                let moreInfoBtn = document.createElement('button');
                moreInfoBtn.textContent = "SEE MORE INFO";
                moreInfoBtn.classList.add("info-favorite");
                moreInfoBtn.addEventListener("click", () => {
                    openModal("book", foundBookSearch);
                });
                document.querySelector('.message-display').style.display = "none";

                titlePosterContainer.appendChild(posterImage);
                btnContainer.appendChild(foundBookTitle);

                btnContainer.appendChild(favoritesBtn);
                btnContainer.appendChild(moreInfoBtn);
                foundBookContainer.appendChild(btnContainer);
                foundBookContainer.appendChild(titlePosterContainer);
                searchResultsContainer.append(foundBookContainer)

            }
        }

    } catch (error) {
        console.error(error);
    }



}

const searchMediaAPIs = (event) => {
    event.preventDefault();
    //Check if the input is not blank. If it has value, process the request
    let currentSearchText = mediaSearchTextBox.value;
    console.log("Searching For:");
    console.log(currentSearchText);
    if (currentSearchText) {

        //check if it's a book or movie search
        if (mediaSearchType.value === "Movies") {
            searchForMovies(currentSearchText);
        }
        else {
            searchForBooks(currentSearchText);
        }


    }
}


//Add a submit listener to the Form to process search request
searchForm.addEventListener('submit', searchMediaAPIs);

/*************************************/
/*       Utility Functions         * /
/***********************************/


const openModal = (mediaType, mediaID) => {

    if (mediaType == "movie") {
        console.log("OPENING MODAL");
        let panel = document.createElement('div');
        panel.classList.add('modal-panel');

        let modalContent = document.createElement('div');
        modalContent.classList.add('modal-content');

        let modalContainer = document.createElement('div');
        modalContainer.classList.add('modal-container');

        let modalText = document.createElement('h2');
        modalText.classList.add('modal-title-text');
        modalText.textContent = "LOADING..";

        let modalExitBtn = document.createElement('span');
        modalExitBtn.classList.add('modal-exit-button');
        modalExitBtn.textContent = "X";
        modalExitBtn.addEventListener("click", closeModal);

        modalContainer.appendChild(modalExitBtn);
        modalContainer.appendChild(modalText);
        modalContent.appendChild(modalContainer);
        panel.appendChild(modalContent);

        let body = document.querySelector('body');
        body.append(panel);

        loadMoreMovieDetails(mediaID);
    }
    else if (mediaType == "book") {
        console.log("OPENING MODAL");
        let panel = document.createElement('div');
        panel.classList.add('modal-panel');

        let modalContent = document.createElement('div');
        modalContent.classList.add('modal-content');

        let modalContainer = document.createElement('div');
        modalContainer.classList.add('modal-container');

        let modalText = document.createElement('h2');
        modalText.classList.add('modal-title-text');
        modalText.textContent = "LOADING..";

        let modalExitBtn = document.createElement('span');
        modalExitBtn.classList.add('modal-exit-button');
        modalExitBtn.textContent = "X";
        modalExitBtn.addEventListener("click", closeModal);
        modalContainer.appendChild(modalExitBtn);
        modalContainer.appendChild(modalText);
        modalContent.appendChild(modalContainer);
        panel.appendChild(modalContent);

        let body = document.querySelector('body');
        body.append(panel);

        loadMoreBookDetails(mediaID.isbn, mediaID);
    }

    //display greyed out panel over screen


}

const closeModal = () => {
    console.log("Clicking Exit Modal");
    let foundModal = document.querySelector('.modal-panel');
    console.log(foundModal);
    if (foundModal) {
        console.log("Found A modal");
        foundModal.remove();
    }

}

const removePreviousSearchResults = () => {
    while (searchResultsContainer.firstChild) {
        searchResultsContainer.removeChild(searchResultsContainer.firstChild);
    }

}

const addMovieToFavorites = (movieObject) => {
    console.log("LOGGING NEW MOVIE IN FAVORITES");
    console.log(movieObject);
    localStorage.setItem("movie-" + movieObject.id, JSON.stringify(movieObject));
    location.reload();
}

const addBookToFavorites = (bookObject) => {
    console.log("LOGGING NEW MOVIE IN FAVORITES");
    console.log(bookObject);
    localStorage.setItem("book-" + bookObject.isbn, JSON.stringify(bookObject));
    location.reload();
}


const removeBookFavorite = (bookId) => {


    if (localStorage.length) {

        for (let i = 0; i < localStorage.length; i++) {

            if (localStorage.key(i) === "book-" + bookId) {
                localStorage.removeItem("book-" + bookId);
            }
        }

        location.reload();
    }


}

const removeMovieFavorite = (movieId) => {


    if (localStorage.length) {

        for (let i = 0; i < localStorage.length; i++) {

            if (localStorage.key(i) === "movie-" + movieId) {
                localStorage.removeItem("movie-" + movieId);
            }
        }

        location.reload();


    }


}

const loadFavoriteBooks = async () => {
    let foundFavoriteBooks = 0;
    if (localStorage.length) {
        for (let i = 0; i < localStorage.length; i++) {

            if (localStorage.key(i).includes("book")) {
                console.log("I FOUND A FAVORITE BOOK IN LOCALSTORAGE");
                foundFavoriteBooks++;
                let foundBook = localStorage.getItem(localStorage.key(i));
                console.log("FOUND A MOVIE FAVORITE");
                console.log(JSON.parse(foundBook));
                let parsedBookData = JSON.parse(foundBook);

                let newBookListItem = document.createElement('li');
                newBookListItem.classList.add('favorite-item');

                let newBookItemDetails = document.createElement('div');
                newBookItemDetails.classList.add('favorite-item-details');

                let newBookItemImage = document.createElement('img');
                newBookItemImage.classList.add('favorite-item-poster');
                newBookItemImage.alt = "Poster for the movie ";
                newBookItemImage.src = parsedBookData.coverURL;

                let newBookParagraphOne = document.createElement('p');
                newBookParagraphOne.classList.add('favorite-item-title');
                newBookParagraphOne.textContent = parsedBookData.title;

                let newBookParagraphTwo = document.createElement('p');
                newBookParagraphTwo.classList.add('favorite-item-year');
                newBookParagraphTwo.textContent = parsedBookData.year;

                let removeBtn = document.createElement('button');
                removeBtn.classList.add('remove-btn');
                removeBtn.textContent = "REMOVE";
                removeBtn.id = "remove-btn-" + parsedBookData.isbn;
                removeBtn.addEventListener("click", () => {
                    removeBookFavorite(parsedBookData.isbn);
                })

                newBookListItem.appendChild(newBookItemImage);
                newBookListItem.appendChild(newBookParagraphOne);
                newBookListItem.appendChild(newBookParagraphTwo);
                newBookListItem.appendChild(removeBtn);
                let favoritesList = document.getElementById('books-favorites');
                favoritesList.appendChild(newBookListItem);

            }
            else {
                if (foundFavoriteBooks <= 0) {


                    if (!document.getElementById("book-message-display")) {
                        let messageDisplayMovieFavorite = document.createElement('p')
                        messageDisplayMovieFavorite.textContent = "No favorite books selected. Please search and pick your favorites";
                        messageDisplayMovieFavorite.id = "book-message-display";
                        let favoritesList = document.querySelector('#books-favorites');
                        favoritesList.append(messageDisplayMovieFavorite);
                    }
                }
            }


        }
    }
    else {
        console.log("FOUND NO Books");
        if (!document.getElementById("book-message-display")) {
            let messageDisplayMovieFavorite = document.createElement('p')
            messageDisplayMovieFavorite.textContent = "No favorite books selected. Please search and pick your favorites";
            messageDisplayMovieFavorite.id = "book-message-display";
            let favoritesList = document.querySelector('#books-favorites');
            favoritesList.append(messageDisplayMovieFavorite);
        }
    }





}


const loadFavoriteMovies = async () => {
    let foundMovies = 0;
    if (localStorage.length) {

        for (let i = 0; i < localStorage.length; i++) {

            if (localStorage.key(i).includes("movie")) {
                foundMovies++;
                let foundMovie = localStorage.getItem(localStorage.key(i));
                console.log("FOUND A MOVIE FAVORITE");
                console.log(JSON.parse(foundMovie));
                let parsedMovieData = JSON.parse(foundMovie);

                let newMovieListItem = document.createElement('li');
                newMovieListItem.classList.add('favorite-item');

                let newMovieItemDetails = document.createElement('div');
                newMovieItemDetails.classList.add('favorite-item-details');

                let newMovieItemImage = document.createElement('img');
                newMovieItemImage.classList.add('favorite-item-poster');
                newMovieItemImage.alt = "Poster for the movie ";
                newMovieItemImage.src = parsedMovieData.PosterURL;

                let newMovieParagraphOne = document.createElement('p');
                newMovieParagraphOne.classList.add('favorite-item-title');
                newMovieParagraphOne.textContent = parsedMovieData.title;

                let newMovieParagraphTwo = document.createElement('p');
                newMovieParagraphTwo.classList.add('favorite-item-year');
                newMovieParagraphTwo.textContent = parsedMovieData.year;

                let removeBtn = document.createElement('button');
                removeBtn.classList.add('remove-btn');
                removeBtn.textContent = "REMOVE";
                removeBtn.id = "remove-btn-" + parsedMovieData.id;
                removeBtn.addEventListener("click", () => {
                    removeMovieFavorite(parsedMovieData.id);
                })

                newMovieListItem.appendChild(newMovieItemImage);
                newMovieListItem.appendChild(newMovieParagraphOne);
                newMovieListItem.appendChild(newMovieParagraphTwo);
                newMovieListItem.appendChild(removeBtn);
                let favoritesList = document.getElementById('movies-favorites');
                favoritesList.appendChild(newMovieListItem);
            }



        }
        if (foundMovies <= 0) {
            console.log("Found Item in List, but not a movie");
            if (!document.getElementById("movie-message-display")) {
                let messageDisplayMovieFavorite = document.createElement('p');
                messageDisplayMovieFavorite.id = "movie-message-display";
                messageDisplayMovieFavorite.textContent = "No favorite movies selected. Please search and pick your favorites";
                let favoritesList = document.querySelector('#movies-favorites');
                favoritesList.append(messageDisplayMovieFavorite);
            }

        }

    }

    else {
        console.log("FOUND NO MOVIE");
        if (!document.getElementById("movie-message-display")) {
            let messageDisplayMovieFavorite = document.createElement('p');
            messageDisplayMovieFavorite.id = "movie-message-display";
            messageDisplayMovieFavorite.textContent = "No favorite movies selected. Please search and pick your favorites";
            let favoritesList = document.querySelector('#movies-favorites');
            favoritesList.append(messageDisplayMovieFavorite);
        }

    }
}



loadFavoriteBooks();
loadFavoriteMovies();