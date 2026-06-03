<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\WrittenMessage;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class WrittenMessageController extends Controller
{
    public function publicShow(WrittenMessage $writtenMessage)
    {
        $writtenMessage->load('user:id,name,username');
        $writtenMessage->loadCount('comments');

        return Inertia::render('WrittenMessages/Show', [
            'writtenMessage' => $writtenMessage,
        ]);
    }

    public function share(Request $request)
    {
        $validated = $request->validate([
            'written_message_id' => 'required|exists:written_messages,id',
        ]);

        WrittenMessage::where('id', $validated['written_message_id'])
            ->increment('total_share');

        return response()->json([
            'success' => true,
        ]);
    }

    // Save Message
    public function store(Request $request)
    {
        if (!Auth::check()) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized',
            ], 401);
        }

        $validated = $request->validate([
            'message' => 'required|string',
            'publish_type' => 'required|in:public,private',
        ]);

        $message = WrittenMessage::create([
            'user_id' => Auth::id(),
            'message' => $validated['message'],
            'publish_type' => $validated['publish_type'],
            // 1 = Published, 2 = Pending
            'status' => 2,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Message saved successfully',
            'data' => $message
        ]);
    }

    public function adminAllWrittenMessages(Request $request)
    {
        $search = $request->input('search');
        $perPage = (int) $request->input('perPage', 10);
        $perPage = $perPage > 0 ? min($perPage, 50) : 10;

        $query = WrittenMessage::query()->with('user:id,name,username,email');

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('message', 'like', '%' . $search . '%')
                    ->orWhereHas('user', function ($uq) use ($search) {
                        $uq->where('name', 'like', '%' . $search . '%')
                            ->orWhere('username', 'like', '%' . $search . '%')
                            ->orWhere('email', 'like', '%' . $search . '%');
                    });
            });
        }

        $messages = $query->orderByDesc('created_at')->paginate($perPage)->withQueryString();

        $statusOptions = [
            ['id' => 1, 'name' => 'Published'],
            ['id' => 2, 'name' => 'Pending'],
        ];

        return Inertia::render('Dashboard/WrittenMessages/Index', [
            'messages' => $messages->items(),
            'currentPage' => $messages->currentPage(),
            'lastPage' => $messages->lastPage(),
            'perPage' => $messages->perPage(),
            'totalMessages' => $messages->total(),
            'links' => $messages->links(),
            'statusOptions' => $statusOptions,
        ]);
    }

    public function adminUpdate(Request $request)
    {
        $validated = $request->validate([
            'id' => 'required|exists:written_messages,id',
            'publish_type' => 'sometimes|in:public,private',
            'status' => 'sometimes|integer|in:1,2',
        ]);

        $msg = WrittenMessage::findOrFail($validated['id']);

        if (array_key_exists('publish_type', $validated)) {
            $msg->publish_type = $validated['publish_type'];
        }

        if (array_key_exists('status', $validated)) {
            $msg->status = (int) $validated['status'];
        }

        $msg->save();

        return response()->json([
            'success' => true,
            'message' => 'Written message updated successfully',
            'data' => $msg,
        ]);
    }

    /**
     * Admin: set written message total_share only (use 0 to clear).
     */
    public function adminSetTotalShare(Request $request)
    {
        $validated = $request->validate([
            'id' => 'required|exists:written_messages,id',
            'total_share' => 'required|integer|min:0|max:99999999',
        ]);

        WrittenMessage::query()->whereKey($validated['id'])->update([
            'total_share' => (int) $validated['total_share'],
        ]);

        return response()->json([
            'success' => true,
            'total_share' => (int) $validated['total_share'],
        ]);
    }

    public function adminDelete(Request $request)
    {
        try {
            $validated = $request->validate([
                'id' => 'required|exists:written_messages,id',
            ]);

            $deleted = WrittenMessage::where('id', $validated['id'])->delete();

            if ($deleted === 0) {
                return response()->json([
                    'success' => false,
                    'message' => 'Written message not found or already deleted',
                ], 404);
            }

            return response()->json([
                'success' => true,
                'message' => 'Written message deleted successfully',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete written message: ' . $e->getMessage(),
            ], 500);
        }
    }

    // Get All Messages
    // public function index()
    // {
    //     $messages = WrittenMessage::latest()->get();

    //     return response()->json([
    //         'success' => true,
    //         'data' => $messages
    //     ]);
    // }
}
