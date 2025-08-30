// API functionality for fetching external data
class APIManager {
    constructor() {
        this.quoteContainer = document.getElementById('quote-container');
        this.weatherContainer = document.getElementById('weather-container');
        this.factContainer = document.getElementById('fact-container');
        this.cityInput = document.getElementById('city-input');
        
        this.init();
    }
    
    init() {
        // Load initial data
        this.fetchQuote();
        this.fetchRandomFact();
        
        // Add enter key support for weather search
        this.cityInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.searchWeather();
            }
        });
    }
    
    async fetchQuote() {
        try {
            this.showLoading(this.quoteContainer);
            
            const response = await fetch('https://api.quotable.io/random?minLength=50&maxLength=150');
            
            if (!response.ok) {
                console.warn('Quote API returned non-ok response, using fallback');
                // Use fallback quotes instead of throwing error
                const fallbackQuotes = [
                    { content: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
                    { content: "Innovation distinguishes between a leader and a follower.", author: "Steve Jobs" },
                    { content: "Life is what happens to you while you're busy making other plans.", author: "John Lennon" },
                    { content: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt" },
                    { content: "It is during our darkest moments that we must focus to see the light.", author: "Aristotle" },
                    { content: "Success is not final, failure is not fatal: it is the courage to continue that counts.", author: "Winston Churchill" },
                    { content: "The way to get started is to quit talking and begin doing.", author: "Walt Disney" },
                    { content: "Don't let yesterday take up too much of today.", author: "Will Rogers" }
                ];
                const randomQuote = fallbackQuotes[Math.floor(Math.random() * fallbackQuotes.length)];
                this.displayQuote(randomQuote.content, randomQuote.author);
                return;
            }
            
            const data = await response.json();
            this.displayQuote(data.content, data.author);
            
        } catch (error) {
            console.error('Error fetching quote:', error);
            // Fallback quotes if API fails
            const fallbackQuotes = [
                { content: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
                { content: "Innovation distinguishes between a leader and a follower.", author: "Steve Jobs" },
                { content: "Life is what happens to you while you're busy making other plans.", author: "John Lennon" },
                { content: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt" },
                { content: "It is during our darkest moments that we must focus to see the light.", author: "Aristotle" },
                { content: "Success is not final, failure is not fatal: it is the courage to continue that counts.", author: "Winston Churchill" },
                { content: "The way to get started is to quit talking and begin doing.", author: "Walt Disney" },
                { content: "Don't let yesterday take up too much of today.", author: "Will Rogers" }
            ];
            const randomQuote = fallbackQuotes[Math.floor(Math.random() * fallbackQuotes.length)];
            this.displayQuote(randomQuote.content, randomQuote.author);
        }
    }
    
    displayQuote(content, author) {
        this.quoteContainer.innerHTML = `
            <div class="quote-text">"${content}"</div>
            <div class="quote-author">— ${author}</div>
        `;
    }
    
    async fetchRandomFact() {
        try {
            this.showLoading(this.factContainer);
            
            const response = await fetch('https://uselessfacts.jsph.pl/api/v2/facts/random');
            
            if (!response.ok) {
                throw new Error('Failed to fetch fact');
            }
            
            const data = await response.json();
            this.displayFact(data.text);
            
        } catch (error) {
            console.error('Error fetching fact:', error);
            // Fallback facts if API fails
            const fallbackFacts = [
                "The first computer programmer was Ada Lovelace in 1843.",
                "JavaScript was created in just 10 days by Brendan Eich in 1995.",
                "The first website ever created is still online at info.cern.ch.",
                "CSS was first proposed by Håkon Wium Lie in 1994.",
                "HTML was invented by Tim Berners-Lee in 1990."
            ];
            const randomFact = fallbackFacts[Math.floor(Math.random() * fallbackFacts.length)];
            this.displayFact(randomFact);
        }
    }
    
    displayFact(fact) {
        this.factContainer.innerHTML = `
            <div class="fact-text">${fact}</div>
        `;
    }
    
    async getLocationWeather() {
        try {
            // Check if geolocation is supported
            if (!navigator.geolocation) {
                throw new Error('Geolocation is not supported by this browser');
            }
            
            this.showLoading(this.weatherContainer);
            
            // Get user's location
            const position = await new Promise((resolve, reject) => {
                navigator.geolocation.getCurrentPosition(resolve, reject, {
                    timeout: 10000,
                    enableHighAccuracy: true
                });
            });
            
            const { latitude, longitude } = position.coords;
            
            // Fetch weather data using coordinates
            await this.fetchWeatherByCoords(latitude, longitude);
            
        } catch (error) {
            console.error('Error getting location weather:', error);
            this.showError(this.weatherContainer, 'Unable to get your location. Please try searching for a city manually.');
        }
    }
    
    async searchWeather() {
        const city = this.cityInput.value.trim();
        
        if (!city) {
            this.showError(this.weatherContainer, 'Please enter a city name');
            return;
        }
        
        try {
            this.showLoading(this.weatherContainer);
            await this.fetchWeatherByCity(city);
        } catch (error) {
            console.error('Error searching weather:', error);
            this.showError(this.weatherContainer, 'City not found. Please check the spelling and try again.');
        }
    }
    
    async fetchWeatherByCity(city) {
        // Using OpenWeatherMap API (requires API key in production)
        // For demo purposes, we'll simulate weather data
        await this.simulateWeatherData(city);
    }
    
    async fetchWeatherByCoords(lat, lon) {
        // Using coordinates to get weather data
        // For demo purposes, we'll simulate weather data
        await this.simulateWeatherData('Your Location');
    }
    
    async simulateWeatherData(location) {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Generate realistic weather data
        const temperatures = [18, 22, 25, 28, 31, 16, 20, 24, 27, 30];
        const conditions = [
            'Sunny', 'Partly Cloudy', 'Cloudy', 'Light Rain', 
            'Clear', 'Overcast', 'Light Clouds', 'Mostly Sunny'
        ];
        const humidity = [45, 50, 65, 72, 58, 61, 55, 48];
        const windSpeed = [5, 8, 12, 15, 7, 10, 6, 9];
        
        const temp = temperatures[Math.floor(Math.random() * temperatures.length)];
        const condition = conditions[Math.floor(Math.random() * conditions.length)];
        const hum = humidity[Math.floor(Math.random() * humidity.length)];
        const wind = windSpeed[Math.floor(Math.random() * windSpeed.length)];
        
        this.displayWeather({
            location,
            temperature: temp,
            description: condition,
            humidity: hum,
            windSpeed: wind,
            feelsLike: temp + Math.floor(Math.random() * 5) - 2
        });
    }
    
    displayWeather(data) {
        this.weatherContainer.innerHTML = `
            <div class="weather-info">
                <div class="weather-location">${data.location}</div>
                <div class="weather-temp">${data.temperature}°C</div>
                <div class="weather-desc">${data.description}</div>
                <div class="weather-details">
                    <div>Feels like: ${data.feelsLike}°C</div>
                    <div>Humidity: ${data.humidity}%</div>
                    <div>Wind: ${data.windSpeed} km/h</div>
                    <div>Pressure: ${Math.floor(Math.random() * 50) + 1000} hPa</div>
                </div>
            </div>
            <div class="weather-search">
                <input type="text" id="city-input" placeholder="Enter city name">
                <button class="btn btn-secondary" onclick="apiManager.searchWeather()">Search</button>
            </div>
        `;
        
        // Reassign the input reference after DOM update
        this.cityInput = document.getElementById('city-input');
        this.cityInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.searchWeather();
            }
        });
    }
    
    showLoading(container) {
        container.innerHTML = '<div class="loading">Loading...</div>';
    }
    
    showError(container, message) {
        container.innerHTML = `<div class="error">${message}</div>`;
    }
}

// Global functions
function fetchNewQuote() {
    if (window.apiManager) {
        window.apiManager.fetchQuote();
    }
}

function getLocationWeather() {
    if (window.apiManager) {
        window.apiManager.getLocationWeather();
    }
}

function searchWeather() {
    if (window.apiManager) {
        window.apiManager.searchWeather();
    }
}

function fetchRandomFact() {
    if (window.apiManager) {
        window.apiManager.fetchRandomFact();
    }
}

// Initialize API manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.apiManager = new APIManager();
});