import React, { useRef } from "react";
import { Mesh } from "three";
import { ThreeEvent } from "@react-three/fiber/native";
import { Atom, getAtomColor } from "../utils/pdbParser";

interface AtomSphereProps {
	atom: Atom;
	onClick?: (event: ThreeEvent<MouseEvent>) => void;
}

// Atom radius scale (van der Waals radii approximation)
const ATOM_RADIUS: { [key: string]: number } = {
	H: 0.3,
	C: 0.4,
	N: 0.35,
	O: 0.35,
	P: 0.45,
	S: 0.45,
	DEFAULT: 0.4,
};

export default function AtomSphere({ atom, onClick }: AtomSphereProps) {
	const meshRef = useRef<Mesh>(null);
	const color = getAtomColor(atom.element);
	const radius = ATOM_RADIUS[atom.element] || ATOM_RADIUS.DEFAULT;

	return (
		<mesh
			ref={meshRef}
			position={[atom.x, atom.y, atom.z]}
			onClick={onClick}
		>
			<sphereGeometry args={[radius, 16, 16]} />
			<meshStandardMaterial color={color} />
		</mesh>
	);
}
