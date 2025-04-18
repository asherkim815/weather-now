import 'dotenv/config';
import express from 'express';
import axios from 'axios';
import openWeatherMajorCities from './public/OpenWeatherMajorCities.json' with { type: 'json' };

const env = process.env;
const app = express();
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

const citiesAndCountries = openWeatherMajorCities.map((obj) => {
  return {city: obj.name, country: obj.country}
});

app.get('/', async (req, res) => {
  res.render('index', {
    citiesAndCountries: citiesAndCountries,
  });
});

app.post('/', async (req, res) => {  
  try {
    const reqBody = req.body['city-and-country'].split(', ');
    const reqCity = reqBody[0];
    const reqCountry = reqBody[1];
    const unit = 'metric';
    const apiKey = env.OPENWEATHERMAP_API_KEY;
    const apiRes = await axios.post(
      `https://api.openweathermap.org/data/2.5/weather?q=${reqCity},${reqCountry}&units=${unit}&appid=${apiKey}`
    ); 
    const weatherData = apiRes.data;

    console.log(weatherData)

    res.render('index', {
      citiesAndCountries: citiesAndCountries,      
      weatherData: weatherData,
    });
  } catch (error) {
    res.redirect('/');
  }
});

app.listen(env.SERVER_PORT, () => {
  console.log(`Serving on port ${env.SERVER_PORT}`);
});
