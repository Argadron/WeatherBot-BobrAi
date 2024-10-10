import { Injectable } from "@nestjs/common";
import axios from 'axios'
import { Weather } from "./interfaces";
import { LogsService } from "src/logs/logs.service";

@Injectable()
export class TelegramService {
    constructor(private readonly logsService: LogsService) {}

    private constructWeather(weatherData: any, city: string): Weather {
        return {
            temp: weatherData.main.temp,
            temp_like: weatherData.main.feels_like,
            weather_description: weatherData.weather[0].description, 
            humidity: weatherData.main.humidity, 
            wind_speed: weatherData.wind.speed,
            city
        }
    }
    
    private readonly baseUrl = `https://api.openweathermap.org/data/2.5/weather?appid=${process.env.OPENWEATHER_API_KEY}&lang=ru&units=metric`

    async getWeather(city: string): Promise<Weather> {
        try {
            const weather = await axios.get(`${this.baseUrl}`+`&q=${city}, ru`)
            const weatherData = weather.data
      
            if (!weatherData) {
                throw new Error(`Error to fetching weather!`)
            }
            
            return this.constructWeather(weatherData, city)

        } catch(e) {
            throw new Error(e)
        }
    }

    async getRepeatWeather(telegramId: number): Promise<Weather> {
        const lastLog = await this.logsService.getLastLogById(telegramId)

        if (!lastLog) {
            throw new Error(`No sended requests`)
        }

        const array = lastLog.command.split(" ")
        array.shift()

        const city = array.join(" ")

        const weather = await axios.get(`${this.baseUrl}`+`&q=${city}, ru`)
        
        return this.constructWeather(weather.data, city)
    }
}