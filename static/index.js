/*
 * Write your client-side JS code in this file.  Make sure to add your name and
 * @oregonstate.edu email address below.
 *
 * Name: Paolo Mota Marques
 * Email: motamarp@oregonstate.edu
 */

/*
 * This function now uses Handlebars to generate HTML representing a single post
 * using the post template, given the description, photo URL, price, city, and condition.
 * The generated HTML is then inserted into the DOM at the end of the <section> element
 * whose id is "posts".
 */
async function insertNewPost(description, photoURL, price, city, condition) {
    const postTemplate = await loadTemplate('templates/post.handlebars');

    // Generates  post HTML using the template
    const postHTML = postTemplate({
        description,
        photoURL,
        price,
        city,
        condition
    });

    // Insert the generated HTML into the DOM
    const postsSection = document.getElementById('posts');
    postsSection.insertAdjacentHTML('beforeend', postHTML);
}

/*
 * This helper function fetches and compiles a Handlebars template from a given path.
 */
async function loadTemplate(templatePath) {
    const response = await fetch(templatePath);
    const templateSource = await response.text();
    return Handlebars.compile(templateSource);
}

/***************************************************************************
 **
 ** The rest of the functions below remain unchanged except for the updated 
 ** call to `insertNewPost()` in relevant places.
 **
 ***************************************************************************/

/*
 * This function checks whether all of the required inputs were supplied by
 * the user and, if so, inserts a new post into the page constructed using
 * these inputs. If the user did not supply a required input, they instead
 * receive an alert, and no new post is inserted.
 */
function handleModalAcceptClick() {
    const description = document.getElementById('post-text-input').value.trim();
    const photoURL = document.getElementById('post-photo-input').value.trim();
    const price = document.getElementById('post-price-input').value.trim();
    const city = document.getElementById('post-city-input').value.trim();
    const condition = document.querySelector('#post-condition-fieldset input:checked').value;

    if (!description || !photoURL || !price || !city || !condition) {
        alert("You must fill in all of the fields!");
    } else {
        allPosts.push({
            description,
            photoURL,
            price,
            city,
            condition
        });
        clearFiltersAndReinsertPosts();
        addCityToAllCities(city);
        hideSellSomethingModal();
    }
}

/*
 * This function parses an existing DOM element representing a single post
 * into an object representing that post and returns that object.
 */
function parsePostElem(postElem) {
    const post = {
        price: postElem.getAttribute('data-price'),
        city: postElem.getAttribute('data-city'),
        condition: postElem.getAttribute('data-condition')
    };

    const postImageElem = postElem.querySelector('.post-image-container img');
    post.photoURL = postImageElem.src;
    post.description = postImageElem.alt;

    return post;
}

/*
 * Wait until the DOM content is loaded, and then hook up UI interactions.
 */
window.addEventListener('DOMContentLoaded', function () {
    /*
     * Remember all of the initial post elements initially displayed in the page.
     */
    const postElems = document.getElementsByClassName('post');
    for (let i = 0; i < postElems.length; i++) {
        allPosts.push(parsePostElem(postElems[i]));
    }

    /*
     * Grab all of the city names already in the filter dropdown.
     */
    const filterCitySelect = document.getElementById('filter-city');
    if (filterCitySelect) {
        const filterCityOptions = filterCitySelect.querySelectorAll('option:not([selected])');
        for (let i = 0; i < filterCityOptions.length; i++) {
            allCities.push(filterCityOptions[i].value.trim().toLowerCase());
        }
    }

    const sellSomethingButton = document.getElementById('sell-something-button');
    if (sellSomethingButton) {
        sellSomethingButton.addEventListener('click', showSellSomethingModal);
    }

    const modalAcceptButton = document.getElementById('modal-accept');
    if (modalAcceptButton) {
        modalAcceptButton.addEventListener('click', handleModalAcceptClick);
    }

    const modalHideButtons = document.getElementsByClassName('modal-hide-button');
    for (let i = 0; i < modalHideButtons.length; i++) {
        modalHideButtons[i].addEventListener('click', hideSellSomethingModal);
    }

    const filterUpdateButton = document.getElementById('filter-update-button');
    if (filterUpdateButton) {
        filterUpdateButton.addEventListener('click', doFilterUpdate);
    }
});
