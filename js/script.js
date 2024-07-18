const state = {
    currentPage: window.location.pathname,
    searchQuery: {
        term: '',
        type: '',
        page: 1,
        totalPages: 1,
        totalResults: 0,
    },
    api: {
        key: '1ba70249e113b69ca503011300acd9cb',
        url: 'https://api.themoviedb.org/3',
    }
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
    const API_KEY = state.api.key;
    showSpinner();
    const response = await fetch(`${url}?api_key=${API_KEY}`);
    const data = await response.json();
    hideSpinner();
    return data;
}

const searchAPIData = async() => {
    const API_KEY = state.api.key;
    const { term, type, page } = state.searchQuery;
    showSpinner();
    const response = await fetch(`${state.api.url}/search/${type}?api_key=${API_KEY}&query=${term}&page=${page}`);
    const data = await response.json();
    hideSpinner();
    return data;
}

const getMovieDetails = async(id) => {
    const movie = await fetchAPIData(`https://api.themoviedb.org/3/movie/${id}`);
    const { cast, crew } = await fetchAPIData(`https://api.themoviedb.org/3/movie/${id}/credits`);
    const director = crew.find(member => member.job === 'Director');
    console.log(director.name);
    const writers = crew.filter(member => member.job === 'Screenplay');
    console.log(writers);
    const movieDetailsContainer = document.querySelector('#movie-details');
    cast.length = 15;
    displayOverlay('movie', movie.backdrop_path);

    const movieDetails = document.createElement('div');
    movieDetails.innerHTML = `
        <div class="details-top">
            <div>
                <img
                src=${movie.poster_path !== null
                ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                : '/images/no-image.jpg'
                }
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
            <div class="list-group">
            </div>
            <h2>Movie Info</h2>
            <ul>
                <li><span class="text-secondary">Director:</span> ${director.name}</li>
                <li><span class="text-secondary">Writers:</span> ${
                    writers.map(writer => writer.name).join(', ')
                }</li>
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

    const castContainer = document.querySelector('#cast');
    cast.forEach(actor => {
        const actorCard = document.createElement('div');
        actorCard.classList.add('card');
        actorCard.innerHTML = `
        <img
            src=${
                actor.profile_path !== null
                ? `https://image.tmdb.org/t/p/w500${actor.profile_path}`
                : '/images/no-image.jpg'
            }
            class="card-img-top"
            alt="Actor Name"
        />
        <div class="card-body">
            <h5 class="card-title">${actor.name}</h5>
            <p class="card-text">${actor.character}</p>
        </div>
        `;
        castContainer.appendChild(actorCard);
    });
}

const getShowdetails = async(id) => {
    const show = await fetchAPIData(`https://api.themoviedb.org/3/tv/${id}`);
    const { cast } = await fetchAPIData(`https://api.themoviedb.org/3/tv/${id}/credits`);
    console.log(cast);
    cast.length = 10;
    
    const showDetailsContainer = document.querySelector('#show-details');

    displayOverlay('show', show.backdrop_path);

    const showDetails = document.createElement('div');
    showDetails.innerHTML = `
        <div class="details-top">
          <div>
            <img
              src=${
                show.poster_path !== null
                ? `https://image.tmdb.org/t/p/w500${show.poster_path}`
                : '/images/no-image.jpg'
            }
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

    const castContainer = document.querySelector('#cast');
    cast.forEach(actor => {
        const actorCard = document.createElement('div');
        actorCard.classList.add('card');
        actorCard.innerHTML = `
        <img
            src=${
                actor.profile_path !== null
                ? `https://image.tmdb.org/t/p/w500${actor.profile_path}`
                : '/images/no-image.jpg'
            }
            class="card-img-top"
            alt="Actor Name"
        />
        <div class="card-body">
            <h5 class="card-title">${actor.name}</h5>
            <p class="card-text">${actor.character}</p>
        </div>
        `;
        castContainer.appendChild(actorCard);
    });
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
                src=${
                    show.poster_path !== null
                    ? `https://image.tmdb.org/t/p/w500${show.poster_path}`
                    : '/images/no-image.jpg'
                }
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
                src=${
                    movie.poster_path !== null
                    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                    : '/images/no-image.jpg'
                }
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

