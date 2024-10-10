import { Ctx, InjectBot, Message, On, Start, Update } from "nestjs-telegraf";
import { Context, Telegraf } from "telegraf";
import { TelegramService } from "./telegram.service";
import { LogsService } from "src/logs/logs.service";

@Update()
export class TelegramUpdate {
    constructor(
        @InjectBot() private readonly bot: Telegraf<Context>,
        private readonly telegramService: TelegramService,
        private readonly logsService: LogsService
    ) {
        bot.telegram.setMyCommands([
            {
                command: "weather", description: "Получает погоду в городе.",
            },
            {
                command: "repeat", description: "Получает погоду повторно из последнего запрошенного города"
            }
        ])
    }

    @Start()
    async start(@Ctx() ctx: Context) {
        await ctx.reply(`Здравствуй! Я - Бот погоды для BobrAi!`)
    }

    @On(`text`)
    async text(@Ctx() ctx: Context, @Message(`text`) msg: string) {
        if (msg.indexOf(`/weather`) === 0) {
            const array = msg.split(" ")
            array.shift()

            const city = array.join(" ")

            if (!city) { 
                await ctx.reply(`Требуется ввести команду в формате /weather [Город]`) 
                return;
            }

            try {
                const weather = await this.telegramService.getWeather(city)
                const answerString = `Погода в ${city}: \n Температура: ${weather.temp}°C \n Ощущается как: ${weather.temp_like}°C \n Общее описание: ${weather.weather_description} \n Влажность: ${weather.humidity}% \n Скорость ветра: ${weather.wind_speed} м/с`

                await this.logsService.create({
                    botAnswer: answerString,
                    telegramId: ctx.from.id,
                    command: msg
                })

                await ctx.reply(answerString)
                return;
            } catch(e) {
                await ctx.reply(`Произошла ошибка! Возможно, это связано с недоступностью сервера погоды. Попробуйте еще раз.`)
                return;
            }
        }

        if (msg.indexOf(`/repeat`) === 0) {
            try {
                const weather = await this.telegramService.getRepeatWeather(ctx.from.id)
                const answerString = `Погода в ${weather.city}: \n Температура: ${weather.temp}°C \n Ощущается как: ${weather.temp_like}°C \n Общее описание: ${weather.weather_description} \n Влажность: ${weather.humidity}% \n Скорость ветра: ${weather.wind_speed} м/с`

                await this.logsService.create({
                    botAnswer: answerString,
                    telegramId: ctx.from.id,
                    command: `${msg} ${weather.city}`
                })

                await ctx.reply(answerString)
                return;

            } catch(e) {
                await ctx.reply(`Произошла ошибка! Возможно, вы еще ни разу не запрашивали погоду, либо сервер не отвечает.`)
                return;
            }
        }
    }
}