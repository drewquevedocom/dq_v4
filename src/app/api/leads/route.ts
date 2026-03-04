import { NextResponse } from 'next/server';
import { Resend } from 'resend';

// Initialize Resend with the API key from environment variables
const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
    try {
        const body = await req.json();

        // Extract the common fields from the contact form
        const { name, email, company, message, source } = body;

        if (!email || !message) {
            return NextResponse.json({ error: 'Email and message are required fields.' }, { status: 400 });
        }

        // Send the email directly to dq@drewquevedo.com
        const data = await resend.emails.send({
            from: 'AgentIQ Leads <onboarding@resend.dev>', // Change this to a verified domain email later if desired (e.g., system@drewquevedo.com)
            to: ['drewquevedo@gmail.com'], // Using verified sandbox email until domain is verified in Resend
            subject: `New Lead Inquiry: ${name || email}`,
            html: `
                <h2>New Lead Submission</h2>
                <p><strong>Name:</strong> ${name || 'Not provided'}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Company:</strong> ${company || 'Not provided'}</p>
                <p><strong>Source:</strong> ${source || 'Website Contact Form'}</p>
                <hr />
                <h3>Message:</h3>
                <p>${message.replace(/\n/g, '<br/>')}</p>
            `,
        });

        if (data.error) {
            console.error('[Resend Error]', data.error);
            return NextResponse.json({ error: 'Failed to dispatch email' }, { status: 500 });
        }

        console.log(`[AUTOMATED] Email dispatched to drewquevedo@gmail.com for lead: ${email}`);

        return NextResponse.json({
            status: 'PROCESSED',
            message: 'Email successfully routed to drewquevedo@gmail.com',
            data
        });

    } catch (error) {
        console.error('[API Error]', error);
        return NextResponse.json({ error: 'Failed to process lead' }, { status: 500 });
    }
}
