<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;

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

    // PUT /users/{id}
    public function update(Request $request, $id)
    {
        $user = User::findOrFail($id);

        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'email' => 'sometimes|required|string|email|unique:users,email,' . $user->id,
            'password' => 'nullable|string|min:6',
            'picture' => 'nullable|string',
        ]);

        if (isset($validated['password'])) {
            $validated['password'] = Hash::make($validated['password']);
        }

        $user->update($validated);

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
