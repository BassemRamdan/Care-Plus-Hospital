import pool from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const [docs] = await pool.query('SELECT COUNT(*) as c FROM doctor');
        const [pats] = await pool.query('SELECT COUNT(*) as c FROM patient');
        const [apps] = await pool.query('SELECT COUNT(*) as c FROM appointment');

        return NextResponse.json({
            success: true,
            stats: {
                doctors: docs[0].c || 0,
                patients: pats[0].c || 0,
                appointments: apps[0].c || 0
            }
        });
    } catch (error) {
        return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
    }
}
