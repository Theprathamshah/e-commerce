import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { v4 as uuidv4 } from 'uuid';
import dotenv from "dotenv";

dotenv.config();

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    sessionToken: process.env.AWS_SESSION_TOKEN
  },
});

export const uploadToS3 = async (fileBuffer: Buffer, fileName: string, fileType: string): Promise<string> => {
  const key = `images/${uuidv4()}-${fileName}`;

  const uploadParams = {
    Bucket: process.env.AWS_S3_BUCKET_NAME!,
    Key: key,
    Body: fileBuffer,
    ContentType: fileType,
  };

  try {
    const command = new PutObjectCommand(uploadParams);
    await s3Client.send(command);
    return key; // Return the key of the uploaded file to store in the database
  } catch (err) {
    console.error("Error uploading image to S3", err);
    throw new Error("Could not upload image to S3");
  }
};

export const getImageUrlFromS3 = async (key: string): Promise<string> => {
  const getParams = {
    Bucket: process.env.AWS_S3_BUCKET_NAME!,
    Key: key,
  };

  try {
    const command = new GetObjectCommand(getParams);
    const { Body } = await s3Client.send(command);
    // Assuming you're making a presigned URL, otherwise just return the key
    return `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
  } catch (err) {
    console.error("Error retrieving image from S3", err);
    throw new Error("Could not retrieve image from S3");
  }
}

  export const deleteImageFromS3 = async (key: string): Promise<void> => {
    const deleteParams = {
      Bucket: process.env.AWS_S3_BUCKET_NAME!,
      Key: key,
    };
  
    try {
      const command = new DeleteObjectCommand(deleteParams);
      await s3Client.send(command);
      console.log(`Image with key ${key} deleted from S3`);
    } catch (err) {
      console.error("Error deleting image from S3", err);
      throw new Error("Could not delete image from S3");
    }
};