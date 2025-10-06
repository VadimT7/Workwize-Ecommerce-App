<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

/**
 * Authentication controller - handles user registration and login
 */
class AuthController extends Controller
{
    /**
     * Register a new user (customer or supplier)
     */
    public function register(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed',
            'role' => 'required|in:customer,supplier',
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => $request->role,
        ]);

        $token = $user->createToken('auth-token')->plainTextToken;

        return response()->json([
            'user' => $user,
            'token' => $token,
        ], 201);
    }

    /**
     * Login user
     */
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        $user = User::where('email', $request->email)->first();

        if (! $user || ! Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['The provided credentials are incorrect.'],
            ]);
        }

        // Check if user account has been deleted/anonymized
        if ($user->isAnonymized() || $user->trashed()) {
            throw ValidationException::withMessages([
                'email' => ['This account has been deleted and cannot be accessed.'],
            ]);
        }

        $token = $user->createToken('auth-token')->plainTextToken;

        return response()->json([
            'user' => $user,
            'token' => $token,
        ]);
    }

    /**
     * Logout user
     */
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Logged out successfully',
        ]);
    }

    /**
     * Get current user
     */
    public function user(Request $request)
    {
        return response()->json($request->user());
    }

    /**
     * Delete user account (GDPR compliance)
     * Anonymizes user data while preserving orders for tax audit requirements
     */
    public function deleteAccount(Request $request)
    {
        $user = $request->user();

        // Revoke all tokens to prevent further access
        $user->tokens()->delete();

        // Anonymize user data instead of hard deletion
        // This preserves orders and products for tax audit requirements
        $user->anonymizeForDeletion();

        // Soft delete the user record
        $user->delete();

        return response()->json([
            'message' => 'Account deleted successfully. Your personal information has been removed while preserving order records for tax compliance.',
        ], 200);
    }
}

