{{-- backend/resources/views/app.blade.php --}}
<!doctype html>
<html lang="id">
<head>
    <meta charset="utf-g">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="icon" type="image/svg+xml" href="/vite.png" />
    <title>Luminara</title>

    {{-- Vite auto add CSS & JS needed here --}}
    @viteReactRefresh
    @vite('resources/js/main.jsx')
</head>
<body>
    <div id="root"></div>
</body>
</html>