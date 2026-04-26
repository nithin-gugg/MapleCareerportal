'use server';

import { db } from '@/lib/db';
import { encrypt } from '@/lib/auth';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import bcrypt from 'bcryptjs';

export async function loginAction(formData: FormData) {
  try {
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    if (!email || !password) {
      return { error: 'Email and password are required' };
    }

    const user = await db.user.findUnique({
      where: { email },
    });

    if (!user || user.role !== 'ADMIN') {
      return { error: 'Invalid credentials or unauthorized' };
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return { error: 'Invalid credentials' };
    }

    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 1 day
    const token = await encrypt({ id: user.id, role: user.role });

    cookies().set('admin_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      expires,
      sameSite: 'lax',
      path: '/',
    });

    return { success: true };
  } catch (error) {
    console.error('Login action failed:', error);
    return { error: 'An unexpected error occurred' };
  }
}

export async function logoutAction() {
  cookies().delete('admin_token');
  redirect('/admin/login');
}
