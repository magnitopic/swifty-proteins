import { useMemo } from "react";
import { Atom, getAtomColor, getCenterOfMass, PDBData, VDW_RADII } from "../../utils/pdbParser";
import React from "react";
import { ThreeEvent } from "@react-three/fiber/native";

interface SF_MoleculeModelProps {
  pdbData: PDBData;
  onAtomClick?: (atom: Atom) => void;
}

export default function SF_MoleculeModel({
  pdbData,
  onAtomClick,
}: SF_MoleculeModelProps) {

  const { atoms } = pdbData;
  const center = useMemo(() => getCenterOfMass(atoms), [atoms]);

  const handleAtomClick = (event: ThreeEvent<MouseEvent>, atom: Atom) => {
    event.stopPropagation();
    onAtomClick?.(atom);
  };

  return (
    <group>
      {atoms.map((atom) => (
        <mesh
          key={atom.serial}
          position={[atom.x - center[0], atom.y - center[1], atom.z - center[2]]}
          onClick={(e) => handleAtomClick(e, atom)}
        >
          {/* Sphere geometry: radius defines the Space-filling model */}
          <sphereGeometry args={[VDW_RADII[atom.element] || 1.5, 24, 24]} />
          <meshStandardMaterial
            color={getAtomColor(atom.element)}
            roughness={0.3}
            metalness={0.1}
          />
        </mesh>
      ))}
    </group>
  );
}