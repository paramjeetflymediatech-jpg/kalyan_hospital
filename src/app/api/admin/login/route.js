import { NextResponse } from 'next/server';
import User from '@/models/User';
import { signToken } from '@/lib/auth';
import { cookies } from 'next/headers';
import bcrypt from 'bcryptjs';

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    // Find user in MySQL
    const user = await User.findOne({ where: { email } });

    const isMatch = user ? await bcrypt.compare(password, user.password) : false;

    if (!user || !isMatch) {
      return NextResponse.json({ 
        success: false, 
        message: 'Invalid credentials' 
      }, { status: 401 });
    }

    // Generate JWT
    const token = await signToken({ 
      id: user.id, 
      email: user.email, 
      role: user.role 
    });

    // Set cookie
    const cookieStore = await cookies();
    cookieStore.set('admin_session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 // 24 hours
    });

    return NextResponse.json({ 
      success: true, 
      message: 'Login successful' 
    });

  } catch (error) {
    console.error('Login API Error:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Internal server error' 
    }, { status: 500 });
  }
}
