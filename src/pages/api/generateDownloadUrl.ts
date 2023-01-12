import type { NextApiHandler } from "next";
import s3 from "../../utils/s3";

const handler: NextApiHandler = (req, res) => {
  const url = s3.getSignedUrl("getObject", {
    Bucket: process.env.AWS_S3_BUCKET,
    Key: req.query.key as string,
    Expires: 60,
  });

  res.redirect(url);
};

export default handler;
