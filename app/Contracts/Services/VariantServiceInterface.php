<?php

namespace App\Contracts\Services;

use App\Models\Voting\Variant;

interface VariantServiceInterface
{
    public function getAllVariants();
    public function createVariant(array $data): Variant;
    public function getVariantById($variantId);
    public function updateVariant($variant_id, array $data): Variant;
    public function deleteVariant($variant_id);
}
