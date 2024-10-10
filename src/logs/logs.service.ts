import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateLog } from './interfaces';

@Injectable()
export class LogsService {
    constructor(private readonly prismaService: PrismaService) {}

    async getLastLogById(id: number) {
        return await this.prismaService.log.findFirst({
            where: {
                telegramId: id
            },
            orderBy: {
                createdAt: 'desc',
              },
            take: 1,
        })
    }

    async getAll(page?: number, logsOnPage?: number) {
        if (page) {
            return await this.prismaService.log.findMany({
                skip: (page - 1) * logsOnPage,
                take: logsOnPage
            })
        }
        else {
            return await this.prismaService.log.findMany()
        }
    }

    async getById(id: number, page?: number, logsOnPage?: number) {
        if (!await this.getLastLogById(id)) throw new NotFoundException(`TelegramId not exsists`)

        if (page) {
            return await this.prismaService.log.findMany({
                where: {
                    telegramId: id
                },
                skip: (page - 1) * logsOnPage,
                take: logsOnPage
            })
        }
        else {
            return await this.prismaService.log.findMany({
                where: {
                    telegramId: id
                }
            })
        }
    }

    async create(logInfo: CreateLog) {
        return await this.prismaService.log.create({
            data: {
                ...logInfo,
                date: new Date()
            }
        })
    }
}
