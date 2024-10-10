import { DynamicModule, Module } from "@nestjs/common";
import { TelegrafModule } from "nestjs-telegraf";
import { TelegramUpdate } from "./telegram.update";
import { Context, Telegraf } from "telegraf";
import { TelegramService } from "./telegram.service";
import { LogsModule } from "src/logs/logs.module";

@Module({
    imports: [LogsModule],
    providers: [
        TelegramUpdate,
        TelegramService,
        {
            provide: process.env.TELEGRAM_BOT_NAME,
            useValue: Telegraf<Context>
        }
    ]
})
export class TelegramModule {
    static forRoot(): DynamicModule {
        return {
            module: TelegramModule,
            imports: [TelegrafModule.forRoot({
                token: process.env.TELEGRAM_BOT_TOKEN
            })]
        }
    }
}