// import { render } from "@react-email/render";
import sendgrid from "@sendgrid/mail";
// import { ExampleTemplate } from "../../../emails/ExampleTemplate";

sendgrid.setApiKey(process.env.SENDGRID_API_KEY as string);

type EmailPayload = {
  to: string;
  subject: string;
  html: string;
};

export const sendEmail = async (props: EmailPayload) => {
  try {
    const { to, subject, html } = props;

    const options = {
      from: "no-reply@getbrisby.com",
      to,
      subject,
      html,
    };

    await sendgrid.send(options);
  } catch (error) {
    console.log(error);
  }
};
