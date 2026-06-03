<?php

namespace App\Http\Controllers;

use App\Contracts\Services\GiftTransactionServiceInterface;
use App\Contracts\Services\TwoFactorVerificationServiceInterface;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class GiftTransactionController extends Controller
{
    private GiftTransactionServiceInterface $giftTransactionService;
    private TwoFactorVerificationServiceInterface $verificationService;

    public function __construct(
        GiftTransactionServiceInterface       $giftTransactionService,
        TwoFactorVerificationServiceInterface $verificationService
    )
    {
        $this->giftTransactionService = $giftTransactionService;
        $this->verificationService = $verificationService;
    }

    public function store(Request $request)
    {
        $request->validate([
            'recipient_id' => 'required|exists:users,id',
            'gift_id' => 'required|exists:gifts,id',
            'validation_code' => 'nullable|numeric'
        ]);

        if ($this->giftTransactionService->requires2FA($request->input('gift_id')) && empty($request->validation_code)) {
            $mailSendingResponse = $this->verificationService->sendVerificationCode();

            if (isset($mailSendingResponse["error"]) && !is_null($mailSendingResponse["error"])) {
                return response()->json($this->verificationService->deleteLastGiftTransactionLog($request->ip()));
            }

            return response()->json(['requires_2fa' => true]);
        }

        return $this->proceedSending(
            recipientId: $request->recipient_id,
            giftId: $request->gift_id,
            validationCode: $request->validation_code
        );
    }

    public function proceedSending($recipientId = null, $giftId = null, $validationCode = null)
    {
        if (!is_null($validationCode)) {
            $verificationResult = $this->verificationService->verifyCode($validationCode);

            if (is_array($verificationResult) && isset($verificationResult['error'])) {
                return response()->json(['error' => $verificationResult['error']]);
            }
        }

        $result = $this->giftTransactionService->send(
            recipient_id: $recipientId,
            gift_id: $giftId
        );

        if (isset($result['error'])) {
            return response()->json(['error' => $result['error']]);
        }

        return response()->json([
            'success' => $result['success'] ?? false,
            'new_balance' => Auth::user()->balance,
        ]);
    }

    public function refillBalance(Request $request)
    {
        $request->validate([
            'amount' => 'required|numeric'
        ]);

        $result = $this->giftTransactionService->refillBalance($request->amount);

        if (isset($result['error'])) {
            return back()->with('error', $result['error']);
        }
        return response()->json([
            'success' => true,
            'message' => 'Balance refilled successfully!'
        ]);
    }
}
