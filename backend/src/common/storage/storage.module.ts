import { Module } from '@nestjs/common';
import { B2StorageService } from './b2-storage.service';

@Module({
  providers: [B2StorageService],
  exports: [B2StorageService],
})
export class StorageModule {}
