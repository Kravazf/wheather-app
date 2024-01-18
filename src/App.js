import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [data, setData] = useState({});
  const [town, setTown] = useState('');
  const [error, setError] = useState(null);

  const key = '9c888962be3d509cf82836ac1a47e638';
  const defaultCity = 'Kyiv';
  const defaultUrl = `https://api.openweathermap.org/data/2.5/weather?q=${defaultCity}&units=metric&appid=${key}`;

  const encodedTown = encodeURIComponent(town.trim());
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodedTown}&units=metric&appid=${key}`;

  const searchWeather = (event) => {
    if ((event.type === 'keydown' && event.key === 'Enter') || event.type === 'click') {
      if (town.trim() !== '') {
        axios
          .get(url)
          .then((response) => {
            setData(response.data);
            setError(null);
          })
          .catch((error) => {
            if (error.response) {
              if (error.response.status === 404) {
                setError('Sorry, the city does not exist. Please enter a valid city name.');
              } else {
                setError('An error occurred. Please try again later.');
              }
            } else {
              setError('An error occurred. Please try again later.');
            }
          });
        setTown('');
      }
    }
  };

  useEffect(() => {
    axios
      .get(defaultUrl)
      .then((response) => {
        setData(response.data);
      })
      .catch((error) => {
        console.error('Error fetching default weather:', error);
      });
  }, [defaultUrl]);

  return (
    <div className="app">
      <div className="header">
        <h1>Weather forecast</h1>
      </div>
      <div className="inp-field">
        <input
          type="text"
          onChange={(event) => setTown(event.target.value)}
          placeholder="Enter the city"
          onKeyDown={searchWeather}
        />
        <button className="go" onClick={searchWeather}>
          Go
        </button>
      </div>
      {error ? (
        <p className="error-message">{error}</p>
      ) : (
        <div className="container">
          <div className="header">
            <div className="city">
              <p>{data.name}</p>
            </div>
          </div>
          <div className="temp">
            {data.main ? (
              <h2>
                {`${data.main.temp.toFixed()} `}
                °C
              </h2>
            ) : null}
          </div>
          <div className="desc">
            {data.weather ? <p>{data.weather[0].main}</p> : null}
          </div>
          <div>
            {data.name !== undefined && (
              <div className="footer">
                <div className="feels">
                  {data.main ? (
                    <p className="bold">
                      {`${data.main.feels_like.toFixed()} `}
                      °C
                    </p>
                  ) : null}
                  <p>Feels like</p>
                </div>
                <div className="humidity">
                  {data.main ? (
                    <p className="bold">
                      {`${data.main.humidity} `}
                      %
                    </p>
                  ) : null}
                  <p>Humidity</p>
                </div>
                <div className="wind">
                  {data.wind ? (
                    <p className="bold">
                      {`${data.wind.speed} `}
                      M/S
                    </p>
                  ) : null}
                  <p>Wind speed</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;