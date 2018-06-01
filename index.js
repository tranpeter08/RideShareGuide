const ZOMATO_KEY = 'abda2f58116a5e1ef63ea8bbb843f6da'


function displayTicketmasterData(results){
    console.log(results);

}

//get API data from Ticket Master 
function getTicketmasterData(aLocation, callBack){
    const requestURL = 'https://app.ticketmaster.com/discovery/v2/events.json?size=5&apikey=z1yWDATxAuenxouu5ujPMPXc8QyHgyh8'
    const settings = {
        data:{
            keyword: aLocation,
            countryCode: 'US',
            sort: 'date,asc',
            size: 5
        },
        type: 'GET',
        async:true,
        dataType: 'json',
        success:callBack
        
    };
    $.ajax(requestURL, settings);
}

function renderHTMLRestaurants(item){
    const {cuisines, featured_image, location,name, url, user_rating} = item.restaurant;
    return `
        <ul>
            <li>
                <h4><a href=${url} target='_blank'>${name}</a></h4>
                <img src="${featured_image}" alt="Picture of restaurant">
                <p>Cuisine: ${cuisines}</p>
                <p>Customer Rating: ${user_rating.aggregate_rating}</p>
                <address>${location.address}</address>
            </li>
        </ul>
    `
}

function displayZomatoData(results){
    const {location, popularity, nightlife_index, best_rated_restaurant} = results;
    $('.js-city-info').html(`
        <div>
            <h3>City stats for: ${location.title}</h3>
            <p>Nightlife score of: ${nightlife_index}</p>
            <p>Popularity score: ${popularity}</p>
        </div>
    `);
    $('.js-restaurants').html(`
        <div>
            <h3>Restuarants</h3>
            ${best_rated_restaurant.map((item, index) => renderHTMLRestaurants(item)).join('')}
        <div>
        `)
}

function getZomatoDataDetail(anID,aType,callBack){
    const secondRequestURL = 'https://developers.zomato.com/api/v2.1/location_details?'
    const settings = {
        data: {
            entity_id: anID,
            entity_type: aType
        },
        headers:{
            'Accept': 'application/json',
            'user-key': ZOMATO_KEY
        },
        dataType: 'json',
        type:'GET',
        success: callBack
    };
    $.ajax(secondRequestURL,settings);
}

function handleInitZomatoData(initResults){
    const {entity_id, entity_type}= initResults.location_suggestions[0];
    getZomatoDataDetail(entity_id, entity_type, displayZomatoData);
}

//get API data from Zomato 
function getZomatoDataInit(aLocation, callBack){
    const initialRequestURL = 'https://developers.zomato.com/api/v2.1/locations?'
    const settings = {
        data:{
            query: aLocation
        },
        headers:{
            'Accept': 'application/json',
            'user-key': ZOMATO_KEY
        },
        dataType: 'json',
        type: 'GET',
        success: callBack,
    };
    $.ajax(initialRequestURL,settings);
}

function displayDataWeather(results){
    const {temp, weather} = results.data[0];
    $('.js-weather').html(`
        <div>
            <h3 class="js-weather-header">Weather</h3>
            <img src="#" alt="Icon repesention of the current weather">
            <p>Current Temperature: ${temp}</p>
            <p>Description: ${weather.description}</p>
        </div>
    `)
}

//get API data from weather 
function getWeatherData(aCity,aState,callBack){
    const weatherURL = 'https://api.weatherbit.io/v2.0/current?'
    const query = {
        key:`2a0a26cd2e95437c9cd83e7a8e5d77b8`,
        units: 'I',
        city: aCity,
        state: aState,
        country: 'US'
    };
    $.getJSON(weatherURL, query, callBack);
}

//user clicks submit, updates user input
function submitButtonClick(){
    $('#js-form').on('submit', (event)=>{
        event.preventDefault();
        let city = $('#city').val();
        let state = $('#state').val();
        let location = `${city} ${state}`
        getWeatherData(city, state, displayDataWeather);
        getZomatoDataInit(location,handleInitZomatoData);
        getTicketmasterData(location,displayTicketmasterData);
        $('#city').val("");
        $('#state').val("");
    })
}

function runThis(){
    submitButtonClick()
}

$(runThis)