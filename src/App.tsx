import React, { useRef, useState, useEffect } from 'react';
import { WeatherData, WeatherTheme, SearchProps, TitleProps, LoadingProps, InfoProps, ErrorProps } from './types';

const API = '9e59e6d820dd438af0f4fb7386b27b5a';
const URLaddress = 'https://api.openweathermap.org/data/2.5/weather';

async function fetchWeather(city: string): Promise<WeatherData> {
  const response = await fetch(`${URLaddress}?q=${city}&appid=${API}&units=metric`);

  if (!response.ok) {
    throw new Error("City not found :(");
  }

  const data: WeatherData = await response.json();

  if (data.cod && data.cod !== 200 && data.cod !== "200") {
    throw new Error(data.message || 'City not found :(');
  }

  return data;
}

const Container: React.FC = () => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const [weatherTheme, setWeatherTheme] = useState<WeatherTheme>('');

  useEffect(() => {
    if (weatherTheme) {
      document.body.className = `body-${weatherTheme}`;
    } else {
      document.body.className = '';
    }
  }, [weatherTheme]);

  const getWeatherThemeClass = (weatherType: string): WeatherTheme => {
    const themes = {
      'Clear': { class: 'clear' as WeatherTheme, types: ['Clear'] },
      'Rain': { class: 'rain' as WeatherTheme, types: ['Rain', 'Drizzle'] },
      'Snow': { class: 'snow' as WeatherTheme, types: ['Snow'] },
      'Clouds': { class: 'clouds' as WeatherTheme, types: ['Clouds'] },
      'Mist': { class: 'mist' as WeatherTheme, types: ['Mist', 'Haze', 'Fog'] },
      'Thunderstorm': { class: 'thunderstorm' as WeatherTheme, types: ['Thunderstorm'] }
    };

    const theme = Object.entries(themes).find(([_, config]) =>
      config.types.includes(weatherType)
    );

    return theme ? theme[1].class : '';
  };

  const handleSearch = async (): Promise<void> => {
    const city = inputRef.current?.value;

    if (!city) return;

    setLoading(true);
    setError(false);
    setWeatherData(null);

    try {
      const data = await fetchWeather(city);
      setWeatherData(data);
      setWeatherTheme(getWeatherThemeClass(data.weather[0].main));
      if (inputRef.current) {
        inputRef.current.value = '';
      }
    } catch (error) {
      setLoading(false);
      setError(true);
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.value = 'Novosibirsk';
    }
    handleSearch();
  }, []);

  return (
    <div className='container'>
      <Title weatherTheme={weatherTheme} />
      <Search inputRef={inputRef} onSearch={handleSearch} weatherTheme={weatherTheme} />
      <Loading visible={loading} />
      <Info visible={!!weatherData} weatherData={weatherData} weatherTheme={weatherTheme} />
      <Error visible={error} />
    </div>
  );
};

const Title: React.FC<TitleProps> = ({ weatherTheme }) => {
  return (
    <h1 className={`${weatherTheme ? `h1-${weatherTheme}` : ''}`}>
      Weather App
    </h1>
  );
};

const Search: React.FC<SearchProps> = ({ inputRef, onSearch, weatherTheme }) => {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'Enter') {
      onSearch();
    }
  };

  return (
    <div className="search-box">
      <input 
        ref={inputRef}
        type="text" 
        id="city-input" 
        placeholder="Enter the city..."
        onKeyDown={handleKeyDown}
      />
      <button 
        id="search-btn" 
        onClick={onSearch}
        className={weatherTheme ? `button-${weatherTheme}` : ''}
      >
        Search
      </button>
    </div>
  );
};

const Loading: React.FC<LoadingProps> = ({ visible }) => {
  return (
    <div 
      className="loading" 
      style={{ display: visible ? 'block' : 'none' }}
    >
      Loading...
    </div>
  );
};

const Info: React.FC<InfoProps> = ({ visible, weatherData, weatherTheme }) => {
  const getWeatherIconURL = (iconCode: string): string | undefined => {
    if (!iconCode) {
      return undefined
    };
    return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
  };

  if (!weatherData) {
    return (
      <div 
        className={`weather-card ${weatherTheme ? `weather-${weatherTheme}` : ''}`}
        style={{ display: visible ? 'block' : 'none' }}
      >
        <div className="country">Country</div>
        <div className="city">City</div>
        <div className="temperature">0°C</div>
        <div className="weather-description description">Description</div>
        <div className="icon-weather">
          <img id="weather-icon" src={undefined} alt="Weather" />
        </div>
        <div className="details">
          <div className="detail">
            <span>Humidity:</span>
            <span id="humidity">0%</span>
          </div>
          <div className="detail">
            <span>Wind-speed:</span>
            <span id="wind">0 m/s</span>
          </div>
          <div className="detail">
            <span>Feels Like:</span>
            <span id="feelsLike">0°C</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className={`weather-card ${weatherTheme ? `weather-${weatherTheme}` : ''}`}
      style={{ display: visible ? 'block' : 'none' }}
    >
      <div className="country">{weatherData.sys.country}</div>
      <div className="city">{weatherData.name}</div>
      <div className="temperature">{Math.round(weatherData.main.temp)}°C</div>
      <div className="weather-description description">{weatherData.weather[0].description}</div>
      <div className="icon-weather">
        <img 
          id="weather-icon" 
          src={getWeatherIconURL(weatherData.weather[0].icon)} 
          alt="Weather" 
        />
      </div>
      <div className="details">
        <div className="detail">
          <span>Humidity:</span>
          <span id="humidity">{weatherData.main.humidity}%</span>
        </div>
        <div className="detail">
          <span>Wind-speed:</span>
          <span id="wind">{weatherData.wind.speed} m/s</span>
        </div>
        <div className="detail">
          <span>Feels Like:</span>
          <span id="feelsLike">{Math.round(weatherData.main.feels_like)}°C</span>
        </div>
      </div>
    </div>
  );
};

const Error: React.FC<ErrorProps> = ({ visible }) => {
  return (
    <div 
      className="error-message" 
      style={{ display: visible ? 'block' : 'none' }}
    >
      City not found. Check the name and try again!
    </div>
  );
};

const App: React.FC = () => {
  return <Container />;
};

export default App;