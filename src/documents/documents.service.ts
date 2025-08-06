import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from 'generated/prisma';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class DocumentsService {
  constructor(private readonly databaseService: DatabaseService) {}

  async create(createDocumentDto: Prisma.DocumentCreateInput) {
    return this.databaseService.document.create({
      data: createDocumentDto
    });
  }

  async findAll() {
    return this.databaseService.document.findMany()
  }

  async findOne(
    id: number, 
    options?: {textData?: boolean, summary?: boolean}
  ) {
    const document = await this.databaseService.document.findUnique({
      where: {
        id,
      },
      include: {
        textData: options?.textData ?? false,
        summary: options?.summary ?? false,
      }
    });

    if (!document) throw new NotFoundException("No document found");
    
    return document;
  }

  async update(id: number, updateDocumentDto: Prisma.DocumentUpdateInput) {
    return this.databaseService.document.update({
      where: {
        id,
      },
      data: updateDocumentDto,
    })
  }

  async remove(id: number) {
    return this.databaseService.document.delete({
      where: {
        id,
      }
    })
  }
}
