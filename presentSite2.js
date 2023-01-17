let formGetSityName = document.getElementById('search_city');
formGetSityName.addEventListener('submit', getWeather);

let select = document.getElementById('value_metric');    
select.addEventListener('change', changeHandlerSelect);

let unitsLocal = 'units';

select.value = localStorage.getItem(unitsLocal) || 'metric';

let keyAPI = 'd3ee05676227b74a4aed89cdf0de4f9f';

let putInfo = document.getElementById('accordionPanelsStayOpenExample');

 
console.log(select.value);

let units;

let cityLocal = "cityLocal";



function changeHandlerSelect() {
    
    localStorage.setItem(unitsLocal, select.value);
    getWeather()
}

function getWeather(event) {
    
    let cityName = getNameCity(event);

    localStorage.setItem(cityLocal, cityName);

    putCityName(cityName);

    units = select.value;

    let fetchURL = creatWeatherURL(cityName, keyAPI);

    let weatherData = getWeatherInfo (fetchURL);

    
}

function getNameCity(event) {
    if(event) {
        event.preventDefault();
    let inputEl = document.querySelector('.search');
    return inputEl.value;
    } else if (localStorage.getItem('cityLocal')) {
        return localStorage.getItem('cityLocal');
    } else {
        return 'Ivano-Frankivsk'
    }
}


function creatWeatherURL(cityName, keyAPI) {
    
    if (units === 'metric') {
       return `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&units=${units}&appid=${keyAPI}`; 
    } else if (units === 'another') {
        return `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${keyAPI}`;
    }
    
}

async function getWeatherInfo (fetchURL) {
    try {
        let fetchData = await fetch(fetchURL);
        let weatherData = await fetchData.json();
        getDataWeather(weatherData);
        
    }
    catch (ERROR){
        alert(ERROR);
    }
   
}

function getDataWeather(data) {
    let {city, list} = data;
    sortWeatherInfo(list);
}

function  sortWeatherInfo(list) {
    let date = new Date(list[0].dt_txt);
    let hour = date.getHours();
    
    let arr = [];

    for(i = 0; i < list.length; i++) {
        
        if(getHourArr (list, i) === hour) {
            arr.push(list[i]);
        }
    }
    
    formatInfoHTML(arr);
}

function getHourArr (list, i) {
    let day = new Date(list[i].dt_txt);
    let hour = day.getHours();

    return hour;
}

function putCityName(cityName) {
    let divCity = document.querySelector('.city_name');
    divCity.innerHTML = cityName.split('').map((item, index)=> {
        return (index === 0) ? item.toUpperCase() : item
    }).join('');
    
}

function formatInfoHTML(arr) {
   
   function showDate(arr) {
        let arrDate = [];

        function redactMonth(arr) {
            let date = new Date(arr[i].dt_txt);
            let month;
            if (date.getMonth() < 9) {
                return "0" + (Number(date.getMonth()) + 1)
            }
                else if (date.getMonth() === 9) {
                    return 10
                }
                else {
                    return Number(date.getMonth() + 1)
                }

        }
    
    
        for (i = 0; i < arr.length; i++) {
        let date = new Date(arr[i].dt_txt);
            let redactDate = `${date.getDate()}.${redactMonth(arr)}.${date.getFullYear()}`; 
            arrDate.push(redactDate);
        }
            return arrDate;
    
   }
    
   let arrDATE = showDate(arr);
   
    let arrItem = [];

   for(let i = 0; i < arr.length; i++) {

    let template = `
       <div class="accordion-item">
       <h2 class="accordion-header" id="panelsStayOpen-heading${i}">
         <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#panelsStayOpen-collapse${i}" aria-expanded="true" aria-controls="panelsStayOpen-collapse${i}">
           <div class="date">
             ${arrDATE[i]}
           </div>
         </button>
       </h2>
       <div id="panelsStayOpen-collapse${i}" class="accordion-collapse collapse ${(i === 0) ? 'show' : ''}" aria-labelledby="panelsStayOpen-heading${i}">
         <div class="accordion-body">
           <div>
                 <div>
                     Температура:
                 </div>
                 <div>
                     Темп. відчувається як:
                 </div>
                 <div>
                     Темп. мін - макс:
                 </div>
                 <div>
                     Тиск:
                 </div>
                 <div>
                     Вологість:
                 </div>
                 <div>
                     Опади:
                 </div>
                 <div>
                     Швидкість вітру:
                 </div>
           </div>
           <div class="putINFO">
                <div>
                    ${arr[i].main.temp} ${(units === 'metric') ? '<sup>o</sup>C' :'K'}
                </div>
                <div>
                    ${arr[i].main.feels_like} ${(units === 'metric') ? '<sup>o</sup>C' :'K'}
                </div>
                <div>
                    ${arr[i].main.temp_min} - ${arr[i].main.temp_max} ${(units === 'metric') ? '<sup>o</sup>C' :'K'}
                </div>
                <div>
                    ${arr[i].main.pressure}
                </div>
                <div>
                    ${arr[i].main.humidity} %
                </div>
                <div>
                    ${arr[i].weather[0].main} 
                </div>
                <div>
                    ${arr[i].wind.speed} м/c
                </div>
           </div>
         </div>
       </div>
     </div>

    ` 
    arrItem.push(template);
    

   }

   let arrItemJoin = arrItem.join('');

   putInfo.innerHTML = arrItemJoin;
   
}



getWeather();