<?php

use RamonMalcolm\LaraBun\Rsc\PageRoute;

return PageRoute::make()
    ->viewData(fn () => [
        'title' => 'LaraBun — Laravel + React Server Components',
        'description' => 'LaraBun bridges Laravel and Bun via a Unix socket for React Server Components, Inertia SSR, streaming, PHP callables, and server actions.',
    ]);
