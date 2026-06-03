<?php

namespace App\Http\Controllers;

use App\Contracts\Services\VariantServiceInterface;
use App\Models\Voting\Variant;
use Illuminate\Http\Request;
use Inertia\Inertia;

class VariantController extends Controller
{
    private VariantServiceInterface $variantService;

    public function __construct(VariantServiceInterface $variantService)
    {
        $this->variantService = $variantService;
    }

    public function index()
    {
        $variants = $this->variantService->getAllVariants();

        return Inertia::render('Dashboard/Variants/Index', [
            'variants' => $variants,
        ]);
    }

    public function create()
    {
        return Inertia::render('Dashboard/Variants/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'statement' => 'required|string|max:255',
            'target' => 'required|numeric|min:0',
        ]);

        $this->variantService->createVariant($validated);

        return redirect()->route('admin.variant.index')->with('message', 'Variant successfully created.');
    }

    public function show($variantId)
    {
        $variant = Variant::with(['answers.user', 'donations.user'])->find($variantId);

        return Inertia::render('Dashboard/Variants/Show', [
            'variant' => $variant
        ]);
    }

    public function edit($variantId)
    {
        $variant = $this->variantService->getVariantById($variantId);

        if (!$variant) {
            return redirect()->route('admin.variant.index')->with('error', 'Variant not found.');
        }

        return Inertia::render('Dashboard/Variants/Edit', [
            'variant' => $variant,
        ]);
    }

    public function update(Request $request, $variantID)
    {
        $validated = $request->validate([
            'statement' => 'required|string|max:255',
            'target' => 'required|numeric|min:0',
        ]);

        $this->variantService->updateVariant($variantID, $validated);

        return redirect()->route('admin.variant.index')->with('message', 'Variant успішно оновлено.');
    }

    public function delete(Request $request)
    {
        $validatedId = $request->validate([
            'variant_id' => 'required|exists:variants,id'
        ]);

        $deleteResult = $this->variantService->deleteVariant($validatedId['variant_id']);

        if (isset($deleteResult['error'])) {
            return redirect()->route('admin.variant.index')->with('error', $deleteResult['error']);
        }

        return redirect()->route('admin.variant.index')->with('success', 'Variant deleted successfully.');
    }
}
