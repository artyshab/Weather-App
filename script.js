const apiKey = "f3162fe220fc9998ac4894343b8ef554";

const weatherForecast = document.querySelector(".weather-forecast");
const searchButton = document.getElementById("search-button");
const searchInput = document.getElementById("search-input");
const locationElement = document.getElementById("location");
const temperatureElement = document.getElementById("temperature");
const descriptionElement = document.getElementById("description");
const iconElement = document.getElementById("icon");
const feelsLikeElement = document.getElementById("feelslike");
const humidityElement = document.getElementById("humidity");
const timeElement = document.getElementById("time");
const weatherTimesElement = document.querySelector(".weather-times");


searchButton.addEventListener("click", () => {
  const city = searchInput.value;
  const apiEndpoint = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;

  const weatherContainer = document.querySelector(".weather-container");

  weatherContainer.classList.add("move");

  axios
    .get(apiEndpoint)
    .then((response) => {
      const data = response.data;
      const weatherInfo = data.list[0].weather[0].main;
      const iconCode = data.list[0].weather[0].icon;
      
      showForecast(data);

      const mainContainer = document.querySelectorAll(".weather-info"); // You have to use queryselectorAll if you have nodelist    

      locationElement.textContent = data.city.name;
      temperatureElement.textContent = `Temperature: ${data.list[0].main.temp} °C`;
      descriptionElement.textContent = data.list[0].weather[0].description;
      feelsLikeElement.textContent = `Feels Like: ${data.list[0].main.feels_like} °C`;


      const localTime = new Date(
        data.list[0].dt * 1000 + data.city.timezone * 1000
      );
      timeElement.textContent = localTime.toLocaleString();

      switch (weatherInfo.toLowerCase()) {
        case "clear":
          iconElement.src = "./assets/sunny-svgrepo-com.svg";
          break;
        case "clouds":
          iconElement.src = "./assets/cloudy-svgrepo-com.svg";
          break;
        case "drizzle":
          iconElement.src = "./assets/rain-svgrepo-com.svg";
          break;
        case "snow":
          iconElement.src = "./assets/snowflake-flakes-svgrepo-com.svg";
          break;
        default:
          iconElement.src = `https://openweathermap.org/img/wn/${iconCode}.png`;
          break;
      }

      const showMore = document.querySelector(".show-more-btn");
        showMore.addEventListener("click", translateXByAmount(-100 , -750));

      const showLess = document.querySelector(".show-less-btn");
      showLess.addEventListener("click" , translateXByAmount(100 , 500));  
      

    })
    .catch((error) => {
      console.log(error);
      alert("Error fetching weather data");
    });
});




function showForecast(data) {

  let forecastElement = "";
  const showBtn = document.querySelector(".show-more-btn");
  const days = document.getElementById("days");

  daysNum = days.value;

  
    if(daysNum <= 16) {
      for (let i = 0; i < daysNum; i++) {
        const currentTime = new Date(data.list[i].dt * 1000 + data.city.timezone * 1000);
        const formattedTime = currentTime.toLocaleString(); // date to a readable string 
        const currentWeather = data.list[i].main.temp;
        const weatherImage = `http://openweathermap.org/img/wn/${data.list[i].weather[0].icon}.png`;
    
    
          forecastElement += `
          <div class="time">
              <p>${formattedTime}</p>
              <img src="${weatherImage}" alt="Weather Icon"/>
              <p>${currentWeather}°C</p>
          </div>
      `;
  
      document.querySelector(".weather-times").innerHTML = forecastElement;      
      
      iconElement.style.display = "block";
      weatherForecast.style.display = "block";

       if(daysNum <= 8) {
        weatherForecast.style.width = "auto";
        showBtn.style.visibility = "hidden";
      }
      
      else {
          weatherForecast.style.width = "800px"
          showBtn.style.visibility = "visible";
      }
      
    }

    }
    else {
      alert("Number of days should be no more than 16 days");
    }

  const forecastElements = document.querySelectorAll('.time');
  forecastElements.forEach((el, index) => {
      setTimeout(() => {
          el.classList.add('show');
      }, index * 100); // Stagger the animations
  });

}

let totalTranslation = 0; // should be outside the function to maintain state between clicks

function translateXByAmount(amount , maxTranslation) {
  return function() {
    if (totalTranslation + amount >= maxTranslation) {
        totalTranslation += amount;
        weatherTimesElement.style.transform = `translateX(${totalTranslation}px)`;
    } else {
        totalTranslation = 0;
        weatherTimesElement.style.transform = `translateX(${totalTranslation}px)`;
    }
}

}
