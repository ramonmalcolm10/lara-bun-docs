<?php

namespace App\Http\Controllers;

use RamonMalcolm\LaraBun\Rsc\RscResponse;

class DocsController extends Controller
{
    /** @var array<string, array{title: string, description: string}> */
    private const PAGES = [
        'installation' => [
            'title' => 'Installation',
            'description' => 'Install LaraBun in your Laravel project. Requirements, Composer setup, JavaScript dependencies, and running the Bun worker.',
        ],
        'configuration' => [
            'title' => 'Configuration',
            'description' => 'Configure LaraBun\'s socket path, worker count, SSR, RSC, callables, and entry points via config/bun.php.',
        ],
        'how-it-works' => [
            'title' => 'How It Works',
            'description' => 'LaraBun\'s architecture: Unix socket bridge, length-prefixed frame protocol, Bun worker model, and request flow.',
        ],
        'inertia-ssr' => [
            'title' => 'Inertia SSR',
            'description' => 'Enable server-side rendering for Inertia.js via LaraBun\'s BunSsrGateway. Build the SSR bundle and configure workers.',
        ],
        'rsc' => [
            'title' => 'React Server Components',
            'description' => 'Build React Server Components with LaraBun. Server components, client components, layouts, streaming, and Flight payloads.',
        ],
        'php-callables' => [
            'title' => 'PHP Callables',
            'description' => 'Call PHP from JavaScript with LaraBun callables. Auto-discovery, explicit registration, and the php() function.',
        ],
        'server-actions' => [
            'title' => 'Server Actions',
            'description' => 'Use the "use server" directive to create server actions. Call from client components with streaming results.',
        ],
        'validation' => [
            'title' => 'Validation',
            'description' => 'Handle Laravel validation errors in React. ValidationException flow, ServerValidationError, and error catching.',
        ],
        'static-generation' => [
            'title' => 'Static Generation',
            'description' => 'Pre-render RSC pages at build time with LaraBun. Static routes, the rsc:prerender command, and Docker integration.',
        ],
        'deployment' => [
            'title' => 'Deployment',
            'description' => 'Deploy LaraBun to production. Multi-worker setup, Docker, FrankenPHP, and VPS configuration.',
        ],
        'suspense-demo' => [
            'title' => 'Suspense Demo',
            'description' => 'Live demo of React Suspense streaming with LaraBun RSC. Watch async server components resolve in real time.',
        ],
    ];

    public function landing(): RscResponse
    {
        return rsc('LandingPage')
            ->layout('MarketingLayout')
            ->withViewData('title', 'LaraBun — Laravel + React Server Components')
            ->withViewData('description', 'LaraBun bridges Laravel and Bun via a Unix socket for React Server Components, Inertia SSR, streaming, PHP callables, and server actions.');
    }

    public function show(string $slug): RscResponse
    {
        abort_unless(array_key_exists($slug, self::PAGES), 404);

        $page = self::PAGES[$slug];
        $component = 'Docs'.str($slug)->studly()->toString();

        return rsc($component)
            ->layout('DocsLayout')
            ->withViewData('title', $page['title'].' — LaraBun Docs')
            ->withViewData('description', $page['description']);
    }
}
