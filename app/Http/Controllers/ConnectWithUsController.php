<?php

namespace App\Http\Controllers;

use App\Contracts\Services\ConnectWithUsServiceInterface;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Inertia\Inertia;

class ConnectWithUsController extends Controller
{
    private ConnectWithUsServiceInterface $service;

    public function __construct(ConnectWithUsServiceInterface $service)
    {
        $this->service = $service;
    }

    public function index()
    {
        return Inertia::render('Connect/Index', [
            'content' => $this->service->getStructuredContent(),
        ]);
    }

    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'first_name' => 'required|max:255',
            'phone'      => 'required|max:20',
            'email'      => 'required|email',
            'category'   => 'required',
            'message'    => 'required|min:3|max:2500',
        ]);

        $recipientEmail = $this->service->getRecipientEmail();

        $text = "
            First Name: {$validatedData['first_name']}
            Phone: {$validatedData['phone']}
            Email: {$validatedData['email']}
            Category: {$validatedData['category']}

            Message:
            {$validatedData['message']}
        ";

        Mail::raw($text, fn($message) => $message
            ->subject('Connect With Us Request')
            ->to($recipientEmail)
        );

        return redirect()->back()->with('success', 'Your request has been sent successfully!');
    }

    public function edit()
    {
        return Inertia::render('Dashboard/Connect/Edit', [
            'data' => $this->service->getStructuredContent(),
        ]);
    }

    public function update(Request $request)
    {
        $validated = $request->validate([
            'mainContent'                   => 'required|array',
            'mainContent.title'             => 'nullable|string|max:255',
            'mainContent.description'       => 'nullable|string',
            'mainContent.email'             => 'nullable|email',
            'mainContent.dmcaEmail'         => 'nullable|email',
            'mainContent.contactText'       => 'nullable|string',
            'mainContent.dmcaText'          => 'nullable|string',
            'socialMedia'                   => 'nullable|array',
            'socialMedia.twitter'           => 'nullable|string',
            'socialMedia.youtube'           => 'nullable|string',
            'socialMedia.instagram'         => 'nullable|string',
            'socialMedia.facebook'          => 'nullable|string',
            'emailSettings.recipientEmail'  => 'required|email',
            'categories'                    => 'nullable|array',
        ]);

        $this->service->updateContent($validated);

        return redirect()->back()->with('message', 'Content updated successfully!');
    }
}
