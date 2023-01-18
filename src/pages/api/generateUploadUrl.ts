// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
// import type { NextApiRequest, NextApiResponse } from "next";
import type { NextApiHandler } from "next";
import { randomUUID } from "crypto";
// import s3 from "../../utils/s3";
import S3 from "aws-sdk/clients/s3";

const s3 = new S3({
  apiVersion: "2006-03-01",
  accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_S3_SECRET_KEY,
  region: process.env.AWS_S3_REGION,
  signatureVersion: "v4",
});

export type PresignedUrlResponse = {
  uploadUrl: string;
  key: string;
};

const handler: NextApiHandler<PresignedUrlResponse> = (req, res) => {
  const ex = (req.query.fileType as string).split("/")[1];
  const Key = `${randomUUID()}.${ex}`;

  const s3Params = {
    Bucket: process.env.AWS_S3_BUCKET,
    Key,
    Expires: 3600,
    ContentType: `application/${ex}`,
  };

  const uploadUrl = s3.getSignedUrl("putObject", s3Params);

  res.status(200).json({
    uploadUrl,
    key: Key,
  });
};

export default handler;
