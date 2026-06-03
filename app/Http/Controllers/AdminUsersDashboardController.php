<?php

namespace App\Http\Controllers;

use App\Contracts\Services\AdminUsersDashboardServiceInterface;
use App\Contracts\Services\AdminNotificationInterface;
use App\Http\Requests\ProfileUpdateRequest;
use App\Models\StoryStatus;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminUsersDashboardController extends Controller
{
    private AdminUsersDashboardServiceInterface $adminUsersDashboardService;
    private AdminNotificationInterface $adminNotificationService;

    public function __construct(AdminUsersDashboardServiceInterface $adminUsersDashboardService, AdminNotificationInterface $adminNotificationService)
    {
        $this->adminUsersDashboardService = $adminUsersDashboardService;
        $this->adminNotificationService = $adminNotificationService;
    }

    public function index(Request $request)
    {
        $search = $request->input('search');
        $sort = $request->input('sort', 'asc');
        $filter = $request->input('filter', 'all');

        $users = $this->adminUsersDashboardService->getPaginatedUsers(search: $search, sort: $sort, quantity: 15, filter: $filter);
        $userCounts = $this->adminUsersDashboardService->getUserCounts();
        $todayUsers = $this->adminUsersDashboardService->getPaginatedUsers(
            search: null,
            sort: $sort,
            quantity: 15,
            filter: 'today'
        );

        return Inertia::render('Dashboard/Users/Index', [
            'currentUsers' => $users->items(),
            'totalUsers' => $users->total(),
            'currentPage' => $users->currentPage(),
            'lastPage' => $users->lastPage(),
            'perPage' => $users->perPage(),
            'links' => $users->links(),
            'totalUsersCount' => $userCounts['total'],
            'totalNormalUsers' => $userCounts['normal'],
            'totalCreatorUsers' => $userCounts['creator'],
            // Use the same query logic as the list's "today" filter
            // so card and list always match.
            'todaySignups' => $todayUsers->total(),
            'filter' => $filter,
        ]);
    }

    public function show(int $id)
    {
        $user = $this->adminUsersDashboardService->getUserById($id);

        if (!$user) {
            return redirect()->route('admin.users.index')->with('error', 'User not found.');
        }

        $storyStatuses = StoryStatus::select(['id', 'name'])->get();

        return Inertia::render('Dashboard/Users/Show', [
            'user' => $user,
            'storyStatuses' => $storyStatuses,
        ]);
    }

    public function edit(int $id)
    {
        $user = $this->adminUsersDashboardService->getUserById($id);

        if (!$user) {
            return redirect()->route('admin.users.index')->with('error', 'User not found.');
        }

        return Inertia::render('Dashboard/Users/Edit', [
            'user' => $user,
        ]);
    }

    public function update(ProfileUpdateRequest $request, int $id): RedirectResponse
    {
        $validatedProfileData = $request->validated();
        $updated = $this->adminUsersDashboardService->updateUser(id: $id, data: $validatedProfileData);

        if (!$updated) {
            return redirect()->route('admin.users.index')->with('error', 'User not found.');
        }

        return redirect()->back()->with('message', 'User updated successfully.');
    }

    public function delete(int $id)
    {
        return $this->adminUsersDashboardService->deleteUser(id: $id);
    }

    public function updateStatus(Request $request, int $id)
    {
        $activeStatus = $request->input('active_status', 0);
        $result = $this->adminUsersDashboardService->updateUserStatus(id: $id, activeStatus: $activeStatus);

        if ($result) {
            return response()->json(['success' => 'User status updated successfully.'], 200);
        }

        return response()->json(['error' => 'User not found.'], 404);
    }

    public function updateCreatorStatus(Request $request, int $id)
    {
        $creatorStatus = $request->input('creator_status', 0);
        $result = $this->adminUsersDashboardService->updateCreatorStatus(id: $id, creatorStatus: $creatorStatus);

        if ($result) {
            $user = User::where('id', $id)->first();
            $this->adminNotificationService->notifyAdmin($user, 'creator_upgraded', $request);
            return response()->json(['success' => 'Creator status updated successfully.'], 200);
        }

        return response()->json(['error' => 'User not found.'], 404);
    }
}
