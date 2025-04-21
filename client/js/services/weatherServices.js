export async function getWeather(city) {
    const API_KEY = '948e82f134868ef42733b91fa4750ca3'; // <-- Reemplaza con tu clave
    const endpoint = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric&lang=es`;

    try {
        const response = await fetch(endpoint);
        if (!response.ok) {
            throw new Error(` ${response.status}`);
        }

        const weatherData = await response.json();
        return weatherData;

    } catch (error) {
        console.error('[ERROR] Error getting weather from WeatherAPI. ', error);
    }
}