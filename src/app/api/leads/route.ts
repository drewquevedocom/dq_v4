import { NextResponse } from 'next/server';
import { requiresApproval } from '@/lib/governance';

/**
 * Lead Intent API
 * 
 * First touchpoint for new leads. 
 * Checks for HITL status before triggering outreach sequences.
 */
export async function POST(req: Request) {
    try {
        const data = await req.json();
        const { email } = data; // email is the only one used for now

        // Check if the action (notifying or processing) requires approval
        const needsApproval = requiresApproval('SEND_EMAIL');

        if (needsApproval) {
            // In a real app, we would write to a DB "approvals" collection here.
            // For now, we simulate the HITL queue.
            console.log(`[HITL] Action required for lead: ${email}`);
            return NextResponse.json({
                status: 'PENDING_APPROVAL',
                message: 'Lead received. Awaiting manual review in Mission Control.'
            }, { status: 202 });
        }

        // If HITL is off, proceed with automation (mocking Resend/Instantly call)
        console.log(`[AUTOMATED] Processing lead: ${email}`);

        return NextResponse.json({
            status: 'PROCESSED',
            message: 'Lead processed and routed to Instantly.ai'
        });

    } catch {
        return NextResponse.json({ error: 'Failed to process lead' }, { status: 500 });
    }
}
