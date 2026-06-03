<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use App\Models\Voting\Answer;
use App\Models\Voting\Variant;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Cashier\Billable;
use Spatie\Permission\Traits\HasRoles;

class User extends Authenticatable
{
    use HasFactory, HasRoles, Notifiable, Billable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'username',
        'avatar',
        'cover_photo',
        'generation',
        'visibility',
        'world_message',
        'country',
        'city',
        'story',
        'preferences',
        'email',
        'facebook_id',
        'google_id',
        'password',
        'balance',
        'two_factor_secret',
        'paypal_id',
        'paypal_email',
        'is_contestant',
        'is_creator',
        'active_status',
        'creator_status',
        'phone_number',
        'youtube_channel',
        'tiktok_profile',
        'instagram_username',
        'other_social_links',
        'creator_category',
        'total_audience_size',
        'content_description',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'is_creator' => 'boolean',
        ];
    }

    public function stories()
    {
        return $this->hasMany(Story::class, 'user_id', 'id');
    }

    public function movies()
    {
        return $this->hasMany(Movie::class, 'user_id', 'id');
    }

    protected function preferences(): Attribute
    {
        return Attribute::make(
            get: fn ($value) => json_decode($value, true),
            set: fn ($value) => json_encode($value),
        );
    }

    protected function avatar(): Attribute
    {
        return Attribute::make(
            get: fn ($value) => $this->normalizeMediaPath($value, 'users-avatar'),
        );
    }

    protected function coverPhoto(): Attribute
    {
        return Attribute::make(
            get: fn ($value) => $this->normalizeMediaPath($value, 'cover-images'),
        );
    }
    public function answers()
    {
        return $this->hasMany(Answer::class, 'user_id', 'id');
    }

    public function variants()
    {
        return $this->hasMany(Variant::class, 'user_id', 'id');
    }

    public function giftTransactionsSent()
    {
        return $this->hasMany(GiftTransaction::class, 'sender_id', 'id');
    }

    public function giftTransactionsReceived()
    {
        return $this->hasMany(GiftTransaction::class, 'recipient_id', 'id');
    }

    public function topUps()
    {
        return $this->hasMany(TopUp::class, 'user_id', 'id');
    }

    public function withdrawals()
    {
        return $this->hasMany(Withdrawal::class, 'user_id', 'id');
    }

    public function donations()
    {
        return $this->hasMany(Donation::class, 'user_id', 'id');
    }

    public function giftTransactionLogs()
    {
        return $this->hasMany(GiftTransactionLog::class, 'sender_id', 'id');
    }

    public function followers()
    {
        return $this->belongsToMany(User::class, 'follows', 'following_id', 'follower_id');
    }

    public function following()
    {
        return $this->belongsToMany(User::class, 'follows', 'follower_id', 'following_id');
    }

    public function follow(User $user)
    {
        $this->following()->attach($user->id);
    }

    public function unfollow(User $user)
    {
        $this->following()->detach($user->id);
    }

    public function isFollowing(User $user)
    {
        return $this->following()->where('following_id', $user->id)->exists();
    }

    /**
     * Role names for frontend (e.g. showing Creator Dashboard link).
     */
    public function getRoleNamesAttribute(): array
    {
        return $this->getRoleNames()->toArray();
    }

    private function normalizeMediaPath($value, string $folder): ?string
    {
        if ($value === null) {
            return null;
        }

        $value = trim((string) $value);
        if ($value === '') {
            return '';
        }

        $query = '';
        if (str_contains($value, '?')) {
            [$value, $query] = explode('?', $value, 2);
            $query = '?' . $query;
        }

        $appUrl = rtrim((string) config('app.url'), '/');
        if ($appUrl !== '' && str_starts_with($value, $appUrl)) {
            $value = substr($value, strlen($appUrl)) ?: '';
        }

        if (str_starts_with($value, 'http://') || str_starts_with($value, 'https://')) {
            $path = parse_url($value, PHP_URL_PATH);
            if (is_string($path) && $path !== '') {
                $value = $path;
            }
        }

        if (
            str_starts_with($value, '/storage/') ||
            str_starts_with($value, '/img/') ||
            str_starts_with($value, 'data:') ||
            str_starts_with($value, 'blob:')
        ) {
            return $value . $query;
        }

        return '/storage/' . trim($folder, '/') . '/' . basename($value) . $query;
    }
}
