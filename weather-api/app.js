require('dotenv').config();
const API_KEY = process.env.API_KEY;
const REDIS_URL_PASSWORD = process.env.REDIS_URL_PASSWORD;
const REDIS_URL_HOST = process.env.REDIS_URL_HOST;
const REDIS_URL_PORT = process.env.REDIS_URL_PORT;

const express = require('express');
const axios = require('axios');
const { createClient } = require('redis');
const rateLimit = require('express-rate-limit');

const app = express();
const port = 3000;

// Redis Client
const redisClient = createClient({
    password: REDIS_URL_PASSWORD,
    socket: {
        host: REDIS_URL_HOST,
        port: REDIS_URL_PORT
    }
});

// Connect to Redis
redisClient.connect().catch(console.error);

// Rate limiter middleware
const limiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 10, // Limit each IP to 10 requests per windowMs
    message: "Too many requests, please try again later."
});
app.use(limiter);

// Weather API route
app.get('/weather/:city', async (req, res) => {
    const city = req.params.city;

    try {
        // Check Redis cache first
        const cachedWeather = await redisClient.get(city);
        if (cachedWeather) {
            return res.json(JSON.parse(cachedWeather));
        }

        // If no cache, fetch from Visual Crossing API
        const apiUrl = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${city}?key=${API_KEY}`;
        const response = await axios.get(apiUrl);
        const weatherData = response.data;

        // Store the result in Redis with 12-hour expiration
        redisClient.setEx(city, 43200, JSON.stringify(weatherData));
        res.json(weatherData);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error fetching weather data' });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
