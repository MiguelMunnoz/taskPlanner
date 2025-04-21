export async function getWeather(city) {
    const apiKey = '948e82f134868ef42733b91fa4750ca3'; // <-- Reemplaza con tu clave
    const endpoint = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric&lang=es`;
    
    try {
        const response = await fetch(endpoint);
        if (!response.ok) {
            throw new Error(`Error al obtener datos del clima: ${response.status}`);
        }

        const weatherData = await response.json();
        return weatherData;

    } catch (error) {
        console.error('[ERROR] No se pudo obtener el clima', error);
        return null;
    }
}