const getTopRatedMovies = async() => {
    const { results } = await fetchAPIData('https://api.themoviedb.org/3/movie/top_rated');
    const moviesContainer = document.querySelector('#top-rated-movies');
    results.forEach(movie => {
        const movieCard = document.createElement('div');
        movieCard.innerHTML = `
        <div class="card">
            <a href="movie-details.html?id=${movie.id}">
                <img
                src=${
                    movie.poster_path !== null
                    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                    : '/images/no-image.jpg'
                }
                class="card-img-top"
                alt="Movie Title"
            />
            </a>
            <div class="card-body">
                <h5 class="card-title">${movie.title}</h5>
                <h5 class="swiper-rating">
                <i class="fas fa-star text-secondary"></i> ${movie.vote_average.toFixed(1)} / 10
                </h5>
            </div>
        </div>
        `;
        moviesContainer.appendChild(movieCard);

    });
}

const getTopRatedShows = async () => {
    const { results } = await fetchAPIData('https://api.themoviedb.org/3/tv/top_rated');
    const showsContainer = document.querySelector('#top-rated-shows');
    results.forEach(show => {
        const showCard = document.createElement('div');
        showCard.innerHTML = `
        <div class="card">
        <a href="tv-details.html?id=${show.id}">
            <img
                src=${
                    show.poster_path !== null
                    ? `https://image.tmdb.org/t/p/w500${show.poster_path}`
                    : '/images/no-image.jpg'
                }
                class="card-img-top"
                alt="Show Title"
            />
        </a>
        <div class="card-body">
            <h5 class="card-title">${show.name}</h5>
            <h5 class="swiper-rating">
            <i class="fas fa-star text-secondary"></i> ${show.vote_average.toFixed(1)} / 10
            </h5>
        </div>
        </div>
        `;
        showsContainer.appendChild(showCard);
    });
}

const search = async() => {
    const urlParams = new URLSearchParams(window.location.search);

    state.searchQuery.type = urlParams.get('type');
    state.searchQuery.term = urlParams.get('search-term');

    if(state.searchQuery.term !== null && state.searchQuery.term !== '') {
        const {results, total_pages, page, total_results} = await searchAPIData()
        
        state.searchQuery.page = page;
        state.searchQuery.totalPages = total_pages;
        state.searchQuery.totalResults = total_results;

        if(results.length === 0){
            showAlert('No results found');
            return;
        }

        displaySearchResults(results, total_pages, page);

        document.querySelector('#search-term').value = '';
    } else {
        showAlert('Please enter a search term');
    }
}

const displaySearchResults = (results, totalPages, page) => {
    const resultsContainer = document.querySelector('#search-results');
    resultsContainer.innerHTML = '';
    document.querySelector('#pagination').innerHTML = '';
    document.querySelector('#search-results-heading').innerHTML = '';
    results.forEach(result => {
        const resultCard = document.createElement('div');
        resultCard.innerHTML = `
        <div class="card">
            <a href="${state.searchQuery.type}-details.html?id=${result.id}">
                <img
                src= ${
                    result.poster_path !== null
                    ? `https://image.tmdb.org/t/p/w500${result.poster_path}`
                    : '/images/no-image.jpg'
                }
                class="card-img-top"
                alt="${state.searchQuery.type === 'movie'? result.title : result.name} Title"
            />
            </a>
            <div class="card-body">
                <h5 class="card-title">${state.searchQuery.type === 'movie'? result.title : result.name}</h5>
                <p class="card-text">
                <small class="text-muted">Release: ${state.searchQuery.type === 'movie'? result.release_date : result.first_air_date}</small>
                </p>
            </div>
        </div>
        `;
        resultsContainer.appendChild(resultCard);
    });

    document.querySelector('#search-results-heading').innerHTML = `
    <h2>${results.length} of ${state.searchQuery.totalResults} results for "${state.searchQuery.term}"</h2>
    `

    displayPagination(totalPages, page);
}

const displayPagination = (totalPages, currentPage) => {
    const div = document.createElement('div');
    div.classList.add('pagination');
    div.innerHTML = `
        <button class="btn btn-primary" id="prev">Prev</button>
        <button class="btn btn-primary" id="next">Next</button>
        <div class="page-counter">Page ${currentPage} of ${totalPages}</div>
    `;

    document.querySelector('#pagination').appendChild(div);

    if(currentPage === 1) {
        document.getElementById('prev').disabled = true;
    }
    if(currentPage === totalPages) {
        document.getElementById('next').disabled = true;
    }

    document.getElementById('prev').addEventListener('click', async() => {
        state.searchQuery.page--;
        const {results, total_pages, page} = await searchAPIData();
        displaySearchResults(results, total_pages, page);
    });

    document.getElementById('next').addEventListener('click', async() => {
        state.searchQuery.page++;
        const {results, total_pages, page} = await searchAPIData();
        displaySearchResults(results, total_pages, page);
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
            <img src=${
                movie.poster_path !== null
                ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                : '/images/no-image.jpg'
            } alt=${movie.title} />
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
        <a href="tv-details.html?id=${movie.id}">
            <img src=${
                movie.poster_path !== null
                ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                : '/images/no-image.jpg'
            } alt=${movie.title} />
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

const showAlert = (message, type = 'alert-error') => {
    const alert = document.createElement('div');
    alert.classList.add('alert', type);
    alert.appendChild(document.createTextNode(message));
    document.querySelector('#alert').appendChild(alert);

    setTimeout(() => {
        alert.remove();
    }, 3000);
}

const switchMovies = (e) => {
    console.log(e.target);
    if(e.target.getAttribute('id') == 'popular' || e.target.getAttribute('id') == 'top-rated') {
        if(e.target.getAttribute('id') == 'popular') {
            e.target.classList.add('active');
            document.querySelector('#top-rated').classList.remove('active');
            document.querySelector('#popular-movies').style.display = 'grid';
            document.querySelector('#top-rated-movies').style.display = 'none';
        } else {
            e.target.classList.add('active');
            document.querySelector('#popular').classList.remove('active');
            document.querySelector('#popular-movies').style.display = 'none';
            document.querySelector('#top-rated-movies').style.display = 'grid';
        }
    }
}

const switchShows = (e) => {
    console.log(e.target)
    if(e.target.getAttribute('id') == 'pop' || e.target.getAttribute('id') == 'top') {
        if(e.target.getAttribute('id') == 'pop') {
            e.target.classList.add('active');
            document.querySelector('#top').classList.remove('active');
            document.querySelector('#popular-shows').style.display = 'grid';
            document.querySelector('#top-rated-shows').style.display = 'none';
        } else {
            e.target.classList.add('active');
            document.querySelector('#pop').classList.remove('active');
            document.querySelector('#popular-shows').style.display = 'none';
            document.querySelector('#top-rated-shows').style.display = 'grid';
        }
    }
}

// Function to initialize the page
const init = () => { 
    highlightActiveLink();
    addEventListener('DOMContentLoaded', initSwiper);
    switch (state.currentPage) {
        case '/':
            case '/index.html':
            document.querySelector('#top-rated-movies').style.display = 'none';
            document.querySelector('.header-container').addEventListener('click', switchMovies);
            document.getElementById('popular').classList.add('active')
            swipeMovies();
            getPopularMovies();
            getTopRatedMovies();
            break;
            case '/shows.html':
                document.querySelector('#top-rated-shows').style.display = 'none';
            document.querySelector('.shows-header-container').addEventListener('click', switchShows);
            document.getElementById('pop').classList.add('active')
            swipeShows();
            getPopularTVShows();
            getTopRatedShows();
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
            search();
            break;
    }
}

init();