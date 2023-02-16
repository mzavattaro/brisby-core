import { S3Client } from "@aws-sdk/client-s3";

if (
  !process.env.AWS_S3_REGION ||
  !process.env.AWS_S3_ACCESS_KEY_ID ||
  !process.env.AWS_S3_SECRET_KEY
) {
  throw new Error("Missing AWS S3 env variables");
}

const s3 = new S3Client({
  region: process.env.AWS_S3_REGION,
  credentials: {
    accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_S3_SECRET_KEY,
  },
});

export default s3;
