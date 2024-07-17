const state = {
    currentPage: window.location.pathname,
}

// Function to highlight active link
const highlightActiveLink = () => {
    const links = document.querySelectorAll('.nav-link');
    links.forEach(link => {
        if (link.getAttribute('href') === state.currentPage) {
            link.classList.add('active');
        }
    });
}

const fetchAPIData = async(url) => {
    const API_KEY = '1ba70249e113b69ca503011300acd9cb';
    showSpinner();
    const response = await fetch(`${url}?api_key=${API_KEY}`);
    const data = await response.json();
    hideSpinner();
    return data;
}

const getMovieDetails = async(id) => {
    const movie = await fetchAPIData(`https://api.themoviedb.org/3/movie/${id}`);
    const movieDetailsContainer = document.querySelector('#movie-details');

    displayOverlay('movie', movie.backdrop_path);

    const movieDetails = document.createElement('div');
    movieDetails.innerHTML = `
        <div class="details-top">
            <div>
                <img
                src="https://image.tmdb.org/t/p/w500${movie.poster_path}"
                class="card-img-top"
                alt="Movie Title"
                />
            </div>
            <div>
                <h2>${movie.title}</h2>
                <p>
                <i class="fas fa-star text-primary"></i>
                ${movie.vote_average.toFixed(1)} / 10
                </p>
                <p class="text-muted">Release Date: ${movie.release_date}</p>
                <p>
                ${movie.overview}
                </p>
                <h5>Genres</h5>
                <ul class="list-group">
                ${
                    movie.genres.map(genre => `<li class="list-group-item">${genre.name}</li>`).join('')
                }
                </ul>
                <a href="${movie.homepage}" target="_blank" class="btn">Visit Movie Homepage</a>
            </div>
            </div>
            <div class="details-bottom">
            <h2>Movie Info</h2>
            <ul>
                <li><span class="text-secondary">Budget:</span> $${addComas(movie.budget)}</li>
                <li><span class="text-secondary">Revenue:</span> $${addComas(movie.revenue)}</li>
                <li><span class="text-secondary">Runtime:</span> ${movie.runtime} minutes</li>
                <li><span class="text-secondary">Status:</span> ${movie.status}</li>
            </ul>
            <h4>Production Companies</h4>
            <div class="list-group">
                ${
                    movie.production_companies.map(company => `<span>${company.name}</span>`).join(', ')
                }
            </div>
        </div>
    `;
    movieDetailsContainer.appendChild(movieDetails);
}

const getShowdetails = async(id) => {
    const show = await fetchAPIData(`https://api.themoviedb.org/3/tv/${id}`);
    const showDetailsContainer = document.querySelector('#show-details');

    displayOverlay('show', show.backdrop_path);

    const showDetails = document.createElement('div');
    showDetails.innerHTML = `
        <div class="details-top">
          <div>
            <img
              src="https://image.tmdb.org/t/p/w500${show.poster_path}"
              class="card-img-top"
              alt="Show Name"
            />
          </div>
          <div>
            <h2>${show.name}</h2>
            <p>
              <i class="fas fa-star text-primary"></i>
              ${show.vote_average.toFixed(1)} / 10
            </p>
            <p class="text-muted">First Air Date: ${show.first_air_date}</p>
            <p class="text-muted">Last Air Date: ${show.last_air_date}</p>
            <p>${show.overview}</p>
            <h5>Genres</h5>
            <ul class="list-group">
                ${
                    show.genres.map(genre => `<li class="list-group-item">${genre.name}</li>`).join('')
                }
            </ul>
            <a href="${show.homepage}" target="_blank" class="btn">Visit Show Homepage</a>
          </div>
        </div>
        <div class="details-bottom">
          <h2>Show Info</h2>
          <ul>
            <li>
              <span class="text-secondary">Number of Seasons:</span> ${show.number_of_seasons}
            </li>
            <li><span class="text-secondary">Number Of Episodes:</span> ${show.number_of_episodes}</li>
            <li>
              <span class="text-secondary">Last Episode To Air:</span> ${show.last_episode_to_air.name}
            </li>
            <li><span class="text-secondary">Status:</span> ${show.status}</li>
          </ul>
          <h4>Production Companies</h4>
          <div class="list-group">
            ${
                show.production_companies.map(company => `<span>${company.name}</span>`).join(', ')
            }
          </div>
        </div>
    `;
    showDetailsContainer.appendChild(showDetails);
}

