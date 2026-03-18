<?php

use LaraBun\Rsc\PageRoute;

return PageRoute::make()
    ->staticPaths([
        'installation',
        'configuration',
        'how-it-works',
        'inertia-ssr',
        'rsc',
        'php-callables',
        'server-actions',
        'file-uploads',
        'authorization',
        'validation',
        'metadata',
        'ppr',
        'static-generation',
        'react-compiler',
        'route-interception',
        'typed-routes',
        'deployment',
    ])
    ->viewData(fn (string $slug) => [
        'title' => match ($slug) {
            'installation' => 'Installation — LaraBun Docs',
            'configuration' => 'Configuration — LaraBun Docs',
            'how-it-works' => 'How It Works — LaraBun Docs',
            'inertia-ssr' => 'Inertia SSR — LaraBun Docs',
            'rsc' => 'React Server Components — LaraBun Docs',
            'php-callables' => 'PHP Callables — LaraBun Docs',
            'server-actions' => 'Server Actions — LaraBun Docs',
            'file-uploads' => 'File Uploads — LaraBun Docs',
            'authorization' => 'Authorization — LaraBun Docs',
            'validation' => 'Validation — LaraBun Docs',
            'metadata' => 'Page Metadata — LaraBun Docs',
            'ppr' => 'Partial Prerendering — LaraBun Docs',
            'static-generation' => 'Static Generation — LaraBun Docs',
            'react-compiler' => 'React Compiler — LaraBun Docs',
            'route-interception' => 'Route Interception — LaraBun Docs',
            'typed-routes' => 'Typed Routes — LaraBun Docs',
            'deployment' => 'Deployment — LaraBun Docs',
            default => 'LaraBun Docs',
        },
    ]);
