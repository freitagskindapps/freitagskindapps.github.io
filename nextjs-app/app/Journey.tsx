"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

/**
 * The Descent — a scroll-driven 3D journey.
 * You begin above the clouds and fly down past floating islands,
 * each one a chapter of the studio, until you land at the sea.
 */

const SCROLL_PAGES = 8; // total scroll length in viewport heights

type SectionId = "hero" | "fun" | "craft" | "studio" | "contact";

const SECTIONS: {
  id: SectionId;
  window: [number, number]; // progress range where the card is visible
  tag: string;
  title: string;
  body: string;
  side: "left" | "right";
}[] = [
  {
    id: "hero",
    window: [0, 0.08],
    tag: "",
    title: "",
    body: "",
    side: "left",
  },
  {
    id: "fun",
    window: [0.15, 0.28],
    tag: "Joy, shipped.",
    title: "Apps that are fun",
    body: "We believe useful should also be delightful. Our apps are small, friendly and playful — tools you actually look forward to opening.",
    side: "left",
  },
  {
    id: "craft",
    window: [0.34, 0.48],
    tag: "Focused. Intentional.",
    title: "Our Craft",
    body: "We build small apps with real impact. Problem-first thinking, simple by design, made to last — every pixel earns its place.",
    side: "right",
  },
  {
    id: "studio",
    window: [0.54, 0.67],
    tag: "Independent by design.",
    title: "The Studio",
    body: "freitagskind apps is an independent studio crafting digital experiences that inspire and empower. Self-funded, human-centered, no dark patterns — ever.",
    side: "left",
  },
  {
    id: "contact",
    window: [0.82, 1.01],
    tag: "Let's build something extraordinary.",
    title: "Say hello",
    body: "We love mail. Especially the kind that starts a project, asks a question, or just says hi.",
    side: "right",
  },
];

const STAR_COUNT = 8;

