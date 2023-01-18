import { CloudFrontClient } from "@aws-sdk/client-cloudfront";

const cloudFront = new CloudFrontClient({
  region: process.env.AWS_S3_REGION,
  credentials: {
    accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID as string,
    secretAccessKey: process.env.AWS_S3_SECRET_KEY as string,
  },
});

export default cloudFront;
