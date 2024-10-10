import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { LogsService } from './logs.service';
import { ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SwaggerBadRequest, SwaggerNotFound, SwaggerOK } from 'src/swagger/apiResponse.interfaces';

@Controller('logs')
@ApiTags(`Logs Controller`)
export class LogsController {
  constructor(private readonly logsService: LogsService) {}

  @Get(`/all`)
  @ApiResponse({ status: 200, description: "Logs getted", type: SwaggerOK })
  @ApiQuery({ name: "page", required: false, description: "Logs page need to see", type: Number })
  @ApiQuery({ name: "logsOnPage", required: false, description: "Need logs", type: Number })
  async getAll(@Query(`page`, new ParseIntPipe({ optional: true })) page?: number, 
  @Query(`logsOnPage`, new ParseIntPipe({ optional: true })) limit?: number) {
    return await this.logsService.getAll(page, limit)
  }

  @Get(`/by-id/:id`)
  @ApiResponse({ status: 200, description: "Logs getted", type: SwaggerOK })
  @ApiResponse({ status: 400, description: "Validation failed", type: SwaggerBadRequest })
  @ApiResponse({ status: 404, description: "This telegramId not found", type: SwaggerNotFound })
  @ApiQuery({ name: "page", required: false, description: "Logs page need to see", type: Number })
  @ApiQuery({ name: "logsOnPage", required: false, description: "Need logs", type: Number })
  @ApiQuery({ name: "before", required: false, description: "Before time filter. Example: 15:00", type: String })
  @ApiQuery({ name: "after", required: false, description: "After time filter. Example: 15:00", type: String })
  async getById(@Param(`id`, ParseIntPipe) id: number, @Query(`page`, new ParseIntPipe({ optional: true })) page?: number, 
  @Query(`logsOnPage`, new ParseIntPipe({ optional: true })) limit?: number) {
    return await this.logsService.getById(id, page, limit)
  }
}
