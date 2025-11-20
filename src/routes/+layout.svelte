<script lang="ts">
	import '../app.css';
	let { children } = $props();
</script>

<div class="min-h-screen flex flex-col relative overflow-hidden">
    <!-- Retro CRT Scanline Effect -->
    <div class="scanline"></div>

    <header class="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div class="container flex h-14 max-w-screen-2xl items-center px-4">
            <div class="mr-4 flex">
                <a class="mr-6 flex items-center space-x-2" href="/">
                    <span class="font-bold text-primary text-xl tracking-tighter glow-text">~/mytmux.life</span>
                    <span class="animate-pulse inline-block w-2 h-4 bg-primary"></span>
                </a>
                <nav class="flex items-center space-x-6 text-sm font-medium text-muted-foreground">
                    <a class="transition-colors hover:text-primary hover:underline decoration-primary underline-offset-4" href="/#learn">/docs</a>
                    <a class="transition-colors hover:text-primary hover:underline decoration-primary underline-offset-4" href="/#configurator">/config</a>
                    <a class="transition-colors hover:text-primary hover:underline decoration-primary underline-offset-4" href="/about">/about</a>
                </nav>
            </div>
            <div class="flex flex-1 items-center justify-end space-x-2">
                <div class="text-xs text-muted-foreground border border-border px-2 py-1">
                    v1.0.0-alpha
                </div>
            </div>
        </div>
    </header>

    <main class="flex-1 relative z-10">
        {@render children()}
    </main>

    <footer class="border-t border-border py-6 md:px-8 md:py-0">
        <div class="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
            <p class="text-center text-sm leading-loose text-muted-foreground md:text-left">
                Built by <span class="text-primary">v0</span>. The source code is available on <a href="https://github.com" class="font-medium underline underline-offset-4">GitHub</a>.
            </p>
            <div class="text-xs text-muted-foreground">
                $ echo "Happy Hacking"
            </div>
        </div>
    </footer>
</div>
