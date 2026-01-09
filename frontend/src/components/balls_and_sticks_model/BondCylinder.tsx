import React from "react";
import { Vector3, Quaternion } from "three";
import { Atom, getAtomColor } from "../../utils/pdbParser";

interface BondCylinderProps {
	atom1: Atom;
	atom2: Atom;
}

export default function BondCylinder({ atom1, atom2 }: BondCylinderProps) {
	const start = new Vector3(atom1.x, atom1.y, atom1.z);
	const end = new Vector3(atom2.x, atom2.y, atom2.z);
	const distance = start.distanceTo(end);
	const direction = new Vector3().subVectors(end, start).normalize();

	// Calculate rotation to align cylinder with bond
	const quaternion = new Quaternion().setFromUnitVectors(
		new Vector3(0, 1, 0),
		direction
	);

	const color1 = getAtomColor(atom1.element);
	const color2 = getAtomColor(atom2.element);

	// Create two half-cylinders with different colors
	const halfDistance = distance / 2;
	const firstHalfPosition = new Vector3().addVectors(
		start,
		direction.clone().multiplyScalar(halfDistance / 2)
	);
	const secondHalfPosition = new Vector3().addVectors(
		end,
		direction.clone().multiplyScalar(-halfDistance / 2)
	);

	return (
		<>
			{/* First half of bond */}
			<mesh
				position={[
					firstHalfPosition.x,
					firstHalfPosition.y,
					firstHalfPosition.z,
				]}
				quaternion={[
					quaternion.x,
					quaternion.y,
					quaternion.z,
					quaternion.w,
				]}
			>
				<cylinderGeometry args={[0.1, 0.1, halfDistance, 8]} />
				<meshStandardMaterial color={color1} />
			</mesh>

			{/* Second half of bond */}
			<mesh
				position={[
					secondHalfPosition.x,
					secondHalfPosition.y,
					secondHalfPosition.z,
				]}
				quaternion={[
					quaternion.x,
					quaternion.y,
					quaternion.z,
					quaternion.w,
				]}
			>
				<cylinderGeometry args={[0.1, 0.1, halfDistance, 8]} />
				<meshStandardMaterial color={color2} />
			</mesh>
		</>
	);
}
