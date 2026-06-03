<?php
namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Http\Request;
class UserController extends Controller
{
    public function getAllUsers()
    {
        $users = User::where('id', '!=', Auth::id())->get();

        return response()->json([
            'users' => $users,
        ]);
    }
    public function destroy(Request $request)
    {
        $user = $request->user();
        $request->validate([
            'password' => 'required|string',
        ]);
        if (!Hash::check($request->password, $user->password)) {
            return back()->withErrors(['password' => 'Incorrect password.']);
        }
        session()->flash('message', 'Your account has been deleted successfully.');
        // Save a success message to session before logout
        // Session::flash('message', 'Your account has been deleted successfully.');
        // Logout and invalidate session
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();
        // Delete user
        $user->delete();
        // Redirect to login route with flash message
        return redirect()->route('login');
    }
}
