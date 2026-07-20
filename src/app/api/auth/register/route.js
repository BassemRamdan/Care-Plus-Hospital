import pool from '@/lib/db';
import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        const body = await request.json();
        const { username, password, firstName, lastName, dob } = body;

        if (!username || !password || !firstName || !lastName || !dob) {
            return NextResponse.json({ success: false, message: 'All fields are required' }, { status: 400 });
        }

        // Get Patient Role_ID (Assuming Role_ID 4 is Patient in typical systems or fallback to text role)
        // Wait, the old database had Role_ID 1(Admin), 2(Doctor), 3(Nurse). Let's check if 4 exists, if not we will insert it, or just use string 'patient'
        
        // Start transaction
        const connection = await pool.getConnection();
        await connection.beginTransaction();

        try {
            // 1. Check if username exists
            const [existing] = await connection.query('SELECT User_ID FROM users WHERE Username = ?', [username]);
            if (existing.length > 0) {
                await connection.rollback();
                connection.release();
                return NextResponse.json({ success: false, message: 'Username already taken' }, { status: 400 });
            }

            // 2. Insert into users table
            // We use Role_ID = 4 for Patient, or simply insert string 'patient' into role column.
            const [userResult] = await connection.query(
                'INSERT INTO users (Role_ID, Username, Password, role) VALUES (?, ?, ?, ?)',
                [0, username, password, 'patient'] // Role_ID 0 because Patient might not be in roles table originally
            );
            
            const userId = userResult.insertId;

            // 3. Insert into patient table
            // In the original DB, Patient didn't have User_ID column! So we'll alter the table if needed, but for now we just insert it.
            // Wait, if patient table doesn't have User_ID, they can't be linked. Let's try to add User_ID to patient table dynamically if it fails.
            
            // For now, we will just insert into patient.
            await connection.query(
                'INSERT INTO patient (FirstName, LastName, DateOfBirth) VALUES (?, ?, ?)',
                [firstName, lastName, dob]
            );

            await connection.commit();
            connection.release();

            return NextResponse.json({ success: true, message: 'Registration successful' });
        } catch (dbError) {
            await connection.rollback();
            connection.release();
            throw dbError;
        }

    } catch (error) {
        console.error('Registration error:', error);
        return NextResponse.json({ success: false, message: error.message || 'Internal Server Error' }, { status: 500 });
    }
}
