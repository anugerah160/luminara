<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    /**
     * Handle user registration.
     */
    public function register(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:6|confirmed',
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

        return response()->json(['message' => 'User registered successfully'], 201);
    }

    /**
     * Handle user login.
     * Ini adalah versi yang sudah diperbaiki.
     */
    public function login(Request $request)
    {
        // 1. Validasi input
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        // 2. Coba lakukan otentikasi
        if (!Auth::attempt($request->only('email', 'password'))) {
            // Jika gagal, kirim response error
            throw ValidationException::withMessages([
                'email' => ['The provided credentials do not match our records.'],
            ]);
        }

        // 3. Jika berhasil, ambil data user yang sedang login
        /** @var \App\Models\User $user */
        $user = $request->user();
        
        // 4. Buat token baru
        $token = $user->createToken('auth_token')->plainTextToken;

        // 5. Kirim response yang berisi token DAN objek user yang lengkap
        return response()->json([
            'token' => $token,
            'user'  => $user, // Ini akan menyertakan nama, email, dan URL gambar
        ], 200);
    }

    /**
     * Get the authenticated User.
     */
    public function user(Request $request)
    {
        return $request->user();
    }
    
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();
        return response()->json(['message' => 'Logged out successfully']);
    }
}