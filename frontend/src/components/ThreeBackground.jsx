import { useRef, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as random from 'maath/random/dist/maath-random.esm';

function Fallback() {
  return (
    <div className="fixed inset-0 z-0 bg-gradient-to-br from-slate-900 to-slate-800" />
  );
}

function Particles({ count = 2000 }) {
  const ref = useRef();
  
  // Generate random positions using maath
  const sphere = random.inSphere(new Float32Array(count * 3), { radius: 1.5 });

  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.x -= delta / 10;
      ref.current.rotation.y -= delta / 15;
    }
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={sphere} stride={3} frustumCulled={false}>
        <PointMaterial
          transparent
          color="#14b8a6"
          size={0.005}
          sizeAttenuation={true}
          depthWrite={false}
        />
      </Points>
    </group>
  );
}

export default function ThreeBackground() {
  return (
    <div className="fixed inset-0 z-0 bg-dark-bg">
      <Suspense fallback={<Fallback />}>
        <Canvas camera={{ position: [0, 0, 1] }} gl={{ antialias: true, alpha: true }}>
          <Particles count={3000} />
        </Canvas>
      </Suspense>
    </div>
  );
}