export default function Journey() {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const [activeSection, setActiveSection] = useState<SectionId>("hero");
  const [starsFound, setStarsFound] = useState(0);
  const [catToast, setCatToast] = useState(false);
  const [webglFailed, setWebglFailed] = useState(false);
  const catToastTimer = useRef<number>(0);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const width = window.innerWidth;
    const height = window.innerHeight;

    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0xe3bcd0, 30, 95);

    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 300);

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true });
    } catch {
      setWebglFailed(true);
      return;
    }
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    mount.appendChild(renderer.domElement);

    /* ---------- lights ---------- */
    /* hemisphere light: lavender sky bounce above, earthy bounce below */
    const hemi = new THREE.HemisphereLight(0xd8b8e8, 0x6a5a48, 0.6);
    scene.add(hemi);
    const sun = new THREE.DirectionalLight(0xffd9b3, 1.45);
    sun.position.set(-20, 30, 15);
    sun.castShadow = true;
    sun.shadow.mapSize.set(2048, 2048);
    sun.shadow.camera.left = -24;
    sun.shadow.camera.right = 24;
    sun.shadow.camera.top = 44;
    sun.shadow.camera.bottom = -24;
    sun.shadow.normalBias = 0.03;
    sun.shadow.bias = -0.0002;
    scene.add(sun);
    const rim = new THREE.DirectionalLight(0x8a78b8, 0.3);
    rim.position.set(15, 5, -15);
    scene.add(rim);

    /* ---------- sky ---------- */
    const skyMat = new THREE.ShaderMaterial({
      side: THREE.BackSide,
      depthWrite: false,
      uniforms: {
        topColor: { value: new THREE.Color(0x4a3a6b) },
        midColor: { value: new THREE.Color(0xc090b0) },
        bottomColor: { value: new THREE.Color(0xf4c89b) },
        sunDir: { value: new THREE.Vector3(-20, 30, 15).normalize() },
      },
      vertexShader: `
        varying vec3 vDir;
        void main() {
          vDir = normalize(position);
          vec4 mv = modelViewMatrix * vec4(position, 1.0);
          gl_Position = projectionMatrix * mv;
        }
      `,
      fragmentShader: `
        uniform vec3 topColor;
        uniform vec3 midColor;
        uniform vec3 bottomColor;
        uniform vec3 sunDir;
        varying vec3 vDir;
        void main() {
          vec3 dir = normalize(vDir);
          float h = dir.y;
          vec3 col;
          if (h > 0.0) col = mix(midColor, topColor, smoothstep(0.0, 0.6, h));
          else col = mix(midColor, bottomColor, smoothstep(0.0, -0.45, h));
          /* warm sun disc + wide haze around it */
          float s = max(dot(dir, sunDir), 0.0);
          col += vec3(1.0, 0.82, 0.55) * (pow(s, 64.0) * 0.55 + pow(s, 6.0) * 0.16);
          gl_FragColor = vec4(col, 1.0);
        }
      `,
    });
    const sky = new THREE.Mesh(new THREE.SphereGeometry(140, 32, 16), skyMat);
    scene.add(sky);

    /* ---------- stars (visible up high) ---------- */
    const starGeo = new THREE.BufferGeometry();
    const bgStarCount = 260;
    const bgStarPos = new Float32Array(bgStarCount * 3);
    for (let i = 0; i < bgStarCount; i++) {
      const r = 110;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI * 0.5;
      bgStarPos[i * 3] = r * Math.cos(phi) * Math.cos(theta);
      bgStarPos[i * 3 + 1] = r * Math.sin(phi) + 20;
      bgStarPos[i * 3 + 2] = r * Math.cos(phi) * Math.sin(theta);
    }
    starGeo.setAttribute("position", new THREE.BufferAttribute(bgStarPos, 3));
    const bgStarMat = new THREE.PointsMaterial({
      color: 0xfff4c2,
      size: 0.35,
      transparent: true,
      opacity: 0.9,
    });
    const bgStars = new THREE.Points(starGeo, bgStarMat);
    scene.add(bgStars);

    /* ---------- realism helpers ---------- */
    /* subtle grayscale mottling so flat surfaces aren't perfectly uniform */
    function noiseTexture(intensity: number, repeat: number): THREE.Texture {
      const size = 128;
      const c = document.createElement("canvas");
      c.width = c.height = size;
      const ctx = c.getContext("2d")!;
      const img = ctx.createImageData(size, size);
      for (let i = 0; i < size * size; i++) {
        const v = Math.round(255 * (1 - intensity / 2 + Math.random() * intensity));
        img.data[i * 4] = img.data[i * 4 + 1] = img.data[i * 4 + 2] = v;
        img.data[i * 4 + 3] = 255;
      }
      ctx.putImageData(img, 0, 0);
      const tex = new THREE.CanvasTexture(c);
      tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
      tex.repeat.set(repeat, repeat);
      return tex;
    }

    /* displace vertices by a hash of their position — same position gets the
       same offset, so seams between caps and sides stay watertight */
    function roughen(geo: THREE.BufferGeometry, amt: number) {
      const pos = geo.attributes.position as THREE.BufferAttribute;
      for (let i = 0; i < pos.count; i++) {
        const x = pos.getX(i);
        const y = pos.getY(i);
        const z = pos.getZ(i);
        const h1 = Math.sin(x * 127.1 + y * 311.7 + z * 74.7) * 43758.5453;
        const h2 = Math.sin(x * 269.5 + y * 183.3 + z * 246.1) * 28001.8384;
        const h3 = Math.sin(x * 113.5 + y * 271.9 + z * 124.6) * 9145.123;
        pos.setXYZ(
          i,
          x + (h1 - Math.floor(h1) - 0.5) * amt,
          y + (h2 - Math.floor(h2) - 0.5) * amt,
          z + (h3 - Math.floor(h3) - 0.5) * amt
        );
      }
      pos.needsUpdate = true;
    }

    /* ---------- shared materials ---------- */
    const grassMat = new THREE.MeshStandardMaterial({
      color: 0x8fb88a,
      flatShading: true,
      roughness: 0.95,
      map: noiseTexture(0.14, 4),
    });
    const dirtMat = new THREE.MeshStandardMaterial({
      color: 0x6b4d3a,
      flatShading: true,
      roughness: 1,
      map: noiseTexture(0.18, 3),
    });
    const trunkMat = new THREE.MeshStandardMaterial({ color: 0x5a3e2b, flatShading: true, roughness: 1 });
    const leafMat = new THREE.MeshStandardMaterial({ color: 0x4a8a6b, flatShading: true, roughness: 0.9 });
    const woodMat = new THREE.MeshStandardMaterial({ color: 0xb08858, flatShading: true, roughness: 0.85 });
    const darkMat = new THREE.MeshStandardMaterial({ color: 0x3a2d4a, flatShading: true, roughness: 0.7 });
    const cloudMat = new THREE.MeshStandardMaterial({ color: 0xf6eef2, flatShading: true, transparent: true, opacity: 0.88, roughness: 1 });

    function makeFloatingIsland(radius: number): THREE.Group {
      const g = new THREE.Group();
      const capGeo = new THREE.CylinderGeometry(radius, radius * 0.92, 0.5, 9, 2);
      roughen(capGeo, radius * 0.09);
      /* receive local shadows but don't cast — a floating island casting a
         blob onto the sea 40 units below looks detached and muddy */
      const cap = new THREE.Mesh(capGeo, grassMat);
      cap.receiveShadow = true;
      g.add(cap);
      const coneGeo = new THREE.ConeGeometry(radius * 0.94, radius * 1.1, 9, 3);
      roughen(coneGeo, radius * 0.12);
      const cone = new THREE.Mesh(coneGeo, dirtMat);
      cone.position.y = -radius * 0.55 - 0.25;
      cone.rotation.y = Math.PI / 8;
      g.add(cone);
      return g;
    }

    function makeTree(s: number): THREE.Group {
      const g = new THREE.Group();
      const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.12 * s, 0.16 * s, 0.6 * s, 6), trunkMat);
      trunk.position.y = 0.3 * s;
      trunk.castShadow = true;
      g.add(trunk);
      /* two-tier canopy with per-tree color variation */
      const leaf = leafMat.clone();
      leaf.color.offsetHSL((Math.random() - 0.5) * 0.05, (Math.random() - 0.5) * 0.12, (Math.random() - 0.5) * 0.06);
      const lower = new THREE.Mesh(new THREE.ConeGeometry(0.65 * s, 1.1 * s, 6), leaf);
      lower.position.y = 0.95 * s;
      lower.castShadow = true;
      g.add(lower);
      const upper = new THREE.Mesh(new THREE.ConeGeometry(0.45 * s, 0.9 * s, 6), leaf);
      upper.position.y = 1.55 * s;
      upper.rotation.y = Math.PI / 6;
      upper.castShadow = true;
      g.add(upper);
      g.rotation.z = (Math.random() - 0.5) * 0.07;
      g.rotation.x = (Math.random() - 0.5) * 0.07;
      g.rotation.y = Math.random() * Math.PI;
      return g;
    }

    /* ============================================================
       ISLAND A — the ferris wheel (apps that are fun)
       ============================================================ */
    const islandA = makeFloatingIsland(4);
    islandA.position.set(-7, 30, -2);
    scene.add(islandA);

    const frameMat = new THREE.MeshStandardMaterial({ color: 0xf2e4d4, flatShading: true });
    function makeStrut(from: THREE.Vector3, to: THREE.Vector3, r: number): THREE.Mesh {
      const dir = to.clone().sub(from);
      const len = dir.length();
      const mesh = new THREE.Mesh(new THREE.CylinderGeometry(r, r, len, 6), frameMat);
      mesh.position.copy(from).addScaledVector(dir, 0.5);
      mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.normalize());
      mesh.castShadow = true;
      return mesh;
    }

    const ferris = new THREE.Group();
    const hubY = 2.9;
    /* A-frame legs on both sides of the wheel */
    [-0.55, 0.55].forEach((z) => {
      ferris.add(
        makeStrut(new THREE.Vector3(-1.5, 0.25, z * 1.7), new THREE.Vector3(0, hubY, z), 0.09)
      );
      ferris.add(
        makeStrut(new THREE.Vector3(1.5, 0.25, z * 1.7), new THREE.Vector3(0, hubY, z), 0.09)
      );
    });
    const axle = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 1.5, 8), darkMat);
    axle.rotation.x = Math.PI / 2;
    axle.position.y = hubY;
    ferris.add(axle);

    const wheel = new THREE.Group();
    wheel.position.y = hubY;
    const wheelRim = new THREE.Mesh(
      new THREE.TorusGeometry(2.2, 0.08, 8, 40),
      new THREE.MeshStandardMaterial({ color: 0xc85a8a, flatShading: true })
    );
    wheel.add(wheelRim);
    for (let i = 0; i < 6; i++) {
      const a = (i / 6) * Math.PI * 2;
      wheel.add(
        makeStrut(
          new THREE.Vector3(0, 0, 0),
          new THREE.Vector3(Math.cos(a) * 2.2, Math.sin(a) * 2.2, 0),
          0.05
        )
      );
    }
    const wheelHub = new THREE.Mesh(new THREE.SphereGeometry(0.24, 8, 8), darkMat);
    wheel.add(wheelHub);

    /* gondolas hang from the rim and stay upright as the wheel turns */
    const cabinColors = [0xf2d06b, 0x8ac8e8, 0xe88aa8, 0x9ad8a0, 0xb088d8, 0xf2914a];
    const cabins: THREE.Group[] = [];
    for (let i = 0; i < 6; i++) {
      const a = (i / 6) * Math.PI * 2;
      const pivot = new THREE.Group();
      pivot.position.set(Math.cos(a) * 2.2, Math.sin(a) * 2.2, 0);
      const cabin = new THREE.Mesh(
        new THREE.BoxGeometry(0.45, 0.4, 0.4),
        new THREE.MeshStandardMaterial({ color: cabinColors[i], flatShading: true })
      );
      cabin.position.y = -0.36;
      cabin.castShadow = true;
      pivot.add(cabin);
      const cabinRoof = new THREE.Mesh(new THREE.ConeGeometry(0.34, 0.22, 4), darkMat);
      cabinRoof.position.y = -0.08;
      cabinRoof.rotation.y = Math.PI / 4;
      pivot.add(cabinRoof);
      cabins.push(pivot);
      wheel.add(pivot);
    }
    ferris.add(wheel);
    ferris.rotation.y = Math.PI / 5; // face the flight path
    islandA.add(ferris);

    const treeA = makeTree(0.9);
    treeA.position.set(2.6, 0.25, 1.8);
    islandA.add(treeA);

    /* ============================================================
       ISLAND B — the homestead (watermill, chicken pen)
       ============================================================ */
    const islandB = makeFloatingIsland(3.6);
    islandB.position.set(7, 18, 0);
    scene.add(islandB);

    /* chicken pen behind the mill — hens pottering inside a little fence */
    const pen = new THREE.Group();
    pen.position.set(0.4, 0.25, -0.1);
    islandB.add(pen);

    const penR = 1.2;
    const postCount = 8;
    for (let i = 0; i < postCount; i++) {
      const a = (i / postCount) * Math.PI * 2;
      const post = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.055, 0.5, 5), trunkMat);
      post.position.set(Math.cos(a) * penR, 0.25, Math.sin(a) * penR);
      post.castShadow = true;
      pen.add(post);
      const a2 = ((i + 1) / postCount) * Math.PI * 2;
      const dx = (Math.cos(a2) - Math.cos(a)) * penR;
      const dz = (Math.sin(a2) - Math.sin(a)) * penR;
      [0.16, 0.36].forEach((h) => {
        const rail = new THREE.Mesh(new THREE.BoxGeometry(Math.hypot(dx, dz), 0.05, 0.04), woodMat);
        rail.position.set(((Math.cos(a) + Math.cos(a2)) / 2) * penR, h, ((Math.sin(a) + Math.sin(a2)) / 2) * penR);
        rail.rotation.y = -Math.atan2(dz, dx);
        rail.castShadow = true;
        pen.add(rail);
      });
    }

    const combMat = new THREE.MeshStandardMaterial({ color: 0xe85a3a, flatShading: true });
    const beakMat = new THREE.MeshStandardMaterial({ color: 0xf2a94a, flatShading: true });
    const hens: { g: THREE.Group; r: number; speed: number; phase: number }[] = [];
    [0xf2ece2, 0xb5703f, 0xf2d9b8].forEach((c, i) => {
      const hen = new THREE.Group();
      const henMat = new THREE.MeshStandardMaterial({ color: c, flatShading: true, roughness: 0.9 });
      const body = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.17, 0.15), henMat);
      body.position.y = 0.15;
      body.castShadow = true;
      hen.add(body);
      const tail = new THREE.Mesh(new THREE.ConeGeometry(0.07, 0.14, 4), henMat);
      tail.position.set(-0.14, 0.22, 0);
      tail.rotation.z = 0.6;
      hen.add(tail);
      const head = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.13, 0.11), henMat);
      head.position.set(0.13, 0.28, 0);
      hen.add(head);
      const comb = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.05, 0.03), combMat);
      comb.position.set(0.13, 0.37, 0);
      hen.add(comb);
      const beak = new THREE.Mesh(new THREE.ConeGeometry(0.035, 0.09, 4), beakMat);
      beak.rotation.z = -Math.PI / 2;
      beak.position.set(0.21, 0.28, 0);
      hen.add(beak);
      [0.04, -0.04].forEach((z) => {
        const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.08, 4), beakMat);
        leg.position.set(0, 0.04, z);
        hen.add(leg);
      });
      hens.push({ g: hen, r: 0.35 + i * 0.18, speed: 0.5 + i * 0.25, phase: i * 2.1 });
      pen.add(hen);
    });

    /* tiny mill house beside the stream */
    const mill = new THREE.Group();
    const millBody = new THREE.Mesh(
      new THREE.BoxGeometry(1.1, 0.9, 1.0),
      new THREE.MeshStandardMaterial({ color: 0xeac8a8, flatShading: true })
    );
    millBody.position.y = 0.45;
    millBody.castShadow = true;
    mill.add(millBody);
    const millRoof = new THREE.Mesh(
      new THREE.ConeGeometry(0.95, 0.65, 4),
      new THREE.MeshStandardMaterial({ color: 0x6a4a8a, flatShading: true })
    );
    millRoof.position.y = 1.22;
    millRoof.rotation.y = Math.PI / 4;
    millRoof.castShadow = true;
    mill.add(millRoof);
    const millWindow = new THREE.Mesh(
      new THREE.PlaneGeometry(0.26, 0.26),
      new THREE.MeshBasicMaterial({ color: 0xffd98a })
    );
    millWindow.position.set(0, 0.5, 0.51);
    mill.add(millWindow);
    mill.position.set(-1.55, 0.25, 0.7);
    islandB.add(mill);

    /* stream running past the mill, off the island edge as a waterfall */
    const waterMat = new THREE.MeshStandardMaterial({
      color: 0x5aa8d8,
      flatShading: true,
      roughness: 0.35,
      transparent: true,
      opacity: 0.85,
    });
    const stream = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.1, 5.1), waterMat);
    stream.position.set(-2.5, 0.27, 0);
    islandB.add(stream);
    const waterfall = new THREE.Mesh(new THREE.BoxGeometry(0.7, 1.1, 0.08), waterMat);
    waterfall.position.set(-2.5, -0.2, 2.6);
    islandB.add(waterfall);

    /* foam flecks drifting downstream */
    const foamMat = new THREE.MeshBasicMaterial({ color: 0xeaf6fc });
    const foam: THREE.Mesh[] = [];
    for (let i = 0; i < 4; i++) {
      const fleck = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.04, 0.09), foamMat);
      fleck.position.set(-2.5 + (i % 2 ? 0.18 : -0.15), 0.33, 0);
      foam.push(fleck);
      islandB.add(fleck);
    }

    /* water wheel on the mill's stream-side wall, paddles dipping into the water */
    const waterWheel = new THREE.Group();
    const wheelMatB = new THREE.MeshStandardMaterial({ color: 0xc8924a, flatShading: true, roughness: 0.8 });
    const wheelDisc = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.55, 0.16, 10), wheelMatB);
    waterWheel.add(wheelDisc);
    for (let i = 0; i < 8; i++) {
      const a = (i / 8) * Math.PI * 2;
      const paddle = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.2, 0.28), wheelMatB);
      paddle.position.set(Math.cos(a) * 0.62, 0, Math.sin(a) * 0.62);
      paddle.rotation.y = -a;
      waterWheel.add(paddle);
    }
    const wheelMount = new THREE.Group();
    wheelMount.position.set(-2.45, 0.85, 0.7);
    wheelMount.rotation.set(0, 0, Math.PI / 2); // axle horizontal, reaching the mill wall
    wheelMount.add(waterWheel);
    const millAxle = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.8, 6), darkMat);
    wheelMount.add(millAxle);
    islandB.add(wheelMount);

    [
      [-1.1, -1.2, 0.4],
      [-0.6, -1.6, 0.3],
      [-1.5, -1.7, 0.35],
    ].forEach(([x, z, s]) => {
      const block = new THREE.Mesh(new THREE.BoxGeometry(s, s, s), woodMat);
      block.position.set(x, 0.25 + s / 2, z);
      block.rotation.y = Math.random() * Math.PI;
      block.castShadow = true;
      islandB.add(block);
    });

    const treeB = makeTree(0.8);
    treeB.position.set(2.2, 0.25, -1.6);
    islandB.add(treeB);

    /* ============================================================
       ISLAND C — the studio (house, campfire, cat)
       ============================================================ */
    const islandC = makeFloatingIsland(3.8);
    islandC.position.set(-6, 6, 2);
    scene.add(islandC);

    const house = new THREE.Group();
    const hBody = new THREE.Mesh(
      new THREE.BoxGeometry(1.7, 1.3, 1.5),
      new THREE.MeshStandardMaterial({ color: 0xeac8a8, flatShading: true })
    );
    hBody.position.y = 0.9;
    hBody.castShadow = true;
    house.add(hBody);
    const hRoof = new THREE.Mesh(
      new THREE.ConeGeometry(1.4, 0.9, 4),
      new THREE.MeshStandardMaterial({ color: 0x6a4a8a, flatShading: true })
    );
    hRoof.position.y = 2;
    hRoof.rotation.y = Math.PI / 4;
    hRoof.castShadow = true;
    house.add(hRoof);
    const windowPane = new THREE.Mesh(
      new THREE.PlaneGeometry(0.38, 0.38),
      new THREE.MeshBasicMaterial({ color: 0xffd98a })
    );
    windowPane.position.set(0, 1, 0.76);
    house.add(windowPane);
    house.position.set(-1.2, 0.25, -0.8);
    house.rotation.y = 0.5;
    islandC.add(house);

    const campfire = new THREE.Group();
    for (let i = 0; i < 3; i++) {
      const log = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 0.8, 5), trunkMat);
      log.rotation.z = Math.PI / 2;
      log.rotation.y = (i / 3) * Math.PI;
      log.position.y = 0.08;
      campfire.add(log);
    }
    const flames: THREE.Mesh[] = [];
    const flameColors = [0xf2914a, 0xf2c84a, 0xe85a3a];
    for (let i = 0; i < 3; i++) {
      const flame = new THREE.Mesh(
        new THREE.ConeGeometry(0.14 - i * 0.03, 0.4 - i * 0.08, 5),
        new THREE.MeshBasicMaterial({ color: flameColors[i] })
      );
      flame.position.y = 0.28 + i * 0.06;
      flames.push(flame);
      campfire.add(flame);
    }
    const fireLight = new THREE.PointLight(0xf2914a, 1.2, 6);
    fireLight.position.y = 0.6;
    campfire.add(fireLight);
    campfire.position.set(1.3, 0.25, 0.8);
    islandC.add(campfire);

    /* cat — sits by the fire; clicking her is the easter egg */
    const cat = new THREE.Group();
    const catMat = new THREE.MeshStandardMaterial({ color: 0x2a2a3a, flatShading: true });
    const catBody = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.22, 0.18), catMat);
    catBody.position.y = 0.16;
    cat.add(catBody);
    const catHead = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.18, 0.18), catMat);
    catHead.position.set(0.16, 0.32, 0);
    cat.add(catHead);
    const earL = new THREE.Mesh(new THREE.ConeGeometry(0.05, 0.1, 4), catMat);
    earL.position.set(0.16, 0.45, 0.05);
    cat.add(earL);
    const earR = earL.clone();
    earR.position.z = -0.05;
    cat.add(earR);
    const catTail = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.3, 6), catMat);
    catTail.position.set(-0.18, 0.22, 0);
    catTail.rotation.z = Math.PI / 3;
    cat.add(catTail);
    cat.position.set(2.1, 0.25, 0);
    cat.rotation.y = 2.4;
    islandC.add(cat);

    const treeC = makeTree(1);
    treeC.position.set(0.8, 0.25, -2.2);
    islandC.add(treeC);

    const flowerColors = [0xe88aa8, 0xf2d06b, 0xf4f0e8];
    for (let i = 0; i < 8; i++) {
      const a = Math.random() * Math.PI * 2;
      const r = 1.2 + Math.random() * 2.2;
      const head = new THREE.Mesh(
        new THREE.IcosahedronGeometry(0.07, 0),
        new THREE.MeshStandardMaterial({ color: flowerColors[i % 3], flatShading: true })
      );
      head.position.set(Math.cos(a) * r, 0.38, Math.sin(a) * r);
      islandC.add(head);
    }

    /* ============================================================
       THE SEA — lighthouse island + hot-air balloon with mailbox
       ============================================================ */
    /* low-poly water with gentle rolling waves (animated in the tick) */
    const seaGeo = new THREE.PlaneGeometry(190, 190, 52, 52);
    const sea = new THREE.Mesh(
      seaGeo,
      new THREE.MeshStandardMaterial({
        color: 0x64a8c8,
        flatShading: true,
        roughness: 0.45,
        metalness: 0.15,
      })
    );
    sea.rotation.x = -Math.PI / 2;
    sea.position.y = -12;
    scene.add(sea);

    const shoreIsland = new THREE.Group();
    const sandGeo = new THREE.CylinderGeometry(4.5, 5, 0.8, 10, 2);
    roughen(sandGeo, 0.35);
    const sand = new THREE.Mesh(
      sandGeo,
      new THREE.MeshStandardMaterial({
        color: 0xe8d4a8,
        flatShading: true,
        roughness: 1,
        map: noiseTexture(0.1, 3),
      })
    );
    sand.receiveShadow = true;
    shoreIsland.add(sand);
    shoreIsland.position.set(-3, -11.6, -3);
    scene.add(shoreIsland);

    const lighthouse = new THREE.Group();
    const lhBase = new THREE.Mesh(
      new THREE.CylinderGeometry(0.6, 0.78, 2.6, 10),
      new THREE.MeshStandardMaterial({ color: 0xf2e4d4, flatShading: true })
    );
    lhBase.position.y = 1.7;
    lhBase.castShadow = true;
    lighthouse.add(lhBase);
    const lhStripe = new THREE.Mesh(
      new THREE.CylinderGeometry(0.62, 0.7, 0.45, 10),
      new THREE.MeshStandardMaterial({ color: 0xc85a5a, flatShading: true })
    );
    lhStripe.position.y = 1.9;
    lighthouse.add(lhStripe);
    const lhLamp = new THREE.Mesh(
      new THREE.SphereGeometry(0.3, 10, 10),
      new THREE.MeshBasicMaterial({ color: 0xfff2a8 })
    );
    lhLamp.position.y = 3.25;
    lighthouse.add(lhLamp);
    const lhRoof = new THREE.Mesh(
      new THREE.ConeGeometry(0.5, 0.5, 10),
      new THREE.MeshStandardMaterial({ color: 0xc85a5a, flatShading: true })
    );
    lhRoof.position.y = 3.7;
    lighthouse.add(lhRoof);
    lighthouse.position.set(-1, 0.3, -1);
    shoreIsland.add(lighthouse);

    const palmA = makeTree(0.9);
    palmA.position.set(1.8, 0.4, 1.4);
    shoreIsland.add(palmA);

    /* hot-air balloon carrying the mailbox */
    const balloon = new THREE.Group();
    const envelope = new THREE.Mesh(
      new THREE.SphereGeometry(1.5, 12, 12),
      new THREE.MeshStandardMaterial({ color: 0xc85a8a, flatShading: true })
    );
    envelope.scale.y = 1.15;
    envelope.castShadow = true;
    balloon.add(envelope);
    const stripe = new THREE.Mesh(
      new THREE.SphereGeometry(1.51, 12, 12, 0, Math.PI * 2, Math.PI * 0.35, Math.PI * 0.3),
      new THREE.MeshStandardMaterial({ color: 0xf2d06b, flatShading: true })
    );
    stripe.scale.y = 1.15;
    balloon.add(stripe);
    const basket = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.6, 0.9), woodMat);
    basket.position.y = -2.5;
    basket.castShadow = true;
    balloon.add(basket);
    for (const [bx, bz] of [
      [-0.4, -0.4],
      [0.4, -0.4],
      [-0.4, 0.4],
      [0.4, 0.4],
    ]) {
      const ropeGeo = new THREE.CylinderGeometry(0.02, 0.02, 1.1, 4);
      const rope = new THREE.Mesh(ropeGeo, darkMat);
      rope.position.set(bx, -1.7, bz);
      balloon.add(rope);
    }
    const mailbox = new THREE.Mesh(
      new THREE.BoxGeometry(0.4, 0.3, 0.5),
      new THREE.MeshStandardMaterial({ color: 0x9a5a5a, flatShading: true })
    );
    mailbox.position.y = -2.05;
    balloon.add(mailbox);
    const flag = new THREE.Mesh(
      new THREE.BoxGeometry(0.05, 0.22, 0.05),
      new THREE.MeshStandardMaterial({ color: 0xf2d06b, flatShading: true })
    );
    flag.position.set(0.18, -1.85, 0.2);
    balloon.add(flag);
    balloon.position.set(1.5, -6, 1);
    scene.add(balloon);

    /* ---------- clouds ---------- */
    const clouds: { group: THREE.Group; speed: number; angle: number; r: number; baseY: number }[] = [];
    function addCloudRing(count: number, yMin: number, yMax: number, rMin: number, rMax: number) {
      for (let i = 0; i < count; i++) {
        const g = new THREE.Group();
        const blobs = 3 + Math.floor(Math.random() * 3);
        for (let b = 0; b < blobs; b++) {
          const blob = new THREE.Mesh(
            new THREE.IcosahedronGeometry(0.6 + Math.random() * 0.7, 0),
            cloudMat
          );
          blob.position.set(b * 0.8 - blobs * 0.35, Math.random() * 0.3, Math.random() * 0.5);
          blob.scale.y = 0.55;
          g.add(blob);
        }
        const angle = Math.random() * Math.PI * 2;
        const r = rMin + Math.random() * (rMax - rMin);
        const y = yMin + Math.random() * (yMax - yMin);
        g.position.set(Math.cos(angle) * r, y, Math.sin(angle) * r);
        const s = 0.8 + Math.random() * 1.4;
        g.scale.setScalar(s);
        scene.add(g);
        clouds.push({ group: g, speed: 0.008 + Math.random() * 0.012, angle, r, baseY: y });
      }
    }
    addCloudRing(10, 38, 48, 17, 34); // the cloud deck you start in
    addCloudRing(4, 22, 26, 16, 30);
    addCloudRing(4, 10, 13, 16, 30);
    addCloudRing(3, -4, -1, 18, 32);

    /* ---------- camera path ---------- */
    const camCurve = new THREE.CatmullRomCurve3(
      [
        new THREE.Vector3(0, 50, 26),
        new THREE.Vector3(6, 38, 11),
        new THREE.Vector3(-2, 24, -10),
        new THREE.Vector3(2, 11.5, -8),
        new THREE.Vector3(2, -2, 10),
        new THREE.Vector3(0, -5, 11),
      ],
      false,
      "centripetal"
    );
    const lookCurve = new THREE.CatmullRomCurve3(
      [
        new THREE.Vector3(0, 42, 0),
        new THREE.Vector3(-7, 31.5, -2),
        new THREE.Vector3(7, 19, 0),
        new THREE.Vector3(-6, 6.8, 2),
        new THREE.Vector3(1, -6.5, 1),
        new THREE.Vector3(0, -7.5, -1),
      ],
      false,
      "centripetal"
    );

    /* ---------- collectible stars along the path ---------- */
    const starTs = Array.from({ length: STAR_COUNT }, (_, i) => 0.08 + (i * 0.86) / (STAR_COUNT - 1));
    const collectibles: { mesh: THREE.Mesh; t: number; collected: boolean; pop: number }[] = [];
    const starMat = new THREE.MeshStandardMaterial({
      color: 0xffd84a,
      emissive: 0xa87818,
      flatShading: true,
      metalness: 0.3,
      roughness: 0.35,
    });
    starTs.forEach((st) => {
      const cp = camCurve.getPoint(st);
      const lp = lookCurve.getPoint(st);
      const pos = cp.clone().lerp(lp, 0.3);
      pos.x += (Math.random() - 0.5) * 2;
      pos.y += (Math.random() - 0.5) * 1.5;
      const mesh = new THREE.Mesh(new THREE.OctahedronGeometry(0.32, 0), starMat.clone());
      mesh.position.copy(pos);
      scene.add(mesh);
      collectibles.push({ mesh, t: st, collected: false, pop: 0 });
    });
    let foundCount = 0;

    /* ---------- cat click (easter egg) ---------- */
    const raycaster = new THREE.Raycaster();
    const clickPointer = new THREE.Vector2();
    function onWindowClick(e: MouseEvent) {
      clickPointer.x = (e.clientX / window.innerWidth) * 2 - 1;
      clickPointer.y = -(e.clientY / window.innerHeight) * 2 + 1;
      raycaster.setFromCamera(clickPointer, camera);
      if (raycaster.intersectObject(cat, true).length > 0) {
        setCatToast(true);
        window.clearTimeout(catToastTimer.current);
        catToastTimer.current = window.setTimeout(() => setCatToast(false), 3200);
      }
    }
    window.addEventListener("click", onWindowClick);

    /* hovering the cat shows a pointer cursor */
    function onWindowMove(e: PointerEvent) {
      if (e.pointerType === "touch") return;
      clickPointer.x = (e.clientX / window.innerWidth) * 2 - 1;
      clickPointer.y = -(e.clientY / window.innerHeight) * 2 + 1;
      raycaster.setFromCamera(clickPointer, camera);
      document.body.style.cursor =
        raycaster.intersectObject(cat, true).length > 0 ? "pointer" : "";
    }
    window.addEventListener("pointermove", onWindowMove);

    /* ---------- scroll → progress ---------- */
    function readScroll() {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      return max > 0 ? THREE.MathUtils.clamp(window.scrollY / max, 0, 1) : 0;
    }

    // start at the restored scroll position so a mid-page reload
    // doesn't replay the whole flight (and hoover up every star)
    let progress = readScroll();
    let currentSection: SectionId = "hero";

    /* ---------- main loop ---------- */
    const camPos = new THREE.Vector3();
    const lookPos = new THREE.Vector3();
    let frame = 0;
    let raf = 0;
    function tick() {
      frame++;
      const time = frame * 0.016;

      progress += (readScroll() - progress) * 0.07;

      camCurve.getPoint(progress, camPos);
      lookCurve.getPoint(progress, lookPos);
      /* gentle idle drift so the world never feels frozen */
      camPos.x += Math.sin(time * 0.4) * 0.25;
      camPos.y += Math.cos(time * 0.3) * 0.15;
      camera.position.copy(camPos);
      camera.lookAt(lookPos);
      sky.position.copy(camera.position);

      /* background stars fade out as you descend */
      bgStarMat.opacity = THREE.MathUtils.clamp((camera.position.y - 18) / 22, 0, 1) * 0.9;

      /* ferris wheel turns; gondolas stay upright */
      wheel.rotation.z = time * 0.3;
      cabins.forEach((c) => {
        c.rotation.z = -wheel.rotation.z;
      });

      /* water wheel turns with the stream; foam drifts downstream */
      waterWheel.rotation.y = time * 0.7;
      foam.forEach((f, i) => {
        f.position.z = ((time * 0.5 + i * 1.3) % 5) - 2.45;
      });

      /* hens wander the pen, waddling and bobbing */
      hens.forEach((h) => {
        const t = time * h.speed + h.phase;
        const wander = h.r + Math.sin(t * 1.7) * 0.12;
        h.g.position.set(Math.cos(t) * wander, Math.abs(Math.sin(t * 9)) * 0.03, Math.sin(t) * wander);
        h.g.rotation.y = -(t + Math.PI / 2) + Math.sin(t * 5) * 0.2;
      });

      /* flames flicker */
      flames.forEach((f, i) => {
        f.scale.y = 1 + Math.sin(time * 9 + i * 2) * 0.25;
        f.rotation.y = time * (2 + i);
      });
      fireLight.intensity = 1 + Math.sin(time * 8) * 0.25 + Math.sin(time * 13) * 0.15;

      /* cat tail */
      catTail.rotation.z = Math.PI / 3 + Math.sin(time * 3) * 0.25;

      /* islands bob gently */
      islandA.position.y = 30 + Math.sin(time * 0.5) * 0.3;
      islandB.position.y = 18 + Math.sin(time * 0.45 + 2) * 0.3;
      islandC.position.y = 6 + Math.sin(time * 0.55 + 4) * 0.3;

      /* balloon drifts */
      balloon.position.y = -6 + Math.sin(time * 0.6) * 0.4;
      balloon.position.x = 1.5 + Math.sin(time * 0.25) * 0.6;
      balloon.rotation.y = Math.sin(time * 0.3) * 0.15;

      /* lighthouse lamp pulses */
      const pulse = 0.7 + Math.sin(time * 1.8) * 0.3;
      lhLamp.scale.setScalar(pulse);

      /* clouds drift in slow circles */
      clouds.forEach((c) => {
        c.angle += c.speed * 0.016;
        c.group.position.x = Math.cos(c.angle) * c.r;
        c.group.position.z = Math.sin(c.angle) * c.r;
      });

      /* rolling waves — skip when the camera is too high to see them */
      if (camera.position.y < 26) {
        const wp = seaGeo.attributes.position as THREE.BufferAttribute;
        for (let i = 0; i < wp.count; i++) {
          const x = wp.getX(i);
          const y = wp.getY(i);
          wp.setZ(
            i,
            Math.sin(x * 0.22 + time * 0.9) * 0.22 +
              Math.cos(y * 0.18 + time * 0.7) * 0.22 +
              Math.sin((x + y) * 0.1 + time * 0.5) * 0.12
          );
        }
        wp.needsUpdate = true;
      }

      /* collectible stars: spin, collect when the camera passes */
      collectibles.forEach((c) => {
        if (c.collected) {
          if (c.pop > 0) {
            c.pop--;
            c.mesh.scale.setScalar((c.pop / 14) * 1.6);
            if (c.pop === 0) c.mesh.visible = false;
          }
          return;
        }
        c.mesh.rotation.y = time * 2;
        c.mesh.rotation.x = time * 1.3;
        const twinkle = 1 + Math.sin(time * 4 + c.t * 50) * 0.15;
        c.mesh.scale.setScalar(twinkle);
        if (Math.abs(progress - c.t) < 0.012) {
          c.collected = true;
          c.pop = 14;
          foundCount++;
          setStarsFound(foundCount);
        }
      });

      /* publish the active section to React only when it changes */
      let next: SectionId = "hero";
      for (const s of SECTIONS) {
        if (progress >= s.window[0] && progress < s.window[1]) {
          next = s.id;
          break;
        }
        if (progress >= s.window[1]) next = s.id;
      }
      const inWindow = SECTIONS.some(
        (s) => progress >= s.window[0] && progress < s.window[1] && s.id === next
      );
      const effective: SectionId | "between" = inWindow ? next : "between" as const;
      if (effective !== "between" && effective !== currentSection) {
        currentSection = effective;
        setActiveSection(effective);
      } else if (effective === "between" && currentSection !== "hero") {
        // keep last section's card until the next window opens — no flicker
      }

      renderer.render(scene, camera);
      raf = requestAnimationFrame(tick);
    }
    tick();

    function onResize() {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    }
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("click", onWindowClick);
      window.removeEventListener("pointermove", onWindowMove);
      window.clearTimeout(catToastTimer.current);
      document.body.style.cursor = "";
      if (renderer.domElement.parentNode === mount) {
        mount.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ---------- scroll-to helpers for the progress nav ---------- */
  function scrollToProgress(p: number) {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    window.scrollTo({ top: p * max, behavior: "smooth" });
  }

  const ink = "#3a2d4a";
  const cream = "#f4e4d4";
  const fontStack = "var(--font-display), var(--font-geist-sans), system-ui, sans-serif";

  if (webglFailed) {
    return (
      <div
        style={{
          minHeight: "100dvh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 16,
          background: "#e8c5d6",
          color: ink,
          fontFamily: fontStack,
          textAlign: "center",
          padding: 24,
        }}
      >
        <div style={{ fontSize: 48 }}>🎈</div>
        <h1 style={{ fontSize: 32, fontWeight: 700, margin: 0 }}>freitagskind apps</h1>
        <p style={{ maxWidth: 420, lineHeight: 1.6, margin: 0, opacity: 0.85 }}>
          Our little 3D world needs WebGL, which your browser doesn&apos;t support. The classic
          site has everything too:
        </p>
        <a
          href="/classic"
          style={{
            marginTop: 8,
            padding: "12px 26px",
            borderRadius: 24,
            background: ink,
            color: cream,
            textDecoration: "none",
            fontWeight: 600,
          }}
        >
          Visit the classic site →
        </a>
      </div>
    );
  }

  return (
    <div style={{ fontFamily: fontStack }}>
      <style>{`
        @keyframes bounceDown {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(8px); }
        }
        @keyframes popToast {
          0% { opacity: 0; transform: translate(-50%, 12px) scale(0.9); }
          12% { opacity: 1; transform: translate(-50%, 0) scale(1); }
          88% { opacity: 1; transform: translate(-50%, 0) scale(1); }
          100% { opacity: 0; transform: translate(-50%, -8px) scale(0.95); }
        }
        @keyframes starPop {
          0% { transform: scale(1); }
          50% { transform: scale(1.5) rotate(20deg); }
          100% { transform: scale(1); }
        }
        .journey-card {
          transition: opacity 0.6s ease, transform 0.6s ease;
        }
        @media (max-width: 640px) {
          .chapter-card {
            top: auto !important;
            bottom: 20px !important;
            left: 16px !important;
            right: 16px !important;
            width: auto !important;
            transform: none !important;
            padding: 24px 26px 22px !important;
          }
        }
      `}</style>

      {/* scroll length */}
      <div style={{ height: `${SCROLL_PAGES * 100}vh` }} />

      {/* fixed 3D canvas */}
      <div ref={mountRef} style={{ position: "fixed", inset: 0, zIndex: 0 }} />

      {/* ---------- HUD ---------- */}
      <div
        style={{
          position: "fixed",
          top: 24,
          left: 28,
          zIndex: 3,
          color: ink,
          letterSpacing: "0.05em",
          pointerEvents: "none",
        }}
      >
        <div style={{ fontSize: 13, opacity: 0.7, textTransform: "uppercase" }}>freitagskind</div>
        <div style={{ fontSize: 22, fontWeight: 700, marginTop: 2 }}>apps</div>
      </div>

      <div
        style={{
          position: "fixed",
          top: 26,
          right: 28,
          zIndex: 3,
          display: "flex",
          gap: 16,
          alignItems: "center",
        }}
      >
        <div
          key={starsFound}
          title={starsFound === STAR_COUNT ? "You caught them all!" : "Catch the stars as you fly"}
          style={{
            fontSize: 14,
            fontWeight: 700,
            color: ink,
            background: "rgba(244,228,212,0.6)",
            backdropFilter: "blur(6px)",
            padding: "6px 14px",
            borderRadius: 18,
            animation: starsFound > 0 ? "starPop 0.4s ease" : "none",
          }}
        >
          ⭐ {starsFound}/{STAR_COUNT}
          {starsFound === STAR_COUNT ? " ✨" : ""}
        </div>
        <a
          href="/classic"
          style={{
            color: ink,
            fontSize: 13,
            textDecoration: "none",
            borderBottom: "1px solid rgba(58,45,74,0.35)",
            paddingBottom: 2,
          }}
        >
          Classic site →
        </a>
      </div>

      {/* progress nav — one dot per chapter */}
      <div
        style={{
          position: "fixed",
          right: 22,
          top: "50%",
          transform: "translateY(-50%)",
          zIndex: 3,
          display: "flex",
          flexDirection: "column",
          gap: 14,
          alignItems: "center",
        }}
      >
        {SECTIONS.map((s) => (
          <button
            key={s.id}
            onClick={() => scrollToProgress((s.window[0] + s.window[1]) / 2)}
            aria-label={s.title || "Top"}
            title={s.title || "freitagskind apps"}
            style={{
              width: activeSection === s.id ? 14 : 9,
              height: activeSection === s.id ? 14 : 9,
              borderRadius: "50%",
              border: "none",
              cursor: "pointer",
              background: activeSection === s.id ? ink : "rgba(58,45,74,0.35)",
              transition: "all 0.3s ease",
              padding: 0,
            }}
          />
        ))}
      </div>

      {/* ---------- hero ---------- */}
      <div
        className="journey-card"
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 2,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          color: ink,
          padding: 24,
          pointerEvents: "none",
          opacity: activeSection === "hero" ? 1 : 0,
          transform: activeSection === "hero" ? "translateY(0)" : "translateY(-30px)",
        }}
      >
        <div style={{ fontSize: 14, letterSpacing: "0.3em", textTransform: "uppercase", opacity: 0.7 }}>
          an independent app studio
        </div>
        <h1
          style={{
            fontSize: "clamp(44px, 9vw, 92px)",
            fontWeight: 700,
            lineHeight: 1.02,
            margin: "12px 0 18px",
            letterSpacing: "-0.02em",
          }}
        >
          tiny apps,
          <br />
          made with love
        </h1>
        <p style={{ fontSize: 17, maxWidth: 440, lineHeight: 1.6, margin: 0, opacity: 0.85 }}>
          Welcome to the world of freitagskind apps. Scroll to begin the descent — and catch the
          stars on your way down.
        </p>
        <div style={{ marginTop: 40, fontSize: 26, animation: "bounceDown 1.6s ease-in-out infinite" }}>
          ↓
        </div>
      </div>

      {/* ---------- chapter cards ---------- */}
      {SECTIONS.filter((s) => s.id !== "hero").map((s) => {
        const active = activeSection === s.id;
        return (
          <div
            key={s.id}
            className="journey-card chapter-card"
            style={{
              position: "fixed",
              zIndex: 2,
              top: "50%",
              [s.side]: "clamp(20px, 7vw, 110px)",
              transform: active ? "translateY(-50%)" : "translateY(calc(-50% + 40px))",
              opacity: active ? 1 : 0,
              pointerEvents: active ? "auto" : "none",
              width: "min(420px, calc(100vw - 48px))",
              background: "rgba(244,228,212,0.92)",
              backdropFilter: "blur(10px)",
              borderRadius: 28,
              padding: "30px 34px 28px",
              boxShadow: "0 24px 60px rgba(20,14,40,0.3)",
              color: ink,
            } as React.CSSProperties}
          >
            <div
              style={{
                fontSize: 11,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                opacity: 0.6,
                marginBottom: 10,
              }}
            >
              {s.tag}
            </div>
            <h2 style={{ fontSize: 32, margin: "0 0 14px", fontWeight: 700, letterSpacing: "-0.02em" }}>
              {s.title}
            </h2>
            <p style={{ fontSize: 15, lineHeight: 1.65, margin: 0, opacity: 0.9 }}>{s.body}</p>
            {s.id === "contact" && (
              <>
                <a
                  href="mailto:freitagskindapps@gmail.com"
                  style={{
                    display: "inline-block",
                    marginTop: 18,
                    padding: "11px 22px",
                    borderRadius: 22,
                    background: ink,
                    color: cream,
                    textDecoration: "none",
                    fontSize: 14,
                    fontWeight: 600,
                  }}
                >
                  freitagskindapps@gmail.com
                </a>
                <div style={{ marginTop: 18, display: "flex", gap: 16, fontSize: 12, opacity: 0.7 }}>
                  <a href="/classic" style={{ color: ink }}>
                    Classic site
                  </a>
                  <a href="/imprint" style={{ color: ink }}>
                    Imprint
                  </a>
                </div>
              </>
            )}
          </div>
        );
      })}

      {/* cat toast */}
      {catToast && (
        <div
          style={{
            position: "fixed",
            bottom: 90,
            left: "50%",
            zIndex: 4,
            background: "rgba(58,45,74,0.92)",
            color: cream,
            padding: "10px 22px",
            borderRadius: 24,
            fontSize: 14,
            fontWeight: 600,
            animation: "popToast 3.2s ease forwards",
            pointerEvents: "none",
          }}
        >
          🐈 miau. (her name is whatever you decide. she is not for sale.)
        </div>
      )}
    </div>
  );
}
