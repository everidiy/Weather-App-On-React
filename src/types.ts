export interface WeatherData {
  coord: {
    lon: number;
    lat: number;
  };
  weather: Array<{
    id: number;
    main: string;
    description: string;
    icon: string;
  }>;
  base: string;
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    humidity: number;
  };
  visibility: number;
  wind: {
    speed: number;
    deg: number;
  };
  clouds: {
    all: number;
  };
  dt: number;
  sys: {
    type: number;
    id: number;
    country: string;
    sunrise: number;
    sunset: number;
  };
  timezone: number;
  id: number;
  name: string;
  cod: number | string;
  message?: string;
}

export type WeatherTheme = 
  | 'clear' 
  | 'clouds' 
  | 'rain' 
  | 'snow' 
  | 'thunderstorm' 
  | 'mist' 
  | '';

export interface SearchProps {
  inputRef: React.RefObject<HTMLInputElement | null>;
  onSearch: () => void;
  weatherTheme: WeatherTheme;
}

export interface TitleProps {
  weatherTheme: WeatherTheme;
}

export interface LoadingProps {
  visible: boolean;
}

export interface InfoProps {
  visible: boolean;
  weatherData: WeatherData | null;
  weatherTheme: WeatherTheme;
}

export interface ErrorProps {
  visible: boolean;
}