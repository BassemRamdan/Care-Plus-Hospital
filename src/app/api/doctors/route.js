import pool from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const [rows] = await pool.query(
            `SELECT d.Doctor_ID, d.FirstName, d.LastName, d.Specialization, dep.Name as Department
             FROM doctor d
             LEFT JOIN department dep ON d.Dept_ID = dep.Dept_ID`
        );
        return NextResponse.json({ success: true, doctors: rows });
    } catch (error) {
        console.error('Failed to fetch doctors:', error);
        return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 });
    }
}
