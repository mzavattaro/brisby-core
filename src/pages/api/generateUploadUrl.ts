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
  error?: string;
  uploadUrl?: string;
  key?: string;
};

const handler: NextApiHandler<PresignedUrlResponse> = (req, res) => {
  if (typeof req.query.fileType !== "string") {
    res.status(400).json({ error: "fileType must be a string" });
    return;
  }

  const fragments = req.query.fileType.split("/");

  if (fragments.length !== 2) {
    res.status(400).json({ error: "fileType must have two fragments" });
    return;
  }

  const ex = fragments[1];

  if (!ex) {
    res.status(400).json({ error: "fileType must be a valid mime type" });
    return;
  }

  const Key = `${randomUUID()}.${ex}`;

  const s3Params = {
    Bucket: process.env.AWS_S3_BUCKET,
    Key,
    Expires: 3600,
    ContentType: req.query.fileType,
  };

  const uploadUrl = s3.getSignedUrl("putObject", s3Params);

  res.status(200).json({
    uploadUrl,
    key: Key,
  });
};

export default handler;
