<?php

namespace App\Rsc\Actions;

use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Str;

class TodoActions
{
    public function add(string $sessionId, string $title): array
    {
        $todos = Cache::get("todos:{$sessionId}", []);

        $todos[] = [
            'id' => Str::uuid()->toString(),
            'title' => $title,
            'done' => false,
        ];

        Cache::put("todos:{$sessionId}", $todos, now()->addMinutes(10));

        return $todos;
    }

    public function toggle(string $sessionId, string $todoId): array
    {
        $todos = Cache::get("todos:{$sessionId}", []);

        foreach ($todos as &$todo) {
            if ($todo['id'] === $todoId) {
                $todo['done'] = ! $todo['done'];
            }
        }

        Cache::put("todos:{$sessionId}", $todos, now()->addMinutes(10));

        return $todos;
    }

    public function delete(string $sessionId, string $todoId): array
    {
        $todos = Cache::get("todos:{$sessionId}", []);
        $todos = array_values(array_filter($todos, fn ($todo) => $todo['id'] !== $todoId));

        Cache::put("todos:{$sessionId}", $todos, now()->addMinutes(10));

        return $todos;
    }
}
