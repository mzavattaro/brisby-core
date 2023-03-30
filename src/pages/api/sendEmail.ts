// import { render } from "@react-email/render";
import sendgrid from '@sendgrid/mail';
// import { ExampleTemplate } from "../../../emails/ExampleTemplate";

if (!process.env.SENDGRID_API_KEY) {
  throw new Error('Missing SENDGRID_API_KEY');
}

sendgrid.setApiKey(process.env.SENDGRID_API_KEY);

type EmailPayload = {
  to: string;
  subject: string;
  html: string;
};

export const sendEmail = async (props: EmailPayload): Promise<void> => {
  try {
    const { to, subject, html } = props;

    const options = {
      from: 'no-reply@getbrisby.com',
      to,
      subject,
      html,
    };

    await sendgrid.send(options);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error);
  }
};
