import { DynamicModule, INestApplication, Module} from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

@Module({

})
export class SwaggerModuleLocal {
    static forRoot(app: INestApplication): DynamicModule {
        const swaggerConfig = new DocumentBuilder()
        .setTitle("The WeatherBot API")
        .setDescription("Documentation WeatherBot API")
        .setVersion(process.env.API_VERSION)
        .build()
        
        const document = SwaggerModule.createDocument(app, swaggerConfig)
        SwaggerModule.setup("/swagger", app, document)

        return {
            module: SwaggerModuleLocal
        }
    }
}