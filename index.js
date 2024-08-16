const searchBar = document.getElementById('search-bar');
const searchButton = document.getElementById('search-btn');
const dogImagesContainer = document.getElementById('dog-images');
const prevButton = document.getElementById('prev-page');
const nextButton = document.getElementById('next-page');
const currentPageElement = document.getElementById('current-page');

let currentPage = 1;
const itemsPerPage = 3;

const apiKey = 'live_Y6t0wAUhA6eCMqXAD4OhANw18xkzoSpDpfpyrBSzXtByIIQwq4GupKoNtcXX5FeX';
const baseUrl = 'https://api.thedogapi.com/v1';

// Function to fetch and display dog images based on the search term
async function searchDogs(searchTerm) {
    console.log(searchTerm);
    
    // Fetch breeds based on search term
    const breedSearchUrl = `${baseUrl}/breeds/search?q=${searchTerm}`;
    const response = await fetch(breedSearchUrl, {
        headers: {
            'x-api-key': apiKey
        }
    });

    if (!response.ok) {
        console.error('Error fetching breeds:', response.statusText);
        return;
    }

    const breeds = await response.json();
    let dogData = [];

    for (const breed of breeds) {
        const breedId = breed.id;
        const searchUrl = `${baseUrl}/images/search?breed_ids=${breedId}`;

        try {
            const imageResponse = await fetch(searchUrl, {
                headers: {
                    'x-api-key': apiKey
                }
            });

            if (!imageResponse.ok) {
                console.error('Error fetching images for breed:', imageResponse.statusText);
                continue;
            }

            const dogImages = await imageResponse.json();
            dogData = dogData.concat(dogImages);
        } catch (error) {
            console.error('Error fetching images for breed', breed.name, error);
        }
    }

    // Update display and pagination
    displayDogs(dogData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage));
}

// Function to display dogs on the page
function displayDogs(data) {
    dogImagesContainer.innerHTML = '';
    data.forEach(dog => {
        const image = document.createElement('img');
        image.src = dog.url;
        dogImagesContainer.appendChild(image);
    });

    updatePaginationButtons(data.length);
}

// Function to update pagination buttons
function updatePaginationButtons(dataLength) {
    prevButton.disabled = currentPage === 1;
    nextButton.disabled = currentPage >= Math.ceil(dataLength / itemsPerPage);
    currentPageElement.textContent = `Page ${currentPage}`;
}

// Event listeners for search, previous, and next buttons
searchButton.addEventListener('click', () => {
    currentPage = 1;
    searchDogs(searchBar.value);
});

prevButton.addEventListener('click', () => {
    if (currentPage > 1) {
        currentPage--;
        searchDogs(searchBar.value);
    }
});

nextButton.addEventListener('click', () => {
    currentPage++;
    searchDogs(searchBar.value);
});


