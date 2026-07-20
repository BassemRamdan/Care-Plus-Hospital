import pool from '@/lib/db';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

export async function GET() {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('auth_token')?.value;

        if (!token) {
            return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
        }

        let decoded;
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET || 'super-secret-key');
        } catch (err) {
            return NextResponse.json({ success: false, message: 'Invalid token' }, { status: 401 });
        }

        // Ideally fetch appointments for this specific patient.
        // For demonstration, we fetch all appointments or just for Patient_ID 1.
        
        const [rows] = await pool.query(
            `SELECT a.Appointment_ID, a.AppointmentDate, a.Status, d.FirstName, d.LastName, dep.Name as Department
             FROM appointment a
             JOIN doctor d ON a.Doctor_ID = d.Doctor_ID
             LEFT JOIN department dep ON d.Dept_ID = dep.Dept_ID
             ORDER BY a.AppointmentDate DESC`
        );

        return NextResponse.json({ success: true, appointments: rows });

    } catch (error) {
        return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
    }
}
