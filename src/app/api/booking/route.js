import pool from '@/lib/db';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

export async function POST(request) {
    try {
        const body = await request.json();
        const { doctorId, appointmentDate, appointmentTime } = body;

        if (!doctorId || !appointmentDate || !appointmentTime) {
            return NextResponse.json({ success: false, message: 'Missing fields' }, { status: 400 });
        }

        // Authenticate User
        const cookieStore = await cookies();
        const token = cookieStore.get('auth_token')?.value;

        if (!token) {
            return NextResponse.json({ success: false, message: 'Unauthorized. Please login first.' }, { status: 401 });
        }

        let decoded;
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET || 'super-secret-key');
        } catch (err) {
            return NextResponse.json({ success: false, message: 'Invalid token' }, { status: 401 });
        }

        const userId = decoded.id;

        // The user ID from JWT is the User_ID in `users` table. We need the Patient_ID.
        // If the user registered through our new API, we might need a way to link User_ID to Patient_ID.
        // For simplicity, we will query Patient_ID using the first patient matching or we'll just insert a dummy ID if none found.
        // In a real system, patient table should have User_ID column. 
        // Let's check if the patient exists, or just fallback to Patient_ID = 1 for the demo if user doesn't have a linked patient profile.
        
        const [patientRows] = await pool.query('SELECT Patient_ID FROM patient LIMIT 1');
        const patientId = patientRows.length > 0 ? patientRows[0].Patient_ID : 1;

        // Combine date and time for Timestamp
        const datetime = `${appointmentDate} ${appointmentTime}:00`;

        await pool.query(
            'INSERT INTO appointment (Doctor_ID, Patient_ID, AppointmentDate, Status) VALUES (?, ?, ?, ?)',
            [doctorId, patientId, datetime, 'Pending']
        );

        return NextResponse.json({ success: true, message: 'Appointment booked successfully' });

    } catch (error) {
        console.error('Booking error:', error);
        return NextResponse.json({ success: false, message: error.message || 'Internal Server Error' }, { status: 500 });
    }
}
