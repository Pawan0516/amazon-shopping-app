import React, { useRef, useEffect } from "react";

/**
 * LiquidEffect
 * - Fullscreen canvas overlay that draws expanding radial "splashes" on wheel events.
 * - Also tracks mouse position so splashes appear where the cursor is.
 *
 * Usage: place <LiquidEffect /> near top-level of the page (inside Home container).
 */
const LiquidEffect = ({
  maxRipples = 8,        // maximum concurrent ripples
  baseColor = [32, 150, 255], // base RGB color for ripple (array)
}) => {
  const canvasRef = useRef(null);
  const ripplesRef = useRef([]);
  const mouseRef = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  const rafRef = useRef(null);
  const lastTickRef = useRef(performance.now());

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });

    // size canvas to device pixel ratio for crispness
    const setSize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = Math.floor(window.innerWidth * dpr);
      canvas.height = Math.floor(window.innerHeight * dpr);
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    setSize();

    // add ripple on wheel (deltaY determines strength/size)
    const onWheel = (e) => {
      // only react to significant scrolls
      const strength = Math.min(Math.abs(e.deltaY) / 50, 6); // 0..6
      addRipple(mouseRef.current.x, mouseRef.current.y, strength);
    };

    const onMouseMove = (e) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
    };

    const onResize = () => setSize();

    window.addEventListener("wheel", onWheel, { passive: true });
    window.addEventListener("mousemove", onMouseMove, { passive: true });
    window.addEventListener("resize", onResize);

    // animation loop
    const tick = (time) => {
      const dt = time - lastTickRef.current;
      lastTickRef.current = time;
      updateAndDraw(ctx, dt);
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(rafRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // create a new ripple object
  const addRipple = (x, y, strength) => {
    const ripples = ripplesRef.current;
    if (ripples.length >= 16) {
      // recycle oldest
      ripples.shift();
    }

    // color variation
    const hueJitter = (Math.random() - 0.5) * 30; // +/- hue shift
    const [r, g, b] = baseColor;
    const color = `rgba(${Math.round(r + hueJitter)}, ${g}, ${Math.round(
      b - hueJitter / 1.5
    )},`;

    ripples.push({
      x,
      y,
      radius: 8 + strength * 12,
      maxRadius: 120 + strength * 180,
      growth: 0.8 + strength * 1.4, // px per ms
      lineWidth: 80 + strength * 60,
      life: 1.0, // 1 -> 0
      fadeRate: 0.0008 + strength * 0.0007, // per ms
      color,
      swirl: (Math.random() - 0.5) * 0.6, // small swirl offset
    });
  };

  // update & draw ripples
  const updateAndDraw = (ctx, dt) => {
    const ripples = ripplesRef.current;
    // clear with slight alpha to create trailing/liquid feel
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    if (!ripples.length) return;

    for (let i = 0; i < ripples.length; i++) {
      const r = ripples[i];
      // grow radius
      r.radius += r.growth * (dt / 16.67); // normalized to ~60fps
      // fade
      r.life -= r.fadeRate * dt;
    }

    // draw from oldest to newest for nicer blending
    for (let i = 0; i < ripples.length; i++) {
      const r = ripples[i];
      if (r.life <= 0) continue;

      // create radial gradient
      const grad = ctx.createRadialGradient(
        r.x + Math.sin(r.radius * 0.02) * r.swirl,
        r.y + Math.cos(r.radius * 0.02) * r.swirl,
        Math.max(1, r.radius * 0.15),
        r.x,
        r.y,
        r.radius
      );

      // inner bright, outer transparent
      grad.addColorStop(0, `${r.color} ${0.25 * r.life})`);
      grad.addColorStop(0.45, `${r.color} ${(0.12 * r.life).toFixed(3)})`);
      grad.addColorStop(1, `rgba(0,0,0,0)`);

      ctx.globalCompositeOperation = "lighter"; // additive/bright look
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(r.x, r.y, r.radius, 0, Math.PI * 2);
      ctx.fill();

      // soft ring for liquid edge
      ctx.globalCompositeOperation = "source-over";
      ctx.beginPath();
      ctx.strokeStyle = `rgba(255,255,255,${0.06 * r.life})`;
      ctx.lineWidth = Math.max(1, r.lineWidth * (1 - r.radius / r.maxRadius));
      ctx.arc(r.x, r.y, r.radius, 0, Math.PI * 2);
      ctx.stroke();
    }

    // remove dead ripples
    ripplesRef.current = ripples.filter((rp) => rp.life > 0 && rp.radius < rp.maxRadius);
  };

  // render full-screen canvas (pointer-events none so underlying UI works)
  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        left: 0,
        top: 0,
        width: "100%",
        height: "100%",
        zIndex: 9999,
        pointerEvents: "none",
        mixBlendMode: "screen",
      }}
      aria-hidden="true"
    />
  );
};

export default LiquidEffect;
