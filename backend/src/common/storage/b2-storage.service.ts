import { Injectable } from '@nestjs/common';
import B2 from 'backblaze-b2';
import { v4 as uuidv4 } from 'uuid';
import * as path from 'path';

@Injectable()
export class B2StorageService {
  private b2: B2;
  private bucketName: string;
  private bucketId: string | null = null;
  private publicUrl: string;

  constructor() {
    const applicationKeyId = process.env.B2_KEY_ID;
    const applicationKey = process.env.B2_APPLICATION_KEY;
    this.bucketName = process.env.B2_BUCKET_NAME || 'universidad-files';
    this.publicUrl = process.env.B2_PUBLIC_URL || '';

    if (!applicationKeyId || !applicationKey) {
      console.warn('⚠️ Backblaze B2 no configurado. Las subidas fallarán.');
      return;
    }

    this.b2 = new B2({
      applicationKeyId,
      applicationKey,
    });

    console.log('✅ Backblaze B2 configurado (librería nativa)');
  }

  private async getBucketId(): Promise<string> {
    if (this.bucketId) {
      return this.bucketId;
    }

    await this.b2.authorize();
    
    // Listar buckets y encontrar el nuestro
    const { data } = await this.b2.listBuckets();
    const bucket = data.buckets.find((b: any) => b.bucketName === this.bucketName);
    
    if (!bucket) {
      throw new Error(`Bucket "${this.bucketName}" no encontrado`);
    }
    
    this.bucketId = bucket.bucketId;
    console.log('[B2] Bucket ID encontrado:', this.bucketId);
    return this.bucketId!;
  }

  async uploadFile(
    file: any,
    folder: string,
  ): Promise<{ url: string; key: string }> {
    console.log('[B2] Iniciando uploadFile:', { folder, fileName: file?.originalname, size: file?.buffer?.length });
    
    if (!this.b2) {
      console.error('[B2] ERROR: B2 no está inicializado');
      throw new Error('B2 no configurado. Verifica las variables de entorno.');
    }

    const uniqueId = uuidv4();
    const ext = path.extname(file.originalname);
    const key = `${folder}/${uniqueId}${ext}`;

    console.log('[B2] Subiendo archivo:', { bucket: this.bucketName, key, contentType: file.mimetype, size: file.buffer.length });

    try {
      // Obtener bucket ID dinámicamente
      const bucketId = await this.getBucketId();
      
      // Obtener URL de upload
      const { data: uploadUrlData } = await this.b2.getUploadUrl({
        bucketId,
      });

      // Subir archivo
      await this.b2.uploadFile({
        uploadUrl: uploadUrlData.uploadUrl,
        uploadAuthToken: uploadUrlData.authorizationToken,
        fileName: key,
        data: file.buffer,
        contentType: file.mimetype,
      });
      
      console.log('[B2] Upload completado exitosamente');

      const url = this.publicUrl
        ? `${this.publicUrl}/${key}`
        : `https://f002.backblazeb2.com/file/${this.bucketName}/${key}`;

      console.log('[B2] URL generada:', url);
      return { url, key };
    } catch (error) {
      console.error('[B2] ERROR en upload:', error);
      throw error;
    }
  }

  async deleteFile(key: string): Promise<void> {
    if (!this.b2) {
      throw new Error('B2 no configurado');
    }

    const bucketId = await this.getBucketId();
    
    // Buscar el fileId por nombre
    const { data: listFilesData } = await this.b2.listFileNames({
      bucketId,
      startFileName: key,
      maxFileCount: 1,
    });

    if (listFilesData.files.length > 0 && listFilesData.files[0].fileName === key) {
      await this.b2.deleteFileVersion({
        fileId: listFilesData.files[0].fileId,
        fileName: key,
      });
    }
  }

  getPublicUrl(key: string): string {
    if (this.publicUrl) {
      return `${this.publicUrl}/${key}`;
    }
    return `https://f002.backblazeb2.com/file/${this.bucketName}/${key}`;
  }
}
