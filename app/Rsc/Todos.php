<?php

namespace App\Rsc;

use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Str;

class Todos
{
    public function generate(): string
    {
        return Str::uuid()->toString();
    }

    public function list(string $sessionId): array
    {
        return Cache::get("todos:{$sessionId}", []);
    }
}
