import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, UseInterceptors, UseGuards, UploadedFile, Req } from '@nestjs/common';
import { DocumentsService } from './documents.service';
import { Prisma } from 'generated/prisma';
import { UploadDocumentDto } from './dto/upload-document.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('documents')
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  @Post('upload')
  // @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(FileInterceptor('file'))
  uploadDocument(
    @UploadedFile() file: Express.Multer.File,
    @Req() req: Request,
    @Body() body: UploadDocumentDto,
  ) {
    // const user = req.user as { id: number };
    return this.documentsService.create({
      filename: body.filename || file.originalname,
      status: 'UPLOADED',
      user: {
        // connect: { id: user.id },
        create: { email: 'test@test.com', passwordHash: '12345' },
      }
    })
  }

  @Get()
  findAll() {
    return this.documentsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.documentsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateDocumentDto: Prisma.DocumentUpdateInput) {
    return this.documentsService.update(id, updateDocumentDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.documentsService.remove(id);
  }

  @Get(':id/text')
  getExtractedText(@Param('id', ParseIntPipe) id: number) {
    return this.documentsService.findOne(id, { textData: true });
  }

  @Get('id/summary')
  getSummary(@Param('id', ParseIntPipe) id: number) {
    return this.documentsService.findOne(id, { summary: true });
  }
}
