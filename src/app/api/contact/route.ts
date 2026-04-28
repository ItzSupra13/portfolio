import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const { name, email, message, topic } = await req.json();

    await resend.emails.send({
      from: "Aster Dev <onboarding@resend.dev>",
      to: ["itzasterdev@gmail.com"],
      subject: `New Contact: ${topic}`,
      replyTo: email,
      html: `
        <div>
          <h2>New Message</h2>
          <p><b>Name:</b> ${name}</p>
          <p><b>Email:</b> ${email}</p>
          <p><b>Topic:</b> ${topic}</p>
          <p><b>Message:</b></p>
          <p>${message}</p>
        </div>
      `,
    });

    return Response.json({ success: true });
  } catch (err) {
    return Response.json({ error: "Failed" }, { status: 500 });
  }
}
