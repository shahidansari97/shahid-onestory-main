<?php

namespace App\Services;

use App\Contracts\Services\TransactionPageServiceInterface;
use App\Models\Commission;
use App\Models\Donation;
use App\Models\GiftTransaction;
use App\Models\PayPalWithdrawal;
use App\Models\Percent;
use App\Models\TopUp;
use App\Models\Withdrawal;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class TransactionPageService implements TransactionPageServiceInterface
{
    public function getSentGiftTransactions(int $userId, array $options): Collection
    {
        return GiftTransaction::with(['recipient', 'gift'])
            ->where('sender_id', $userId)
            ->orderBy($options['sort'], $options['direction'])
            ->get();
    }

    public function getReceivedGiftTransactions(int $userId, array $options = null): Collection
    {
        return GiftTransaction::with(['sender', 'gift'])
            ->where('recipient_id', $userId)
            ->orderBy($options['sort'], $options['direction'])
            ->get();
    }

    public function getUserDonations(int $userId, array $options = null): Collection
    {
        return Donation::with('variant')
            ->where('user_id', $userId)
            ->orderBy($options['sort'], $options['direction'])
            ->get();
    }

    public function getUserTopUps(int $userId, array $options = null): Collection
    {
        return TopUp::where('user_id', $userId)
            ->orderBy($options['sort'], $options['direction'])
            ->get();
    }
    public function getUserWithdrawals(int $userId, array $options = null): Collection
    {
        return Withdrawal::where('user_id', $userId)
            ->orderBy($options['sort'], $options['direction'])
            ->get();
    }

    public function getPaginatedTransactions(int $page = 1, int $perPage = 15, ?string $search = null): LengthAwarePaginator
    {
        $query = GiftTransaction::with(['sender', 'recipient', 'gift']);

        if ($search) {
            $query->where(function($q) use ($search) {
                $q->whereHas('sender', function($q2) use ($search) {
                    $q2->where('name', 'like', "%{$search}%");
                })
                    ->orWhereHas('recipient', function($q3) use ($search) {
                        $q3->where('name', 'like', "%{$search}%");
                    })
                    ->orWhereHas('gift', function($q4) use ($search) {
                        $q4->where('name', 'like', "%{$search}%");
                    });
            });
        }

        return $query->orderBy('created_at', 'desc')
            ->paginate($perPage, ['*'], 'page', $page);
    }

    public function getPaginatedDonations(int $page = 1, int $perPage = 15, ?string $search = null): LengthAwarePaginator
    {
        $query = Donation::with(['user', 'variant']);

        if ($search) {
            $query->where(function($q) use ($search) {
                $q->whereHas('user', function($q2) use ($search) {
                    $q2->where('username', 'like', "%{$search}%");
                })
                    ->orWhereHas('variant', function($q3) use ($search) {
                        $q3->where('statement', 'like', "%{$search}%");
                    });
            });
        }

        return $query->orderBy('created_at', 'desc')
            ->paginate($perPage, ['*'], 'page', $page);
    }

    public function getPaginatedTopUps(int $page = 1, int $perPage = 15, ?string $search = null): LengthAwarePaginator
    {
        $query = TopUp::with(['user']);

        if ($search) {
            $query->whereHas('user', function($q) use ($search) {
                $q->where('username', 'like', "%{$search}%");
            });
        }

        return $query->orderBy('created_at', 'desc')
            ->paginate($perPage, ['*'], 'page', $page);
    }

    public function getPaginatedWithdrawals(int $page = 1, int $perPage = 15, ?string $search = null): LengthAwarePaginator
    {
        $query = Withdrawal::with(['user']);

        if ($search) {
            $query->where(function($q) use ($search) {
                $q->whereHas('user', function($qUser) use ($search) {
                    $qUser->where('username', 'like', "%{$search}%");
                })
                    ->orWhere('stripe_transaction_id', 'like', "%{$search}%")
                    ->orWhere('stripe_account_id', 'like', "%{$search}%");
            });
        }

        return $query->orderBy('created_at', 'desc')
            ->paginate($perPage, ['*'], 'page', $page);
    }



    public function updatePercents(int $founder_percent, int $donation_percent, int $coins_to_money_divider): array
    {
        $percents = Percent::first();

        if (empty($percents->toArray())) {
            return ["error" => "Percent table is empty"];
        }

        $percents->founder_percent = $founder_percent;
        $percents->donation_percent = $donation_percent;
        $percents->balance_divider = $coins_to_money_divider;
        $percents->save();

        return ["success" => "You have updated percents"];
    }
    public function clearUserDonations(int $userId): array
    {
        DB::beginTransaction();

        try {
            $commission = Commission::first();

            if (!$commission || $commission->charity_funds <= 0) {
                throw new \Exception('No funds to reset');
            }

            $amount = $commission->charity_funds;
            $commission->charity_funds = 0;
            $commission->save();

            Donation::create([
                'user_id' => Auth::id(),
                'funds' => $amount,
                'variant_id' => null,
                'type' => 'reset_charity_funds',
            ]);

            DB::commit();

            return ['success' => 'Charity funds reset successfully.'];
        } catch (\Exception $e) {
            DB::rollBack();
            return ['error' => 'Failed to reset charity funds.'];
        }
    }
    public function getUserPaypalWithdrawals(int $userId, array $options = null): Collection
    {
        return PayPalWithdrawal::where('user_id', $userId)
            ->orderBy($options['sort'], $options['direction'])
            ->get();
    }
}
