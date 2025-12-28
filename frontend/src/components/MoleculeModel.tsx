import React, { useRef, useState } from "react";
import { ThreeEvent } from "@react-three/fiber/native";
import { Mesh, Vector3 } from "three";
import {
	PDBData,
	Atom,
	getAtomColor,
	getCenterOfMass,
} from "../utils/pdbParser";
import AtomSphere from "./AtomSphere";
import BondCylinder from "./BondCylinder";

interface MoleculeModelProps {
	pdbData: PDBData;
	onAtomClick?: (atom: Atom) => void;
}

export default function MoleculeModel({
	pdbData,
	onAtomClick,
}: MoleculeModelProps) {
	const groupRef = useRef<any>();
	const { atoms, bonds } = pdbData;

	// Center the molecule
	const [centerX, centerY, centerZ] = getCenterOfMass(atoms);

	// Create a lookup map for atoms by serial number
	const atomMap = new Map<number, Atom>();
	atoms.forEach((atom) => atomMap.set(atom.serial, atom));

	const handleAtomClick = (event: ThreeEvent<MouseEvent>, atom: Atom) => {
		event.stopPropagation();
		onAtomClick?.(atom);
	};

	return (
		<group ref={groupRef} position={[-centerX, -centerY, -centerZ]}>
			{/* Render atoms as spheres */}
			{atoms.map((atom) => (
				<AtomSphere
					key={atom.serial}
					atom={atom}
					onClick={(e) => handleAtomClick(e, atom)}
				/>
			))}

			{/* Render bonds as cylinders */}
			{bonds.map((bond, index) => {
				const atom1 = atomMap.get(bond.atom1);
				const atom2 = atomMap.get(bond.atom2);

				if (!atom1 || !atom2) return null;

				return (
					<BondCylinder
						key={`bond-${index}`}
						atom1={atom1}
						atom2={atom2}
					/>
				);
			})}
		</group>
	);
}
