<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;

class UserController extends Controller
{
    // GET /users 
    public function index()
    {
        return User::all();
    }

    // GET /users/{id} 
    public function show($id)
    {
        $user = User::findOrFail($id);
        return response()->json($user);
    }

    // POST /users 
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|unique:users',
            'password' => 'required|string|min:6',
            'picture' => 'nullable|string',
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'picture' => $validated['picture'] ?? 'default.png',
        ]);

        return response()->json(['message' => 'User created successfully', 'user' => $user], 201);
    }

    /**
     * Menangani POST /users/{id} untuk proses UPDATE.
     * Ini adalah versi yang sudah diperbaiki untuk menangani file upload dengan benar.
     */
    public function update(Request $request, $id)
    {
        $user = User::findOrFail($id);

        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'email' => [
                'sometimes',
                'required',
                'string',
                'email',
                Rule::unique('users')->ignore($user->id),
            ],
            'password' => 'nullable|string|min:6|confirmed',
            'picture' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
        ]);

        // Ambil data yang akan diupdate dari request
        $updateData = $request->only('name', 'email');

        // PERBAIKAN LOGIKA FILE UPLOAD
        if ($request->hasFile('picture')) {
            // 1. Hapus gambar lama jika ada dan bukan gambar default
            // Gunakan getRawOriginal untuk mendapatkan path mentah dari database, bukan URL
            $currentPicturePath = $user->getRawOriginal('picture');
            if ($currentPicturePath && $currentPicturePath !== 'default.png') {
                Storage::delete($currentPicturePath);
            }

            // 2. Simpan gambar baru dan dapatkan path-nya
            $path = $request->file('picture')->store('public/pictures');

            // 3. Simpan PATH ke database, BUKAN URL
            $updateData['picture'] = $path;
        }

        // Update password hanya jika diisi
        if (!empty($validated['password'])) {
            $updateData['password'] = Hash::make($validated['password']);
        }

        // Lakukan update
        $user->update($updateData);

        // Muat ulang user untuk memastikan accessor 'picture' mengembalikan URL yang benar
        $user->refresh();

        return response()->json(['message' => 'User updated successfully', 'user' => $user]);
    }

    // DELETE /users/{id}
    public function destroy($id)
    {
        $user = User::findOrFail($id);
        $user->delete();
        return response()->json(['message' => 'User deleted successfully']);
    }

    public function topAuthors()
    {
        $users = User::select('id', 'name', 'picture')
            ->withCount('articles')
            ->orderByDesc('articles_count')
            ->limit(5)
            ->get();

        return response()->json($users);
    }
}