const getPopularTVShows = async() => {
    const { results } = await fetchAPIData('https://api.themoviedb.org/3/tv/popular');
    const showsContainer = document.querySelector('#popular-shows');
    results.forEach(show => {
        const showCard = document.createElement('div');
        showCard.innerHTML = `
        <div class="card">
        <a href="tv-details.html?id=${show.id}">
            <img
                src="https://image.tmdb.org/t/p/w500${show.poster_path}"
                class="card-img-top"
                alt="Show Title"
            />
        </a>
        <div class="card-body">
            <h5 class="card-title">${show.name}</h5>
            <p class="card-text">
                <small class="text-muted">Aired: ${show.first_air_date}</small>
            </p>
        </div>
        </div>
        `;
        showsContainer.appendChild(showCard);
    });
}

const getPopularMovies = async() => {
    const { results } = await fetchAPIData('https://api.themoviedb.org/3/movie/popular');
    const moviesContainer = document.querySelector('#popular-movies');
    results.forEach(movie => {
        const movieCard = document.createElement('div');
        movieCard.innerHTML = `
        <div class="card">
            <a href="movie-details.html?id=${movie.id}">
                <img
                src="https://image.tmdb.org/t/p/w500${movie.poster_path}"
                class="card-img-top"
                alt="Movie Title"
            />
            </a>
            <div class="card-body">
                <h5 class="card-title">${movie.title}</h5>
                <p class="card-text">
                <small class="text-muted">Release: ${movie.release_date}</small>
                </p>
            </div>
        </div>
        `;
        moviesContainer.appendChild(movieCard);

    });
}

const swipeMovies = async() => {
    const {results} = await fetchAPIData('https://api.themoviedb.org/3/movie/now_playing');     
    
    const swiper = document.querySelector('.swiper-wrapper');

    results.forEach(movie => {
        const div = document.createElement('div');
        div.classList.add('swiper-slide');
        div.innerHTML = `
        <a href="movie-details.html?id=${movie.id}">
            <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt=${movie.title} />
        </a>
        <h4 class="swiper-rating">
            <i class="fas fa-star text-secondary"></i> ${movie.vote_average.toFixed(1)} / 10
        </h4>
        `;
        swiper.appendChild(div);
    });
}

const swipeShows = async() => {
    const {results} = await fetchAPIData('https://api.themoviedb.org/3/tv/on_the_air');     
    
    const swiper = document.querySelector('.swiper-wrapper');

    results.forEach(movie => {
        const div = document.createElement('div');
        div.classList.add('swiper-slide');
        div.innerHTML = `
        <a href="movie-details.html?id=${movie.id}">
            <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt=${movie.title} />
        </a>
        <h4 class="swiper-rating">
            <i class="fas fa-star text-secondary"></i> ${movie.vote_average.toFixed(1)} / 10
        </h4>
        `;
        swiper.appendChild(div);
    });
}

const initSwiper = () => {
    const swiper = new Swiper('.swiper', {
        slidesPerView: 1,
        spaceBetween: 30,
        loop: true,
        freeMode: true,
        autoplay: {
            delay: 3000,
            disableOnInteraction: false,
        },
        breakpoints: {
            640: {
                slidesPerView: 2,
                spaceBetween: 20,
            },
            768: {
                slidesPerView: 3,
                spaceBetween: 40,
            },
            1024: {
                slidesPerView: 4,
                spaceBetween: 30,
            },
        },
    });
}

const displayOverlay = (type, backdropPath) => {
    const div = document.createElement('div');
    div.style.backgroundImage = `url('https://image.tmdb.org/t/p/original${backdropPath}')`;
    div.style.backgroundSize = 'cover';
    div.style.backgroundPosition = 'center';
    div.style.backgroundRepeat = 'no-repeat';
    //div.style.filter = 'blur(1px)';
    div.style.height = '100vh';
    div.style.width = '100vw';
    div.style.position = 'absolute';
    div.style.top = '0';
    div.style.left = '0';
    div.style.zIndex = '-1';
    div.style.opacity = '0.2';

    if (type === 'movie') {
        document.querySelector('#movie-details').appendChild(div);
    } else {
        document.querySelector('#show-details').appendChild(div);
    }
}

const showSpinner = () => {
    document.querySelector('.spinner').classList.add('show');
}

const hideSpinner = () => {
    document.querySelector('.spinner').classList.remove('show');
}

const addComas = (number) => {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

// Function to initialize the page
const init = () => { 
    addEventListener('DOMContentLoaded', initSwiper);
    switch (state.currentPage) {
        case '/':
        case '/index.html':
            swipeMovies();
            getPopularMovies();
            break;
            case '/shows.html':
            swipeShows();
            getPopularTVShows();
            break;
        case '/movie-details.html':
            const movieID = new URLSearchParams(window.location.search).get('id');
            getMovieDetails(movieID);
            break;
        case '/tv-details.html':
            const showID = new URLSearchParams(window.location.search).get('id');
            getShowdetails(showID);
            break;
        case '/search.html':
            console.log('Search page');
            break;
    }
    highlightActiveLink();
}

init();