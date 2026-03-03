// OpenWeatherMap API — Free: 1,000 req/day
// https://openweathermap.org/api

const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;
const BASE_URL = 'https://api.openweathermap.org/data/2.5';
const isDemoMode = () => !API_KEY || API_KEY === 'your_openweather_api_key';

const demoWeather = {
    city: 'Delhi',
    temp: 28,
    feels_like: 31,
    humidity: 55,
    description: 'Partly Cloudy',
    icon: '⛅',
    wind: 12,
    visibility: 8,
    aqi: 'Moderate',
};

const demoForecast = [
    { day: 'Today', high: 32, low: 22, icon: '⛅', desc: 'Partly Cloudy' },
    { day: 'Tue', high: 34, low: 24, icon: '☀️', desc: 'Sunny' },
    { day: 'Wed', high: 30, low: 21, icon: '🌧️', desc: 'Light Rain' },
    { day: 'Thu', high: 28, low: 20, icon: '⛈️', desc: 'Thunderstorm' },
    { day: 'Fri', high: 31, low: 22, icon: '🌤️', desc: 'Mostly Sunny' },
];

const weatherIcons = {
    'Clear': '☀️', 'Clouds': '☁️', 'Rain': '🌧️', 'Drizzle': '🌦️',
    'Thunderstorm': '⛈️', 'Snow': '❄️', 'Mist': '🌫️', 'Haze': '🌫️',
    'Fog': '🌫️', 'Smoke': '💨', 'Dust': '💨',
};

/**
 * Get current weather for a city
 */
export async function getCurrentWeather(city = 'Delhi') {
    if (isDemoMode()) return { ...demoWeather, city };

    try {
        const res = await fetch(
            `${BASE_URL}/weather?q=${encodeURIComponent(city)},IN&units=metric&appid=${API_KEY}`
        );
        if (!res.ok) throw new Error(`Weather: ${res.status}`);
        const data = await res.json();
        return {
            city: data.name,
            temp: Math.round(data.main.temp),
            feels_like: Math.round(data.main.feels_like),
            humidity: data.main.humidity,
            description: data.weather[0].main,
            icon: weatherIcons[data.weather[0].main] || '🌡️',
            wind: Math.round(data.wind.speed * 3.6), // m/s → km/h
            visibility: Math.round((data.visibility || 0) / 1000),
        };
    } catch (error) {
        console.warn('Weather error, using demo:', error.message);
        return { ...demoWeather, city };
    }
}

/**
 * Get 5-day forecast
 */
export async function getForecast(city = 'Delhi') {
    if (isDemoMode()) return demoForecast;

    try {
        const res = await fetch(
            `${BASE_URL}/forecast?q=${encodeURIComponent(city)},IN&units=metric&appid=${API_KEY}`
        );
        if (!res.ok) throw new Error(`Forecast: ${res.status}`);
        const data = await res.json();

        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const grouped = {};

        data.list.forEach(item => {
            const date = new Date(item.dt * 1000);
            const dayKey = date.toDateString();
            if (!grouped[dayKey]) {
                grouped[dayKey] = {
                    day: days[date.getDay()],
                    high: -Infinity,
                    low: Infinity,
                    desc: item.weather[0].main,
                    icon: weatherIcons[item.weather[0].main] || '🌡️',
                };
            }
            grouped[dayKey].high = Math.max(grouped[dayKey].high, Math.round(item.main.temp_max));
            grouped[dayKey].low = Math.min(grouped[dayKey].low, Math.round(item.main.temp_min));
        });

        return Object.values(grouped).slice(0, 5);
    } catch (error) {
        console.warn('Forecast error, using demo:', error.message);
        return demoForecast;
    }
}
