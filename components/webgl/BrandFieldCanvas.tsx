"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

export type BrandFieldVariant = "climate" | "depth";
export type BrandFieldTone = "light" | "dark";

type Props = {
  variant: BrandFieldVariant;
  tone: BrandFieldTone;
  /** Prospect primary brand colour (hex). */
  primary: string;
  /** Prospect accent colour (hex). */
  accent: string;
  className?: string;
};

/**
 * A single, shared WebGL backplate for the platform.
 *
 * It is intentionally tiny and framework-free (raw three, no react-three-fiber)
 * so it code-splits out of the initial payload and runs at 60fps. Two variants:
 *
 *  - `climate` — an abstract airflow / thermal field. Cool air streaming past a
 *    heat source: drifting, curl-like particle flow that maps to scroll and
 *    reacts to the cursor. Speaks to comfort, efficiency and moving air.
 *  - `depth`   — a receding architectural grid with scattered "city lights".
 *    Place, scale and neighbourhood depth for real-estate heroes.
 *
 * Progressive enhancement lives in the wrapper (`BrandField`): this file is only
 * ever loaded on capable, motion-tolerant devices.
 */
export function BrandFieldCanvas({ variant, tone, primary, accent, className }: Props) {
  const hostRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: variant === "depth",
        powerPreference: "high-performance",
      });
    } catch {
      return;
    }

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isSmall = window.innerWidth < 768;

    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, isSmall ? 1.5 : 1.75));
    renderer.setClearAlpha(0);
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";
    renderer.domElement.style.display = "block";
    host.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(44, 1, 0.1, 100);

    const cPrimary = new THREE.Color(primary);
    const cAccent = new THREE.Color(accent);
    // On light surfaces the field must read as tinted air, not glare — so pull
    // the palette toward the brand and damp it via alpha instead of additive.
    const colA = tone === "dark" ? cAccent.clone() : cPrimary.clone();
    const colB =
      tone === "dark" ? cPrimary.clone().lerp(cAccent, 0.5) : cAccent.clone().lerp(cPrimary, 0.35);

    const disposables: { dispose: () => void }[] = [];
    const clock = new THREE.Clock();

    let climate: THREE.Points | null = null;
    let depthGroup: THREE.Group | null = null;
    let depthLights: THREE.Points | null = null;

    if (variant === "climate") {
      camera.position.set(0, 0, 2.4);
      camera.lookAt(0, 0, 0);
      const count = isSmall ? 420 : 1100;
      const positions = new Float32Array(count * 3);
      const seeds = new Float32Array(count);
      const sizes = new Float32Array(count);
      for (let i = 0; i < count; i++) {
        positions[i * 3] = (Math.random() - 0.5) * 3.2;
        positions[i * 3 + 1] = (Math.random() - 0.5) * 1.5;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 1.4 - 0.2;
        seeds[i] = Math.random() * Math.PI * 2;
        sizes[i] = 6 + Math.random() * 16;
      }
      const geo = new THREE.BufferGeometry();
      geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
      geo.setAttribute("aSeed", new THREE.BufferAttribute(seeds, 1));
      geo.setAttribute("aSize", new THREE.BufferAttribute(sizes, 1));

      const mat = new THREE.ShaderMaterial({
        transparent: true,
        depthWrite: false,
        blending: tone === "dark" ? THREE.AdditiveBlending : THREE.NormalBlending,
        uniforms: {
          uTime: { value: 0 },
          uScroll: { value: 0 },
          uMouse: { value: new THREE.Vector2(0, 0) },
          uColorA: { value: colA },
          uColorB: { value: colB },
          uAlpha: { value: tone === "dark" ? 0.5 : 0.34 },
        },
        vertexShader: /* glsl */ `
          attribute float aSeed;
          attribute float aSize;
          uniform float uTime;
          uniform float uScroll;
          uniform vec2 uMouse;
          varying float vFade;
          void main() {
            vec3 p = position;
            float t = uTime * 0.55;
            float ang = sin(p.y * 1.7 + t + aSeed) * 1.25
                      + cos(p.x * 1.25 - t * 0.7 + aSeed) * 0.85;
            p.x += sin(ang + t * 0.6) * 0.20;
            p.y += cos(ang * 0.9 - t * 0.5) * 0.16;
            p.y -= uScroll * 1.1;
            p.x += uMouse.x * 0.28 * (1.0 + p.z * 0.4);
            p.y += uMouse.y * 0.28;
            p.y = mod(p.y + 1.3, 2.6) - 1.3;
            vec4 mv = modelViewMatrix * vec4(p, 1.0);
            gl_Position = projectionMatrix * mv;
            gl_PointSize = aSize * (1.0 / -mv.z);
            float depthFade = 1.0 - smoothstep(1.5, 3.4, -mv.z);
            vFade = smoothstep(-1.3, 0.9, p.y) * (0.25 + 0.75 * depthFade);
          }
        `,
        fragmentShader: /* glsl */ `
          precision mediump float;
          uniform vec3 uColorA;
          uniform vec3 uColorB;
          uniform float uAlpha;
          varying float vFade;
          void main() {
            float d = length(gl_PointCoord - vec2(0.5));
            if (d > 0.5) discard;
            float a = smoothstep(0.5, 0.0, d);
            vec3 col = mix(uColorB, uColorA, vFade);
            gl_FragColor = vec4(col, a * vFade * uAlpha);
          }
        `,
      });

      climate = new THREE.Points(geo, mat);
      scene.add(climate);
      disposables.push(geo, mat);
    }

    if (variant === "depth") {
      camera.position.set(0, 0.55, 3.1);
      camera.lookAt(0, -0.15, 0);

      const grid = new THREE.Group();
      grid.rotation.x = -Math.PI / 2.4;
      grid.position.y = -1.15;

      const size = 16;
      const verts: number[] = [];
      for (let i = -size; i <= size; i += 1) {
        verts.push(-size, 0, i, size, 0, i);
        verts.push(i, 0, -size, i, 0, size);
      }
      const gGeo = new THREE.BufferGeometry();
      gGeo.setAttribute("position", new THREE.Float32BufferAttribute(verts, 3));
      const gMat = new THREE.LineBasicMaterial({
        color: cAccent,
        transparent: true,
        opacity: tone === "dark" ? 0.22 : 0.16,
      });
      grid.add(new THREE.LineSegments(gGeo, gMat));
      disposables.push(gGeo, gMat);

      const glowPlane = new THREE.Mesh(
        new THREE.PlaneGeometry(24, 24),
        new THREE.MeshBasicMaterial({
          color: cPrimary,
          transparent: true,
          opacity: 0.05,
          side: THREE.DoubleSide,
        })
      );
      glowPlane.position.set(0, 0.02, 0);
      grid.add(glowPlane);
      disposables.push(glowPlane.geometry, glowPlane.material as THREE.Material);

      // A few hundred "city lights" resting on the plane for sparkle + depth.
      const count = isSmall ? 160 : 340;
      const positions = new Float32Array(count * 3);
      const seeds = new Float32Array(count);
      const sizes = new Float32Array(count);
      for (let i = 0; i < count; i++) {
        positions[i * 3] = (Math.random() - 0.5) * 14;
        positions[i * 3 + 1] = 0;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 14;
        seeds[i] = Math.random() * Math.PI * 2;
        sizes[i] = 18 + Math.random() * 42;
      }
      const pGeo = new THREE.BufferGeometry();
      pGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
      pGeo.setAttribute("aSeed", new THREE.BufferAttribute(seeds, 1));
      pGeo.setAttribute("aSize", new THREE.BufferAttribute(sizes, 1));
      const pMat = new THREE.ShaderMaterial({
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        uniforms: {
          uTime: { value: 0 },
          uColor: { value: colA },
          uAlpha: { value: tone === "dark" ? 0.9 : 0.5 },
        },
        vertexShader: /* glsl */ `
          attribute float aSeed;
          attribute float aSize;
          uniform float uTime;
          varying float vFade;
          void main() {
            vec4 mv = modelViewMatrix * vec4(position, 1.0);
            gl_Position = projectionMatrix * mv;
            gl_PointSize = aSize * (1.0 / -mv.z);
            float tw = 0.5 + 0.5 * sin(uTime * 1.4 + aSeed);
            vFade = (1.0 - smoothstep(6.0, 15.0, -mv.z)) * tw;
          }
        `,
        fragmentShader: /* glsl */ `
          precision mediump float;
          uniform vec3 uColor;
          uniform float uAlpha;
          varying float vFade;
          void main() {
            float d = length(gl_PointCoord - vec2(0.5));
            if (d > 0.5) discard;
            float a = smoothstep(0.5, 0.0, d);
            gl_FragColor = vec4(uColor, a * vFade * uAlpha);
          }
        `,
      });
      depthLights = new THREE.Points(pGeo, pMat);
      grid.add(depthLights);
      disposables.push(pGeo, pMat);

      scene.add(grid);
      depthGroup = grid;
    }

    /* ── Shared interaction state ───────────────────────────────── */
    const pointer = { x: 0, y: 0, tx: 0, ty: 0 };
    const onPointer = (e: PointerEvent) => {
      pointer.tx = (e.clientX / window.innerWidth - 0.5) * -1;
      pointer.ty = (e.clientY / window.innerHeight - 0.5) * -1;
    };

    let scroll = 0;
    const onScroll = () => {
      const rect = host.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      scroll = THREE.MathUtils.clamp(1 - (rect.top + rect.height / 2) / vh, 0, 2);
    };

    const resize = () => {
      const w = host.clientWidth || 1;
      const h = host.clientHeight || 1;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };

    let raf = 0;
    let visible = true;
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
    });

    const render = () => {
      raf = requestAnimationFrame(render);
      if (!visible) return;
      const t = clock.getElapsedTime();
      pointer.x += (pointer.tx - pointer.x) * 0.05;
      pointer.y += (pointer.ty - pointer.y) * 0.05;

      if (variant === "climate" && climate) {
        const mat = climate.material as THREE.ShaderMaterial;
        mat.uniforms.uTime.value = reduceMotion ? 0 : t;
        mat.uniforms.uScroll.value = reduceMotion ? 0 : scroll * 0.35;
        mat.uniforms.uMouse.value.set(pointer.x * 0.6, pointer.y * 0.6);
        climate.rotation.z = pointer.x * 0.05;
      }

      if (variant === "depth" && depthGroup) {
        depthGroup.rotation.y = pointer.x * 0.18;
        depthGroup.position.x = pointer.x * 0.5;
        depthGroup.position.z = reduceMotion ? 0 : (t * 0.35 + scroll * 1.6) % 4;
        camera.position.x += (pointer.x * 0.4 - camera.position.x) * 0.04;
        camera.position.y += (0.55 + pointer.y * 0.25 - camera.position.y) * 0.04;
        camera.lookAt(0, -0.15, 0);
        if (depthLights) {
          (depthLights.material as THREE.ShaderMaterial).uniforms.uTime.value = t;
        }
      }

      renderer.render(scene, camera);
    };

    resize();
    onScroll();
    host.classList.add("brand-field-ready");

    if (reduceMotion) {
      // Paint a single, calm frame — no animation loop, no listeners.
      renderer.render(scene, camera);
    } else {
      window.addEventListener("resize", resize);
      window.addEventListener("scroll", onScroll, { passive: true });
      window.addEventListener("pointermove", onPointer, { passive: true });
      io.observe(host);
      render();
    }

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener("resize", resize);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("pointermove", onPointer);
      disposables.forEach((d) => d.dispose());
      renderer.dispose();
      if (renderer.domElement.parentNode === host) host.removeChild(renderer.domElement);
      host.classList.remove("brand-field-ready");
    };
  }, [variant, tone, primary, accent]);

  return <div ref={hostRef} className={className} aria-hidden />;
}
