import { Injectable } from '@nestjs/common';
import { UploadApiResponse, v2 } from 'cloudinary';
import toStream = require('buffer-to-stream');

@Injectable()
export class CloudinaryService {
    //* Recibe al archivo y transforma el buffer a un readableStream y lo carga a cloudinary
  async uploadImage(file: Express.Multer.File): Promise<UploadApiResponse> {
    return new Promise((resolve, reject) => {
        //* genera una promesa que utiliza la funcion upload_stream para cargar archivos a cloudinary
      const upload = v2.uploader.upload_stream(
        { resource_type: 'auto' },
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        },
      );
      //* ReadableStream, convierte un búfer en un flujo de datos que se puede usar para enviar datos a través de un flujo.
      //! Convierte el buffer del archivo a un formato compatible con cloudinary
      toStream(file.buffer).pipe(upload);
    });
  }
}
