"use client"

import type React from "react"

import { useEffect, useRef, useState } from "react"
import type { LayoutNode } from "@/app/page"

interface TerminalVisualizerProps {
  layout: LayoutNode
  activePaneId: number
}

interface MatrixStream {
  x: number
  y: number
  speed: number
  chars: string[]
  length: number
  firstChar: string
}

export default function TerminalVisualizer({ layout, activePaneId }: TerminalVisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 })
  const animationRef = useRef<number>(0)
  const lastTimeRef = useRef<number>(0)
  const cursorBlinkRef = useRef<boolean>(true)

  // Matrix Rain Refs
  const streamsRef = useRef<MatrixStream[]>([])
  const mouseRef = useRef({ x: 0, y: 0 })
  const lastSpawnTimeRef = useRef(0)

  // Colors
  const BG_COLOR = "#000000" // Pure black for hacker vibe
  const BORDER_COLOR = "#004400" // Dark green border
  const ACTIVE_BORDER_COLOR = "#33ff00"
  const TEXT_COLOR = "#33ff00"
  const MUTED_TEXT = "#006600" // More visible muted green
  const MATRIX_CHARS = "0123456789ABCDEF"

  const fontFamilyRef = useRef("monospace")

  // Handle resize
  useEffect(() => {
    const computedStyle = window.getComputedStyle(document.body)
    fontFamilyRef.current = computedStyle.fontFamily || "monospace"

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

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    mouseRef.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    }
  }

  const handleTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const touch = e.touches[0]
    if (touch) {
      mouseRef.current = {
        x: touch.clientX - rect.left,
        y: touch.clientY - rect.top,
      }
    }
  }

  // Animation Loop
  useEffect(() => {
    const animate = (time: number) => {
      if (time - lastTimeRef.current > 500) {
        cursorBlinkRef.current = !cursorBlinkRef.current
        lastTimeRef.current = time
      }

      // Spawn matrix streams from cursor
      if (time - lastSpawnTimeRef.current > 50) {
        // Spawn every 50ms
        const x = mouseRef.current.x
        const y = mouseRef.current.y

        // Snap to grid columns roughly
        const colWidth = 14
        const snappedX = Math.floor(x / colWidth) * colWidth

        // Only spawn if we moved or randomly
        if (Math.random() > 0.7) {
          streamsRef.current.push({
            x: snappedX,
            y: y,
            speed: 2 + Math.random() * 3,
            chars: Array(20)
              .fill(0)
              .map(() => MATRIX_CHARS[Math.floor(Math.random() * MATRIX_CHARS.length)]),
            length: 5 + Math.floor(Math.random() * 8),
            firstChar: MATRIX_CHARS[Math.floor(Math.random() * MATRIX_CHARS.length)],
          })
          lastSpawnTimeRef.current = time
        }
      }

      // Trigger a redraw
      draw()

      animationRef.current = requestAnimationFrame(animate)
    }

    animationRef.current = requestAnimationFrame(animate)

    return () => cancelAnimationFrame(animationRef.current)
  })

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

    // Draw Matrix Rain
    drawMatrixRain(ctx, width, height)
  }

  const drawMatrixRain = (ctx: CanvasRenderingContext2D, w: number, h: number) => {
    ctx.font = `20px ${fontFamilyRef.current}`

    // Update and draw streams
    for (let i = streamsRef.current.length - 1; i >= 0; i--) {
      const stream = streamsRef.current[i]
      stream.y += stream.speed

      // Randomly change characters
      if (Math.random() > 0.9) {
        stream.firstChar = MATRIX_CHARS[Math.floor(Math.random() * MATRIX_CHARS.length)]
      }

      // Draw the stream
      for (let j = 0; j < stream.length; j++) {
        const charY = stream.y - j * 20 // Adjusted spacing for larger font

        // Don't draw if off screen (above or below)
        if (charY > h + 20) continue

        // Opacity fade based on position in tail
        const opacity = (1 - j / stream.length) * 0.8

        if (j === 0) {
          // Head of the stream (bright white/green)
          ctx.fillStyle = `rgba(200, 255, 200, ${opacity})`
          ctx.fillText(stream.firstChar, stream.x, charY)
        } else {
          // Tail (green)
          ctx.fillStyle = `rgba(51, 255, 0, ${opacity * 0.5})`
          ctx.fillText(stream.chars[j % stream.chars.length], stream.x, charY)
        }
      }

      // Remove if off screen or fully faded
      if (stream.y - stream.length * 20 > h || stream.y > h + 100) {
        streamsRef.current.splice(i, 1)
      }
    }
  }

  function drawNode(ctx: CanvasRenderingContext2D, node: LayoutNode, x: number, y: number, w: number, h: number) {
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
      ctx.font = `18px ${fontFamilyRef.current}`
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
      <canvas
        ref={canvasRef}
        className="block w-full h-full cursor-crosshair touch-none"
        onMouseMove={handleMouseMove}
        onTouchMove={handleTouchMove}
        onTouchStart={handleTouchMove}
      ></canvas>

      {/* Scanline overlay for the canvas specifically */}
      <div className="absolute inset-0 pointer-events-none opacity-10 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-10 bg-[length:100%_2px,3px_100%]"></div>

      <div className="absolute bottom-2 right-2 text-[10px] text-muted-foreground opacity-50 group-hover:opacity-100 transition-opacity z-20 font-mono">
        RENDERER: CANVAS_2D // {Math.round(containerSize.width)}x{Math.round(containerSize.height)}
      </div>
    </div>
  )
}
