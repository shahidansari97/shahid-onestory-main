<?php
namespace App\Http\Controllers;

use GuzzleHttp\Client;
use Illuminate\Http\Request;
use GuzzleHttp\Exception\RequestException;

class ImageGenerationController extends Controller
{
    public function generateImage(Request $request)
    {
        try {
            $client = new Client();
            $response = $client->post('https://api.replicate.com/v1/models/black-forest-labs/flux-pro/predictions', [
                'headers' => [
                    'Authorization' => 'Bearer ' . env('REPLICATE_API_TOKEN'),
                    'Content-Type' => 'application/json',
                ],
                'json' => [
                    'input' => [
                        'prompt' => $request->input('prompt'),
                        'width' => $request->input('width', 1024),
                        'height' => $request->input('height', 1024),
                    ],
                ],
            ]);

            return $response->getBody()->getContents();
        } catch (RequestException $e) {
            return response()->json(['error' => 'Failed to generate image', 'details' => $e->getMessage()], 500);
        }
    }

    public function checkImageStatus($id)
    {
        try {
            $client = new Client();
            $response = $client->get("https://api.replicate.com/v1/predictions/{$id}", [
                'headers' => [
                    'Authorization' => 'Bearer ' . env('REPLICATE_API_TOKEN'),
                    'Content-Type' => 'application/json',
                ],
            ]);

            $responseData = json_decode($response->getBody()->getContents(), true);

            return response()->json($responseData);
        } catch (RequestException $e) {
            return response()->json(['error' => 'Failed to check image status', 'details' => $e->getMessage()], 500);
        }
    }
}
