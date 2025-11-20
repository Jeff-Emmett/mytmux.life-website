"use client"

import { useEffect, useRef, useState } from "react"
import type { LayoutNode } from "@/app/page"

interface TerminalVisualizerProps {
  layout: LayoutNode
  activePaneId: number
}

export default function TerminalVisualizer({ layout, activePaneId }: TerminalVisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 })
  const animationRef = useRef<number>(0)
  const lastTimeRef = useRef<number>(0)
  const cursorBlinkRef = useRef<boolean>(true)

  // Colors
  const BG_COLOR = "#0a0a0a"
  const BORDER_COLOR = "#333333"
  const ACTIVE_BORDER_COLOR = "#00ff00"
  const TEXT_COLOR = "#00ff00"
  const MUTED_TEXT = "#444444"

  // Handle resize
  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current && canvasRef.current.parentElement) {
        const parent = canvasRef.current.parentElement
        const rect = parent.getBoundingClientRect()
        const dpr = window.devicePixelRatio || 1

        canvasRef.current.width = rect.width * dpr
        canvasRef.current.height = rect.height * dpr

        setContainerSize({ width: rect.width, height: rect.height })
      }
    }

    window.addEventListener("resize", handleResize)
    handleResize()

    return () => window.removeEventListener("resize", handleResize)
  }, [])

  // Animation Loop
  useEffect(() => {
    const animate = (time: number) => {
      if (time - lastTimeRef.current > 500) {
        cursorBlinkRef.current = !cursorBlinkRef.current
        lastTimeRef.current = time
      }

      // Trigger a redraw
      draw()

      animationRef.current = requestAnimationFrame(animate)
    }

    animationRef.current = requestAnimationFrame(animate)

    return () => cancelAnimationFrame(animationRef.current)
  }) // No dependency array to ensure it always has access to latest props via closure if needed,
  // but actually we should probably use refs for props if we want to avoid re-binding the loop.
  // However, since we call draw() which uses the props, we need to make sure draw() sees the latest props.
  // The best way in React for a canvas loop is often to use refs for the mutable state or just let the effect re-run.
  // Let's optimize:

  // Drawing Logic
  const draw = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const dpr = window.devicePixelRatio || 1
    const width = containerSize.width
    const height = containerSize.height

    // Reset transform to handle DPR correctly on every frame
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

    // Clear
    ctx.fillStyle = BG_COLOR
    ctx.fillRect(0, 0, width, height)

    // Draw Layout
    drawNode(ctx, layout, 0, 0, width, height)
  }

  function drawNode(ctx: CanvasRenderingContext2D, node: LayoutNode, x: number, y: number, w: number, h: number) {
    // Add a small gap for the border
    const gap = 2

    if (node.type === "pane") {
      // Draw Pane Background
      ctx.fillStyle = "#050505"
      ctx.fillRect(x + gap, y + gap, w - gap * 2, h - gap * 2)

      // Draw Border
      ctx.lineWidth = 1
      ctx.strokeStyle = node.id === activePaneId ? ACTIVE_BORDER_COLOR : BORDER_COLOR

      // If active, make border slightly thicker/glowy
      if (node.id === activePaneId) {
        ctx.shadowColor = ACTIVE_BORDER_COLOR
        ctx.shadowBlur = 4
      } else {
        ctx.shadowBlur = 0
      }

      ctx.strokeRect(x + gap, y + gap, w - gap * 2, h - gap * 2)
      ctx.shadowBlur = 0 // Reset

      // Draw Pane ID/Status
      ctx.font = '12px "JetBrains Mono", monospace'
      ctx.fillStyle = node.id === activePaneId ? TEXT_COLOR : MUTED_TEXT
      ctx.fillText(`[${node.id}] zsh`, x + 15, y + 25)

      // Draw "Content" simulation
      if (h > 60) {
        ctx.fillStyle = MUTED_TEXT
        const lines = Math.floor((h - 50) / 16)
        for (let i = 0; i < Math.min(lines, 8); i++) {
          // Randomize line length to look like code
          // Use a pseudo-random based on ID and index to keep it stable
          const width = (Math.sin(i * 132 + node.id) * 0.5 + 0.5) * (w - 60) + 20
          ctx.fillRect(x + 15, y + 45 + i * 16, width, 6)
        }

        // Cursor
        if (node.id === activePaneId && cursorBlinkRef.current) {
          ctx.fillStyle = TEXT_COLOR
          const lastLineY = y + 45 + Math.min(lines, 8) * 16
          ctx.fillRect(x + 15, lastLineY, 8, 14)
        }
      }
    } else if (node.type === "split-v") {
      // Vertical Split (Top/Bottom)
      const h1 = h * (node.ratio || 0.5)
      const h2 = h - h1
      drawNode(ctx, node.children[0], x, y, w, h1)
      drawNode(ctx, node.children[1], x, y + h1, w, h2)
    } else if (node.type === "split-h") {
      // Horizontal Split (Left/Right)
      const w1 = w * (node.ratio || 0.5)
      const w2 = w - w1
      drawNode(ctx, node.children[0], x, y, w1, h)
      drawNode(ctx, node.children[1], x + w1, y, w2, h)
    }
  }

  return (
    <div className="w-full h-full min-h-[400px] bg-black border border-border relative group overflow-hidden">
      <canvas ref={canvasRef} className="block w-full h-full"></canvas>

      {/* Scanline overlay for the canvas specifically */}
      <div className="absolute inset-0 pointer-events-none opacity-10 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-10 bg-[length:100%_2px,3px_100%]"></div>

      <div className="absolute bottom-2 right-2 text-[10px] text-muted-foreground opacity-50 group-hover:opacity-100 transition-opacity z-20 font-mono">
        RENDERER: CANVAS_2D // {Math.round(containerSize.width)}x{Math.round(containerSize.height)}
      </div>
    </div>
  )
}
