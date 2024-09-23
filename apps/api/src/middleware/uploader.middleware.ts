import { Request } from 'express';
import multer from 'multer';
import { join } from 'path';

export const uploader = (dirName?: string, filePrefix?: string) => {
  const defaultDir = join(__dirname, '../../public/assets');

  const configStore = multer.diskStorage({
    destination: (
      req: Request,
      file: Express.Multer.File,
      cb: (error: Error | null, destination: string) => void,
    ) => {
      const fileDestination = dirName ? defaultDir + dirName : defaultDir;
      cb(null, fileDestination);
    },
    filename: (
      req: Request,
      file: Express.Multer.File,
      cb: (error: Error | null, destination: string) => void,
    ) => {
      const existName = file.originalname.split('.');
      const extension = existName[existName.length - 1];
      if (filePrefix) {
        const newName = filePrefix + Date.now() + '.' + extension;
        cb(null, newName);
      } else {
        cb(null, file.originalname);
      }
    },
  });

  return multer({ storage: configStore });
};
