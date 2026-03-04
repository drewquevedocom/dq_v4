import { Resend } from 'resend';
import 'dotenv/config'; // to load .env.local

const resend = new Resend(process.env.RESEND_API_KEY);

async function testResend() {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
    try {
        console.log("Testing Resend API with key starting with:", process.env.RESEND_API_KEY?.substring(0, 5));
        const data = await resend.emails.send({
            from: 'AgentIQ Leads <onboarding@resend.dev>',
            to: ['dq@drewquevedo.com'],
            subject: 'Test Resend Error',
            html: '<p>Testing exactly what error Resend returns</p>',
        });

        console.log("Resend data:", JSON.stringify(data, null, 2));
    } catch (err) {
        console.error("Direct catch:", err);
    }
}

testResend();
