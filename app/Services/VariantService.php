<?php

namespace App\Services;

use App\Contracts\Services\VariantServiceInterface;
use App\Models\Voting\Question;
use App\Models\Voting\Variant;

class VariantService implements VariantServiceInterface
{
    public function getAllVariants()
    {
        return Variant::all();
    }

    public function createVariant(array $data): Variant
    {
        return Variant::create($data);
    }

    public function getVariantById($variantId)
    {
        return Variant::find($variantId);
    }


    public function updateVariant($variant_id, array $data): Variant
    {
        $variant = Variant::find($variant_id);
        $variant->update($data);
        return $variant;
    }

    public function deleteVariant($variant_id)
    {
        $variant = Variant::find($variant_id);
        if (!$variant) {
            return ['error' => 'Variant not found.'];
        }
        $variant->delete();

        return ['success' => 'Variant has been removed.'];
    }
}
