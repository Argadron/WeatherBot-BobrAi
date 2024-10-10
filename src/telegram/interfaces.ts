export interface Weather {
    readonly temp: number;
    readonly temp_like: number;
    readonly weather_description: string;
    readonly humidity: number;
    readonly wind_speed: number;
    readonly city: string;
}