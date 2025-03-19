import { Upload } from "@aws-sdk/lib-storage";
import { DeleteObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { randomUUID } from "crypto";

import { config } from "../../config";
import { AppError } from "../../errors/AppError";
import { s3Client } from "../../config/aws/s3ClientConfig";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import isEmpty from "lodash/isEmpty";

const { BUCKET_NAME } = config;

const acceptablesImgType = ["jpeg", "png", "gif"];

const validateTypeFiles = (fileType: string, acceptables: string[]) => {
  const splitedFileType = fileType.split("/");
  const type = splitedFileType[1] || splitedFileType[0];

  if (!acceptables.includes(type)) {
    throw new AppError(
      `${type} is not accept file type. Acceptables: ${acceptables}`,
      400
    );
  }

  return type;
};

const uploadImage = (file: any, folderName = "", fileName = "") => {
  const type = validateTypeFiles(file.mimetype, acceptablesImgType);
  const baseName = fileName || randomUUID();
  const params = {
    Bucket: BUCKET_NAME,
    Key: `images/${folderName}/${baseName}.${type}`,
    ContentType: file.type,
    Body: Buffer.from(file.buffer || file, "binary"),
  };

  return new Upload({
    client: s3Client,
    params,
  }).done();
};

const deleteFile = (fileUrl: string) => {
  const params = {
    Bucket: BUCKET_NAME,
    Key: fileUrl,
  };

  const deleteCommand = new DeleteObjectCommand(params);
  return s3Client.send(deleteCommand);
};

const getTemporaryFileUrl = (fileKey: string, expiresIn = 3600) => {
  const params = {
    Bucket: BUCKET_NAME,
    Key: fileKey
  }

  const command = new GetObjectCommand(params);

  if(isEmpty(fileKey)) return '';

  return getSignedUrl(s3Client, command, { expiresIn });
}

export { uploadImage, deleteFile, getTemporaryFileUrl };
