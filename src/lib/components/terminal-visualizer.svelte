<script lang="ts">
    import { onMount } from 'svelte';
    
    let { 
        layout = { type: 'pane', id: 0 },
        activePaneId = 0
    } = $props();

    let canvas: HTMLCanvasElement;
    let ctx: CanvasRenderingContext2D | null = null;
    let animationFrameId: number;
    let lastTime = 0;
    let cursorBlink = true;

    let containerWidth = $state(0);
    let containerHeight = $state(0);

    // Colors
    const BG_COLOR = '#0a0a0a';
    const BORDER_COLOR = '#333333';
    const ACTIVE_BORDER_COLOR = '#00ff00';
    const TEXT_COLOR = '#00ff00';
    const MUTED_TEXT = '#444444';

    $effect(() => {
        // Track dependencies
        const w = containerWidth;
        const h = containerHeight;
        const l = layout;
        const active = activePaneId;
        const blink = cursorBlink; // Track blink state for redraws

        // Draw if we have context and dimensions
        if (ctx && w > 0 && h > 0) {
            draw();
        }
    });

    function resize() {
        if (!canvas) return;
        const parent = canvas.parentElement;
        if (parent) {
            // Handle high DPI displays
            const dpr = window.devicePixelRatio || 1;
            const rect = parent.getBoundingClientRect();
            
            canvas.width = rect.width * dpr;
            canvas.height = rect.height * dpr;
            
            // Scale context to match
            ctx?.scale(dpr, dpr);
            
            containerWidth = rect.width;
            containerHeight = rect.height;
        }
    }

    function animate(time: number) {
        if (time - lastTime > 500) { // Blink every 500ms
            cursorBlink = !cursorBlink;
            lastTime = time;
            // Effect will trigger draw automatically when cursorBlink changes
        }
        animationFrameId = requestAnimationFrame(animate);
    }

    onMount(() => {
        ctx = canvas.getContext('2d');
        window.addEventListener('resize', resize);
        resize();
        
        animationFrameId = requestAnimationFrame(animate);
        
        return () => {
            window.removeEventListener('resize', resize);
            cancelAnimationFrame(animationFrameId);
        };
    });

    function draw() {
        if (!ctx) return;
        
        // Clear
        ctx.fillStyle = BG_COLOR;
        ctx.fillRect(0, 0, containerWidth, containerHeight);

        // Draw Layout
        drawNode(layout, 0, 0, containerWidth, containerHeight);
    }

    function drawNode(node: any, x: number, y: number, w: number, h: number) {
        if (!ctx) return;

        // Add a small gap for the border
        const gap = 2;

        if (node.type === 'pane') {
            // Draw Pane Background
            ctx.fillStyle = '#050505';
            ctx.fillRect(x + gap, y + gap, w - gap*2, h - gap*2);

            // Draw Border
            ctx.lineWidth = 1;
            ctx.strokeStyle = node.id === activePaneId ? ACTIVE_BORDER_COLOR : BORDER_COLOR;
            
            // If active, make border slightly thicker/glowy
            if (node.id === activePaneId) {
                ctx.shadowColor = ACTIVE_BORDER_COLOR;
                ctx.shadowBlur = 4;
            } else {
                ctx.shadowBlur = 0;
            }
            
            ctx.strokeRect(x + gap, y + gap, w - gap*2, h - gap*2);
            ctx.shadowBlur = 0; // Reset

            // Draw Pane ID/Status
            ctx.font = '12px "JetBrains Mono", monospace';
            ctx.fillStyle = node.id === activePaneId ? TEXT_COLOR : MUTED_TEXT;
            ctx.fillText(`[${node.id}] zsh`, x + 15, y + 25);

            // Draw "Content" simulation
            if (h > 60) {
                ctx.fillStyle = MUTED_TEXT;
                const lines = Math.floor((h - 50) / 16);
                for (let i = 0; i < Math.min(lines, 8); i++) {
                    // Randomize line length to look like code
                    const width = (Math.sin(i * 132 + node.id) * 0.5 + 0.5) * (w - 60) + 20;
                    ctx.fillRect(x + 15, y + 45 + (i * 16), width, 6);
                }
                
                // Cursor
                if (node.id === activePaneId && cursorBlink) {
                    ctx.fillStyle = TEXT_COLOR;
                    const lastLineY = y + 45 + (Math.min(lines, 8) * 16);
                    ctx.fillRect(x + 15, lastLineY, 8, 14);
                }
            }

        } else if (node.type === 'split-v') {
            // Vertical Split (Top/Bottom)
            const h1 = h * (node.ratio || 0.5);
            const h2 = h - h1;
            drawNode(node.children[0], x, y, w, h1);
            drawNode(node.children[1], x, y + h1, w, h2);
        } else if (node.type === 'split-h') {
            // Horizontal Split (Left/Right)
            const w1 = w * (node.ratio || 0.5);
            const w2 = w - w1;
            drawNode(node.children[0], x, y, w1, h);
            drawNode(node.children[1], x + w1, y, w2, h);
        }
    }
</script>

<div class="w-full h-full min-h-[400px] bg-black border border-border relative group overflow-hidden">
    <canvas bind:this={canvas} class="block w-full h-full"></canvas>
    
    <!-- Scanline overlay for the canvas specifically -->
    <div class="absolute inset-0 pointer-events-none opacity-10 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-10 bg-[length:100%_2px,3px_100%]"></div>
    
    <div class="absolute bottom-2 right-2 text-[10px] text-muted-foreground opacity-50 group-hover:opacity-100 transition-opacity z-20 font-mono">
        RENDERER: CANVAS_2D // {containerWidth}x{containerHeight}
    </div>
</div>
