const movieContainer = document.querySelector('#movieContainer');

// Class to represent a Movie
class Movie {
    constructor(title, img) {
        this.title = title;
        this.img = img;
    }
}

// UI Class: interactions with UI
class UI {
    // display movie cards
    static displayMovies() {

        const movies = Store.getMovies();

        movies.forEach((movie) => UI.addMovie(movie))

    }


    // adds movies cards to movieContainer
    static addMovie(movie) {
        const card = document.createElement('div');
        card.classList.add('col-md-3', 'mb-2');
        card.innerHTML = `
            <div class="card h-100">
                <img class="card-img-top" src="${movie.img}" alt="Movie Title">
                <div class="card-body">
                        <p class="card-text" id="title"> ${movie.title}</p>
                       
                </div>
                <button type="button" class="btn btn-danger delete">Delete Movie</button>
            </div>
        `;

        movieContainer.appendChild(card)
    }

    // Delete movie from movieContainer
    static deleteMovie(el) {
        if (el.classList.contains('delete')) {
            el.parentElement.parentElement.remove()
        }
    }

    // Method to clear input field  value
    static clearField() {
        document.querySelector('#title').value = ''
    }

    // Add Alerts
    static showAlert(message, className) {
        const div = document.createElement('div')
        div.className = `alert alert-${className} col-md-6 text-center`
        div.appendChild(document.createTextNode(message))
        const movieForm = document.querySelector('#movie-form')
        const before = document.querySelector('#al')
        movieForm.insertBefore(div, before)
        //remove alert after 3 seconds
        setTimeout(() => document.querySelector('.alert').remove(), 3000)
    }
}



// Store Class: Handles Storage
class Store {
    // check local storage and display movies
    static getMovies() {
        let movies;
        if (localStorage.getItem('movies') === null) {
            movies = []
        } else {
            movies = JSON.parse(localStorage.getItem('movies'))
        }

        return movies
    }

    // Add movie to local storage
    static addMovieToStore(movie) {
        const movies = Store.getMovies()

        movies.push(movie)

        localStorage.setItem('movies', JSON.stringify(movies))
    }

    // Delete movie form localStorage
    static removeMovie(img) {
        //console.log(img);
        const movies = Store.getMovies()
        movies.forEach((movie, index) => {
            if (movie.img === img || movie.img === 'N/A') {
                console.log(true);
                movies.splice(index, 1)
            }
        })

        localStorage.setItem('movies', JSON.stringify(movies))
    }
}

// Event get value for image
let image;
document.querySelector('#title').addEventListener('input', (e) => {
    //console.log(e.target.value);
    async function returnImage() {
            let resp = await fetch(`http://omdbapi.com/?t=${e.target.value}&apikey=2067d7db`)
            let data = await resp.json();
            return data
        }

        returnImage()
            .then(data => image = data.Poster);


})

// Event Display Movies
document.addEventListener('DOMContentLoaded', UI.displayMovies)


// Event Add Movie
document.querySelector('#movie-form').addEventListener('submit', (e) => {
    e.preventDefault()

    // Get the value from input
    const title = document.querySelector('#title').value;

    // checks if poster fro the movie is available and after that add movie to the container
    if (image) {
        // Instantiate Movie
        const movie = new Movie(title, image)

        console.log(movie);

        // Clears input field
        UI.clearField()

        // Add Movie to UI
        UI.addMovie(movie)

        // Add movie to localStorage
        Store.addMovieToStore(movie)

        // Show alert for successfully adding Movie to the list
        UI.showAlert('The movie has been successfully added', 'success')
    }

    // If poster for the movie is unavailable show alert
    if (!image) {
        UI.showAlert('Sorry, poster fot the movie is unavailable', 'danger')
        UI.clearField()
    }


})
// Event Remove Movie
movieContainer.addEventListener('click', (e) => {
   if (e.target.classList.contains('delete')) {
    //Remove movie from UI
    UI.deleteMovie(e.target)

    // Remove movie from localStorage

    Store.removeMovie(e.target.parentElement.querySelector('.card-img-top').src)
    console.log(e.target.parentElement.querySelector('.card-img-top').src);

    // Show alert
    UI.showAlert('The movie has been successfully deleted', 'danger')
   }

})

