<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>{{ $title ?? 'LaraBun' }}</title>
    <meta name="description" content="{{ $description ?? 'LaraBun bridges Laravel and Bun for React Server Components, Inertia SSR, streaming, and server actions.' }}">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link rel="preload" as="style" href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@400;600;700;800&family=Outfit:wght@300;400;500;600&family=Fira+Code:wght@400;500&display=swap" onload="this.rel='stylesheet'">
    <noscript><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@400;600;700;800&family=Outfit:wght@300;400;500;600&family=Fira+Code:wght@400;500&display=swap"></noscript>
    @once
    @php
        $hydrateEntry = collect(glob(public_path('build/rsc/entry.hydrate-*.js')))->first();
    @endphp
    @if($hydrateEntry)
    <link rel="modulepreload" href="/build/rsc/{{ basename($hydrateEntry) }}">
    @endif
    @endonce
    <style>
        *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }
        html { scroll-behavior: smooth; }
        body {
            background: #09090b;
            color: #fafafa;
            font-family: 'Outfit', system-ui, -apple-system, sans-serif;
            line-height: 1.6;
            -webkit-font-smoothing: antialiased;
        }
        a { color: inherit; text-decoration: none; }
        ::selection { background: #f59e0b33; color: #fafafa; }
        h1, h2, h3, h4 { font-family: 'Bricolage Grotesque', sans-serif; }
        @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
        @keyframes glow {
            0%, 100% { opacity: 0.4; }
            50% { opacity: 0.8; }
        }
        @keyframes float {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-6px); }
        }
        @keyframes shimmer {
            0% { background-position: -200% center; }
            100% { background-position: 200% center; }
        }
        @media (max-width: 768px) {
            .docs-sidebar { display: none !important; }
            .docs-content { padding-left: 0 !important; }
        }
    </style>
</head>
<body>
    <div id="rsc-root">{!! $body !!}</div>

    <script>window.__RSC_INITIAL__ = {!! $initialJson !!};</script>

    {!! $scripts !!}
</body>
</html>
