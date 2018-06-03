"use strict";

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
    if(hour === 0){
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
        <ul>
            <li>
                <h4><a href='${url}' target='_blank'>${name}</a></h4>
                <img src="${images[0].url}" alt="event picture">
                <h5>${_embedded.venues[0].name}</h5>
                <p>Date and time: ${renderDateTime(dates.start.dateTime)}</p>
                <address>${address.line1}, ${city.name}, ${state.stateCode} ${postalCode}</address>
            </li>
        </ul>
    `
}

function noTicketmaster(){
    $('.js-events').html(`
        <div class='js-border'>
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
        <div class='js-border'>
            <h3>Events</h3>
            ${results._embedded.events.map((item,index)=> renderEvents(item)).join('')}
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
            countryCode: 'US',
        },
        type: 'GET',
        async:true,
        dataType: 'json',
        success:callBack
    };
    $.ajax(requestURL, settings);
}

function renderStockPhoto(featImage){
   return (featImage == "")? 'https://cdn.pixabay.com/photo/2015/03/26/10/28/restaurant-691397_1280.jpg': featImage;
}

function renderRestaurants(item, index){
    const {cuisines, featured_image, location,name, url, user_rating} = item.restaurant;
    if(index <5){
    return `
        <ul>
            <li>
                <h4><a href=${url} target='_blank'>${name}</a></h4>
                <img src="${renderStockPhoto(featured_image)}" alt="Picture of restaurant">
                <p>Cuisine: ${cuisines}</p>
                <p>Customer Rating: ${user_rating.aggregate_rating}</p>
                <address>${location.address}</address>
            </li>
        </ul>
    `
    }
}

function displayZomatoData(results){
    const {location, popularity, nightlife_index, best_rated_restaurant} = results;
    $('.js-city-info').html(`
        <div class='js-border'>
            <h3>City stats for ${location.title}</h3>
            <p>Nightlife score of: ${nightlife_index}</p>
            <p>Popularity score: ${popularity}</p>
        </div>
    `);
    $('.js-restaurants').html(`
        <div class='js-border'>
            <h3>Restuarants</h3>
            ${best_rated_restaurant.map((item, index) => renderRestaurants(item, index)).join('')}
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
    $.ajax(secondRequestURL,settings);
}

function handleNoZomato(){
    $('.js-city-info').html(`
        <div class='js-border'>
            <h3>City info</h3>
            <p>No city info found<p>
        </div>
    `);
    $('.js-restaurants').html(`
    <div class='js-border'>
        <h3>Restuarants</h3>
        <p>No restaurant information found<p>
    <div>
    `)
}

function handleInitZomatoData(initResults){
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
    $.ajax(initialRequestURL,settings);
}

function noWeather(){
    $('.js-weather').html(`
        <div class='js-border'>
            <h3 class="js-weather-header">Weather</h3>
            <p>No weather information found<p>
        </div>
    `)
}

//get API data from WeatherIO
function displayDataWeather(results){
    if(results == undefined){
       noWeather();
    }
    else{
    const {city_name, state_code, temp, weather} = results.data[0];
    $('.js-weather').html(`
        <div class='js-border'>
            <h3 class="js-weather-header">Weather for ${city_name}, ${state_code}</h3>
            <img src="https://www.weatherbit.io/static/img/icons/${weather.icon}.png" alt="Icon repesention of the current weather" class="js-weather-img">
            <div class="js-weather-p">
                <p>Current Temperature: ${temp}</p>
                
                <p>Description: ${weather.description}</p>
            </div>
        </div>
    `)
    }
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

function clearResults(){
    $('.dislpay').empty();
}

function renderResultHead(aCity, aState){
    $('.js-results').html(`<h2 class=''>Results for "${aCity} ${aState}"</h2>`);
}

//user clicks submit, updates user input
function submitButtonClick(){
    $('#js-form').on('submit', (event)=>{
        event.preventDefault();
        let city = $('#city').val();
        let state = $('#state').val();
        let location = `${city} ${state}`;
        console.log(location);
        clearResults();
        getWeatherData(city, state, displayDataWeather);
        getZomatoDataInit(location,handleInitZomatoData);
        getTicketmasterData(location,displayTicketmasterData);
        renderResultHead(city,state);
        $('#city').val("");
        $('#state').val("");
    })
}

function runThis(){
    submitButtonClick()
}

$(runThis)