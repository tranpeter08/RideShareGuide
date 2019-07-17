"use strict";

function showErr(err){
    console.error(err);
}

function renderDateTime(aTime){
    if(aTime === undefined){
        return `Unavialable`
    }else{
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
            hour === 12
        }
        let minute = date.getMinutes();
        minute = (minute <10)? minute + '0': minute;
        return `${weekDay} ${month} ${day}, ${year} @ ${hour}:${minute} ${timePeriod}`
    }
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
            <p>When: ${renderDateTime(dates.start.dateTime)}</p>
            <address>${address.line1}, ${city.name}, ${state.stateCode} ${postalCode}</address>
        </li>
    `
}

function noTicketmaster(){
    $('.js-events').hide().html(`
        <div class='js-border js-event-results'>
            <h3>Events</h3>
            <p>No event information found</p>
        </div>
    `).delay(500).fadeIn('slow')
}

function displayTicketmasterData(results){
    if(results._embedded === undefined){
        noTicketmaster();
    }else{
    $('.js-events').hide().html(`
        <div class='js-border'>
            <h3>Events</h3>
            <ul>
                ${results._embedded.events.map((item,index)=> renderEvents(item)).join('')}
            </ul>
        </div>
    `).delay(500).fadeIn('slow');
    }
}

function getTicketmasterData(aLocation, callBack){
    const requestURL = 'https://app.ticketmaster.com/discovery/v2/events.json?size=5&apikey=z1yWDATxAuenxouu5ujPMPXc8QyHgyh8'
    const settings = {
        data:{
            keyword:aLocation,
            countryCode:'US',
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
   return (featImage === "")? 'https://i.imgur.com/63HPxXC.jpg': featImage;
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
    `}
}

function displayZomatoData(results){
    const {location, popularity, nightlife_index, best_rated_restaurant} = results;
    $('.js-restaurants').hide().html(`
        <div class='js-border js-height-big'>
            <h3>Restuarants</h3>
            <ul>
                ${best_rated_restaurant.map((item, index) => renderRestaurants(item, index)).join('')}
            </ul>
        <div>
    `).delay(500).fadeIn('slow');
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
    $('.js-restaurants').hide().html(`
    <div class='js-border'>
        <h3>Restuarants</h3>
        <p>No restaurant information found<p>
    <div>
    `).delay(500).fadeIn('slow');
}

function handleInitZomatoData(initResults){
    if(initResults.location_suggestions[0].country_name === 'United States'){
        if(initResults.location_suggestions.length === 0){ 
            handleNoZomato()
        }
        else{
            const {entity_id, entity_type}= initResults.location_suggestions[0];
            getZomatoDataDetail(entity_id, entity_type, displayZomatoData);
        }
    }
}

function getZomatoDataInit(aLocation,aLat,aLon, callBack){
    const ZOMATO_KEY = 'abda2f58116a5e1ef63ea8bbb843f6da'
    const initialRequestURL = 'https://developers.zomato.com/api/v2.1/locations?'
    const settings = {
        data:{
            query: aLocation,
            lat: aLat,
            lon: aLon
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
    $('.js-weather').hide().html(`
        <div class='js-border js-weather-box'>
            <h3 class="js-weather-header">Weather</h3>
            <p>No weather information found<p>
        </div>
    `).delay(500).fadeIn('slow')
}

function extractForTicketMaster(results){
    const {city_name,state_code} = results.data[0];
    getTicketmasterData(`${city_name}, ${state_code}`,displayTicketmasterData);
}

function displayDataWeather(results){
    if(results === undefined){
       noWeather();
    }
    else{
    const {city_name, state_code, country_code, temp, weather} = results.data[0];
    $('.js-weather').hide().html(`
        <div class='js-border js-weather-box'>
            <h3 class="js-weather-header">Weather for ${city_name}, ${state_code}, ${country_code}</h3>
            <img src="https://www.weatherbit.io/static/img/icons/${weather.icon}.png" alt="Icon repesention of the current weather" class="js-weather-img">
            <div class="js-weather-p">
                <p>Current Temperature: ${temp}&degF</p>
                <p>Description: ${weather.description}</p>
            </div>
        </div>
    `).fadeIn('slow');
    }
    extractForTicketMaster(results);
}

function notInUS(){
    $('.js-results').append(`
        <div class = 'row'>
            <div class = 'col-12'>
                <div class='js-not-US-box'>
                    <p class='js-not-US'>Please enter a valid US city and state.</p>
                <div>
            <div>
        </div>    
    `)
}

function handleWeatherData(results){
    return (results.data[0].country_code !== 'US') ? notInUS() : displayDataWeather(results);
}

function getWeatherData(aLat, aLon,callBack){
    const weatherURL = 'https://api.weatherbit.io/v2.0/current?'
    const query = {
        key:`2a0a26cd2e95437c9cd83e7a8e5d77b8`,
        units: 'I',
        lat: aLat,
        lon: aLon
    };
    $.getJSON(weatherURL, query, callBack)
    .fail(showErr);
}

function handleGeoCodeData(data){
    if(data.results.length === 0){
        notInUS();
    }else{
        const {lat,lng} = data.results[0].geometry.location;
        getWeatherData(lat,lng,handleWeatherData);
        getZomatoDataInit('', lat, lng, handleInitZomatoData);
    }
}

function getGeocodeAPI(cityState,callBack) {
    const query = {address: cityState}
    $.getJSON('/geocode', query, callBack);
}

function clearResults(){
    $('.display').empty();
}

function headerButtonClick(){
    $('.header-button').on('click', function(event){
        clearResults();
        $('.form-container').fadeIn('slow');
    })
}

function renderResultHead(aLocation){
    $('.js-results').hide().html(`<h2>Results ${aLocation.trim()}</h2>`).delay(500).fadeIn(1000);
}

function resetButtonClick(){
    $('.js-reset').on('click','.js-reset-button',()=>{
        clearResults();
        $('.form-container').fadeIn('slow');
    })
}

function renderResetButton(){
    $('.js-reset').hide().html(`
        <button class="js-reset-button">Start New Search</button>
    `).delay(3500).fadeIn('slow');
}

function handlePosition(position){
    let lat = position.coords.latitude;
    let lon = position.coords.longitude;
    getWeatherData(lat, lon, handleWeatherData);
    getZomatoDataInit('',lat,lon,handleInitZomatoData);
}

function geoButtonClick(){
    $('.geo-button').on('click', ()=>{
        clearResults();
        renderResultHead('near you...');
        navigator.geolocation.getCurrentPosition(handlePosition);
        $('.form-container').fadeOut('slow');
        renderResetButton();
    })
}

function submitButtonClick(){
    $('#js-form').on('submit', (event)=>{
        event.preventDefault();
        clearResults();
        let cityState = $('#city-state').val();
        getGeocodeAPI(cityState, handleGeoCodeData);
        renderResultHead(`for "${cityState}"`);
        $('input').val("");
        $('.form-container').fadeOut(500);
        renderResetButton();
    })
}

function docReady(){
    submitButtonClick();
    headerButtonClick();
    geoButtonClick();
    resetButtonClick();
}

$(docReady);