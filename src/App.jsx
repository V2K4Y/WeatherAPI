import { useState } from 'react';
import axios from 'axios';

function App() {
  const [city, setCity] = useState("");
  const [data, setData] = useState("");
  const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=b79e7ea065d961e7e1de62d13ef0a62f`;
  
  const fetchData = (event) => {
    if(event.key === 'Enter') {
      axios.get(url).then((response) => {
        setData(response.data);
      })
      setCity("");
    }
  }

  return (
    <>
      <div className="container">
        <div className="left">
          <div className="top">
            <input 
              value = {city}
              onChange = {e => {setCity(e.target.value)}}
              onKeyPress={fetchData}
              placeholder='Enter Location'
            />
          </div>
          {data.list ? <div className="bottom">
            <div><h1>{data.list ? data.list[0].main.temp.toFixed() : null}<sup>°C</sup></h1>
              <img src={`https://openweathermap.org/img/w/${data.list ? data.list[0].weather[0].icon : null}.png`} alt="Weather Icon"/>
            </div>
            <h2>{data.city ? data.city.name: null}, {data.city ? data.city.country : null}</h2>
            <p>
              {data.list ? (new Date(data.list[0].dt * 1000)).toLocaleString('en-US', { weekday: 'short', hour: 'numeric', minute: 'numeric', hour12: true }) : null} | H:
              {data.city ? data.city.coord.lat : null}<sup>°</sup> L:{data.city ? data.city.coord.lon:null}<sup>°</sup>
            </p>
          </div> : null}
        </div>
        {data.list ? <div className="right">
          <div className="top">
            <div className="rttop">
              <p>
                Sunrise: {(new Date((data.city ? data.city.sunrise : null)* 1000)).toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })}
              </p>
              <p>
                Sunset: {(new Date((data.city ? data.city.sunset : null)* 1000)).toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })}
              </p>
            </div>
            <div className="rtbottom">
            {data.list ? data.list.map((item, index) => {
              if(index < 7){
                console.log(item.main.temp)
                return <span key={index}><p>{(new Date(item.dt * 1000)).getDate()}</p><img src={`https://openweathermap.org/img/w/${item.weather[0].icon}.png`} alt="Weather Icon"/><p>{item.main.temp.toFixed()}°C</p></span>
              }
            }): null}
            </div>
          </div>
          <div className="bottom">
            <div className="rbtop">5 - day forecast.</div>
            <div className="rbbottom">
              {data.list ? Object.values(data.list.reduce((acc, item) => {
                const date = new Date(item.dt * 1000);
                const day = date.toLocaleDateString('en-US', { weekday: 'short' });

                if (!acc[day]) {
                  acc[day] = {
                    minTemp: item.main.temp_min,
                    maxTemp: item.main.temp_max,
                    icon: item.weather[0].icon,
                    day: day
                  };
                } else {
                  if (item.main.temp_min < acc[day].minTemp) {
                    acc[day].minTemp = item.main.temp_min;
                  }
                  if (item.main.temp_max > acc[day].maxTemp) {
                    acc[day].maxTemp = item.main.temp_max;
                  }
                }

                return acc;
              }, {})).map((item, index) => (
                <span key={index}>
                  <p>{item.day}</p>
                  <img src={`https://openweathermap.org/img/w/${item.icon}.png`} alt="Weather Icon" />
                  <p>{item.minTemp.toFixed()}°C</p>
                  <p>{item.maxTemp.toFixed()}°C</p>
                </span>
              )) : null}
            </div>
          </div>
        </div> : null}
      </div>
    </>
  )
}

export default App
