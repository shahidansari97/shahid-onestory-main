<?php

namespace App\Http\Controllers;

use App\Contracts\Services\DonatePageServiceInterface;
use App\Contracts\Services\TransactionPageServiceInterface;
use App\Models\Commission;
use App\Models\Donation;
use App\Models\Percent;
use App\Models\Voting\Variant;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class TransactionPageController extends Controller
{
    private TransactionPageServiceInterface $transactionPageService;
    private DonatePageServiceInterface $donatePageService;

    public function __construct(
        TransactionPageServiceInterface $transactionPageService,
        DonatePageServiceInterface $donatePageService
    ) {
        $this->transactionPageService = $transactionPageService;
        $this->donatePageService = $donatePageService;
    }

    // public function index()
    // {
    //     $user = Auth::user();
    //     $options = [
    //         'sort' => request()->input('sort', 'created_at'),
    //         'direction' => request()->input('direction', 'asc'),
    //     ];

    //     $sentGiftTransactions = $this->transactionPageService->getSentGiftTransactions($user->id, $options);
    //     $receivedGiftTransactions = $this->transactionPageService->getReceivedGiftTransactions($user->id, $options);
    //     $donations = $this->transactionPageService->getUserDonations($user->id, $options);
    //     $topUps = $this->transactionPageService->getUserTopUps($user->id, $options);
    //     $withdrawals = $this->transactionPageService->getUserWithdrawals($user->id, $options);
    //     $balance_divider = Percent::first()->balance_divider;
    //     $fromStripe = request()->query('fromStripe', false);

    //     return Inertia::render('Profile/Transactions', [
    //         'sentGifts' => $sentGiftTransactions,
    //         'receivedGifts' => $receivedGiftTransactions,
    //         'donations' => $donations,
    //         'top_ups' => $topUps,
    //         'withdrawals' => $withdrawals,
    //         'balance_divider' => $balance_divider,
    //         'fromStripe' => $fromStripe,
    //     ]);
    // }
    public function index()
    {
        $user = Auth::user();
        $options = [
            'sort' => request()->input('sort', 'created_at'),
            'direction' => request()->input('direction', 'desc'),
        ];

        $sentGiftTransactions = $this->transactionPageService->getSentGiftTransactions($user->id, $options);
        $receivedGiftTransactions = $this->transactionPageService->getReceivedGiftTransactions($user->id, $options);
        $donations = $this->transactionPageService->getUserDonations($user->id, $options);
        $topUps = $this->transactionPageService->getUserTopUps($user->id, $options);
        $withdrawals = $this->transactionPageService->getUserWithdrawals($user->id, $options);
        $paypalWithdrawals = $this->transactionPageService->getUserPaypalWithdrawals($user->id, $options);
        $balance_divider = Percent::first()->balance_divider;
        $fromStripe = request()->query('fromStripe', false);

        return Inertia::render('Profile/Transactions', [
            'sentGifts' => $sentGiftTransactions,
            'receivedGifts' => $receivedGiftTransactions,
            'donations' => $donations,
            'top_ups' => $topUps,
            'withdrawals' => $withdrawals,
            'balance_divider' => $balance_divider,
            'fromStripe' => $fromStripe,
            'paypalWithdrawals' => $paypalWithdrawals,
        ]);
    }
    public function giftTransactions(Request $request)
    {
        $search = $request->get('search');
        $page = $request->get('page', 1);

        $transactions = $this->transactionPageService->getPaginatedTransactions($page, 15, $search);

        return Inertia::render('Dashboard/Transactions/Gifts', [
            'transactions' => $transactions->items(),
            'currentPage' => $transactions->currentPage(),
            'lastPage' => $transactions->lastPage(),
            'perPage' => $transactions->perPage(),
            'totalTransactions' => $transactions->total(),
            'search' => $search,
        ]);
    }


    public function donations(Request $request)
    {
        $search = $request->get('search');
        $page = $request->get('page', 1);

        $donations = $this->transactionPageService->getPaginatedDonations($page, 15, $search);

        return Inertia::render('Dashboard/Transactions/Donations', [
            'donations' => $donations->items(),
            'currentPage' => $donations->currentPage(),
            'lastPage' => $donations->lastPage(),
            'perPage' => $donations->perPage(),
            'totalDonations' => $donations->total(),
            'search' => $search,
        ]);
    }

    public function topUps(Request $request)
    {
        $search = $request->get('search');
        $page = $request->get('page', 1);

        $topUps = $this->transactionPageService->getPaginatedTopUps($page, 15, $search);

        return Inertia::render('Dashboard/Transactions/TopUps', [
            'topUps' => $topUps->items(),
            'currentPage' => $topUps->currentPage(),
            'lastPage' => $topUps->lastPage(),
            'perPage' => $topUps->perPage(),
            'totalTopUps' => $topUps->total(),
            'search' => $search,
        ]);
    }


    public function withdrawals(Request $request)
    {
        $search = $request->get('search');
        $page = $request->get('page', 1);

        $withdrawals = $this->transactionPageService->getPaginatedWithdrawals($page, 15, $search);

        return Inertia::render('Dashboard/Transactions/Withdrawals', [
            'withdrawals' => $withdrawals->items(),
            'currentPage' => $withdrawals->currentPage(),
            'lastPage' => $withdrawals->lastPage(),
            'perPage' => $withdrawals->perPage(),
            'totalWithdrawals' => $withdrawals->total(),
            'search' => $search,
        ]);
    }

    public function wallets()
    {
        $commission = Commission::first();
        $percents = Percent::first();
        $variants = Variant::all();

        $donatePageData = $this->donatePageService->getDonatePageData();
        $activeVariantId = $donatePageData['content']['variant_id'] ?? null;
        $activeVariant = Variant::find($activeVariantId) ?? null;
        $user = Auth::user();
        $options = [
            'sort' => request()->input('sort', 'created_at'),
            'direction' => request()->input('direction', 'desc'),
        ];
        $userDonations = $this->transactionPageService->getUserDonations($user->id, $options);

        return Inertia::render('Dashboard/Transactions/Wallets', [
            'founderFunds' => $commission->founder_funds,
            'toDonateFunds' => $commission->donation_funds,
            'charityFunds' => $commission->charity_funds,
            'founder_percent' => $percents->founder_percent,
            'donation_percent' => $percents->donation_percent,
            'coins_to_money_divider' => $percents->balance_divider,
            'variants' => $variants,
            'active_variant' => $activeVariant,
            'userDonations' => $userDonations,
        ]);
    }

    public function updatePercents(Request $request)
    {
        $request->validate([
            'founder_percent' => 'required|min:0|max:50|integer',
            'donation_percent' => 'required|min:0|max:50|integer',
            'coins_to_money_divider' => 'required|min:1|max:20|numeric',
        ]);

        $result = $this->transactionPageService->updatePercents(
            founder_percent: $request->input('founder_percent'),
            donation_percent: $request->input('donation_percent'),
            coins_to_money_divider: $request->input('coins_to_money_divider')
        );

        return response()->json(['success' => 'Percents updated successfully.']);
    }

    public function transferToMonthlyCause()
    {
        $commission = Commission::first();

        if (!$commission || $commission->donation_funds <= 0) {
            return response()->json(['error' => 'No funds available for transfer'], 400);
        }

        $amountToTransfer = $commission->donation_funds;


        $commission->charity_funds += $amountToTransfer;
        $commission->donation_funds = 0;

        $donatePageData = $this->donatePageService->getDonatePageData();
        $variantId = $donatePageData['content']['variant_id'] ?? null;

        if ($variantId) {
            $variant = Variant::find($variantId);
            if ($variant) {
                $variant->funds += $amountToTransfer;
                $variant->save();
            } else {
                return response()->json(['error' => 'Active variant not found'], 404);
            }
        } else {
            return response()->json(['error' => 'No active variant_id found'], 400);
        }

        $commission->save();

        Donation::create([
            'user_id' => Auth::id(),
            'funds' => $amountToTransfer,
            'variant_id' => $variantId,
        ]);

        return response()->json(['success' => "Successfully transferred $amountToTransfer to the Monthly Cause"]);
    }

    public function clearDonations()
    {
        $user = Auth::user();
        $result = $this->transactionPageService->clearUserDonations($user->id);

        if (isset($result['error'])) {
            return response()->json(['error' => $result['error']], 500);
        }

        return response()->json(['success' => $result['success']]);
    }

}
