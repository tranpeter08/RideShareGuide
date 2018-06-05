"use strict";

function showErr(err){
    console.log(err);
}

function renderDateTime(aTime){
    let date = new Date(aTime);
    const months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
    const weekDays = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
    let weekDay = weekDays[date.getDay()];
    let month = months[date.getMonth()];
    let day = date.getDate();
    let year = date.getFullYear();
    let milTime = date.getHours();
    let timePeriod = 'AM';
    let hour;
    if(milTime > 11){
      hour = milTime-12;
      timePeriod = 'PM'
    }
    else{
        hour = milTime;
    }
    if(hour == 0){
      hour==12
    }
    let minute = date.getMinutes();
    minute = (minute <10)? minute + '0': minute;
    return `${weekDay} ${month} ${day}, ${year} @ ${hour}:${minute} ${timePeriod}`
}

function renderEvents(item){
    const {name, dates, _embedded, images, url} = item;
    const {address, city, postalCode, state} = item._embedded.venues[0]
    return `
        <hr>
        <li>
            <h4><a href='${url}' target='_blank'>${name}</a></h4>
            <img src="${images[0].url}" alt="event picture">
            <h5>${_embedded.venues[0].name}</h5>
            <p>Date and time: ${renderDateTime(dates.start.dateTime)}</p>
            <address>${address.line1}, ${city.name}, ${state.stateCode} ${postalCode}</address>
        </li>
    `
}

function noTicketmaster(){
    $('.js-events').html(`
        <div class='js-border js-height-big'>
            <h3>Events</h3>
            <p>No event information found</p>
        </div>
    `)
}

function displayTicketmasterData(results){
    if(results._embedded == undefined){
        noTicketmaster();
    }else{
    $('.js-events').html(`
        <div class='js-border js-height-big'>
            <h3>Events</h3>
            <ul>
                ${results._embedded.events.map((item,index)=> renderEvents(item)).join('')}
            </ul>
        </div>
    `)
    }
}

//get API data from Ticket Master 
function getTicketmasterData(aLocation, callBack){
    const requestURL = 'https://app.ticketmaster.com/discovery/v2/events.json?size=5&apikey=z1yWDATxAuenxouu5ujPMPXc8QyHgyh8'
    const settings = {
        data:{
            keyword: aLocation,
            countryCode:'US'
        },
        type: 'GET',
        async:true,
        dataType: 'json',
        success:callBack
    };
    $.ajax(requestURL, settings)
    .fail(showErr);
}

function renderStockPhoto(featImage){
   return (featImage == "")? 'https://i.imgur.com/63HPxXC.jpg': featImage;
}

function renderRestaurants(item, index){
    const {cuisines, featured_image, location,name, url, user_rating} = item.restaurant;
    if(index <5){
    return `
        <hr>
        <li>
            <h4><a href=${url} target='_blank'>${name}</a></h4>
            <img src="${renderStockPhoto(featured_image)}" alt="Picture of restaurant">
            <p>Cuisine: ${cuisines}</p>
            <p>Customer Rating: ${user_rating.aggregate_rating}/5</p>
            <address>${location.address}</address>
        </li>
    `
    }
}

function displayZomatoData(results){
    console.log(results);
    const {location, popularity, nightlife_index, best_rated_restaurant} = results;
    $('.js-city-info').html(`
        <div class='js-border js-height-small'>
            <h3 class='city-stats-h3'>City stats for ${location.title}, ${location.country_name}</h3>
            <p>Nightlife score: ${nightlife_index}/5</p>
            <p>Popularity score: ${popularity}/5</p>
        </div>
    `);
    $('.js-restaurants').html(`
        <div class='js-border js-height-big'>
            <h3>Restuarants</h3>
            <ul>
                ${best_rated_restaurant.map((item, index) => renderRestaurants(item, index)).join('')}
            </ul>
        <div>
    `)
}

function getZomatoDataDetail(anID,aType,callBack){
    const ZOMATO_KEY = 'abda2f58116a5e1ef63ea8bbb843f6da'
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
    $.ajax(secondRequestURL,settings)
    .fail(showErr);
}

function handleNoZomato(){
    $('.js-city-info').html(`
        <div class='js-border js-height-small'>
            <h3>City info</h3>
            <p>No city info found<p>
        </div>
    `);
    $('.js-restaurants').html(`
    <div class='js-border js-height-big'>
        <h3>Restuarants</h3>
        <p>No restaurant information found<p>
    <div>
    `)
}

function handleInitZomatoData(initResults){
    console.log(initResults);
    if(initResults.location_suggestions.length == 0){ 
        handleNoZomato()
    }
    else{
        const {entity_id, entity_type}= initResults.location_suggestions[0];
        getZomatoDataDetail(entity_id, entity_type, displayZomatoData);
    }
}

//get API data from Zomato 
function getZomatoDataInit(aLocation, callBack){
    const ZOMATO_KEY = 'abda2f58116a5e1ef63ea8bbb843f6da'
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
    $.ajax(initialRequestURL,settings)
    .fail(showErr);
}

function noWeather(){
    $('.js-weather').html(`
        <div class='js-border js-height-small'>
            <h3 class="js-weather-header">Weather</h3>
            <p>No weather information found<p>
        </div>
    `)
}

//get API data from WeatherIO
function displayDataWeather(results){
    console.log(results);
    if(results == undefined){
       noWeather();
    }
    else{
    const {city_name, state_code, country_code, temp, weather} = results.data[0];
    $('.js-weather').html(`
        <div class='js-border js-height-small'>
            <h3 class="js-weather-header">Weather for ${city_name}, ${state_code}, ${country_code}</h3>
            <img src="https://www.weatherbit.io/static/img/icons/${weather.icon}.png" alt="Icon repesention of the current weather" class="js-weather-img">
            <div class="js-weather-p">
                <p>Current Temperature: ${temp}&degF</p>
                <p>Description: ${weather.description}</p>
            </div>
        </div>
    `);
    }
}

//get API data from weather 
function getWeatherData(aCityState,callBack){
    const weatherURL = 'https://api.weatherbit.io/v2.0/current?'
    const query = {
        key:`2a0a26cd2e95437c9cd83e7a8e5d77b8`,
        units: 'I',
        city: aCityState,
        country: 'US'
    };
    $.getJSON(weatherURL, query, callBack);
}

function clearResults(){
    $('.display').empty();
}

function headerButton(){
    $('.header-button').on('click', function(event){
    clearResults();
    })
}

function renderResultHead(aLocation){
    $('.js-results').html(`<h2 class='js-scroll'>Results for "${aLocation.trim()}"</h2>`);
}

//user clicks submit, updates user input
function submitButtonClick(){
    $('#js-form').on('submit', (event)=>{
        event.preventDefault();
        
        clearResults();
        let cityState = $('#city-state').val();
        getWeatherData(cityState, displayDataWeather);
        getZomatoDataInit(cityState,handleInitZomatoData);
        getTicketmasterData(cityState,displayTicketmasterData);
        renderResultHead(cityState);
        $('input').val("");
    })
}

function runThis(){
    submitButtonClick();
    headerButton();
}

$(runThis);