import React, { useMemo } from 'react';
import * as THREE from 'three';
import { Atom, getCenterOfMass, PDBData } from '../../utils/pdbParser';


interface Ribbon_MoleculeModelProps {
  pdbData: PDBData;
  onAtomClick?: (atom: Atom) => void;
}

const getRibbonPoints = (atoms: Atom[]) => {
	const caAtoms = atoms.filter(atom => atom.name === "C" || atom.name.startsWith("C"));
	const targetAtoms = caAtoms.length > 0 ? caAtoms : atoms;

	return targetAtoms.map(atom => new THREE.Vector3(atom.x, atom.y, atom.z));
};

export default function Ribbon_MoleculeModel({
  pdbData,
  onAtomClick,
}: Ribbon_MoleculeModelProps) {
  const { atoms } = pdbData;

  const { curve, center } = useMemo(() => {
    // Get C points
    const points = getRibbonPoints(atoms);

    // Calculate center to avoid camera focusing on void
    const centerCoords = getCenterOfMass(atoms);
    const centerVec = new THREE.Vector3(...centerCoords);

    if (points.length < 2) return { curve: null, center: centerVec };

    // Normalize points (center them in 0,0,0)
    const normalizedPoints = points.map(p => p.clone().sub(centerVec));

    // Create the CatmullRomCurve3 (smooth curve passing through the points)
    const ribbonCurve = new THREE.CatmullRomCurve3(
      normalizedPoints,
      false,
      'centripetal',
      0.5
    );

    return { curve: ribbonCurve, center: centerVec };
  }, [atoms]);

  const ribbonShape = useMemo(() => {
    const shape = new THREE.Shape();
    const width = 0.7;  // Width of the ribbon
    const thickness = 0.01; // Thickness of the ribbon

    shape.moveTo(-width / 2, -thickness / 2);
    shape.lineTo(width / 2, -thickness / 2);
    shape.lineTo(width / 2, thickness / 2);
    shape.lineTo(-width / 2, thickness / 2);
    shape.lineTo(-width / 2, -thickness / 2);
    return shape;
  }, []);

  if (!curve) return null;

  return (
    <group>
      <mesh>
        <extrudeGeometry
          args={[
            ribbonShape,
            {
              steps: 200,
              extrudePath: curve,
              bevelEnabled: false
            }
          ]}
        />
        <meshStandardMaterial
          color="#f44aff"
          side={THREE.DoubleSide}
          roughness={0.2}
          metalness={0.5}
        />
      </mesh>
    </group>
  );
}