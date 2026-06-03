<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\BlacklistedWord;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BlacklistedWordController extends Controller
{
    public function index(Request $request)
    {
        $perPage = 50;
        $words = BlacklistedWord::paginate($perPage);

        return Inertia::render('Dashboard/BlacklistedWords', [
            'words' => $words->items(),
            'pagination' => [
                'currentPage' => $words->currentPage(),
                'lastPage' => $words->lastPage(),
                'perPage' => $words->perPage(),
                'total' => $words->total(),
            ],
        ]);
    }

    public function store(Request $request)
    {
        $request->validate(['word' => 'required|string|unique:blacklisted_words,word']);

        $word = BlacklistedWord::create($request->only('word'));

        return response()->json(['word' => $word, 'message' => 'Word added to blacklist!'], 200);
    }

    public function destroy(BlacklistedWord $blacklistedWord)
    {
        $blacklistedWord->delete();
        return response()->json(['message' => 'Word deleted successfully.']);
    }
}
