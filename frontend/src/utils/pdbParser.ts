// CPK (Corey-Pauling-Koltun) color scheme for atoms
export const CPK_COLORS: { [key: string]: string } = {
	H: "#FFFFFF", // Hydrogen - White
	C: "#909090", // Carbon - Grey
	N: "#3050F8", // Nitrogen - Blue
	O: "#FF0D0D", // Oxygen - Red
	F: "#90E050", // Fluorine - Green
	CL: "#1FF01F", // Chlorine - Green
	BR: "#A62929", // Bromine - Dark Red
	I: "#940094", // Iodine - Purple
	HE: "#D9FFFF", // Helium - Cyan
	NE: "#B3E3F5", // Neon - Light Blue
	AR: "#80D1E3", // Argon - Light Blue
	XE: "#429EB0", // Xenon - Blue
	KR: "#5CB8D1", // Krypton - Light Blue
	P: "#FF8000", // Phosphorus - Orange
	S: "#FFFF30", // Sulfur - Yellow
	B: "#FFB5B5", // Boron - Pink
	LI: "#CC80FF", // Lithium - Purple
	NA: "#AB5CF2", // Sodium - Purple
	K: "#8F40D4", // Potassium - Purple
	RB: "#702EB0", // Rubidium - Purple
	CS: "#57178F", // Cesium - Purple
	FR: "#420066", // Francium - Purple
	BE: "#C2FF00", // Beryllium - Yellow-Green
	MG: "#8AFF00", // Magnesium - Green
	CA: "#3DFF00", // Calcium - Green
	SR: "#00FF00", // Strontium - Green
	BA: "#00D500", // Barium - Green
	RA: "#007D00", // Radium - Dark Green
	TI: "#BFC2C7", // Titanium - Grey
	FE: "#E06633", // Iron - Orange
	ZN: "#7D80B0", // Zinc - Blue-Grey
	DEFAULT: "#FF1493", // Default - Deep Pink
};

export interface Atom {
	serial: number;
	name: string;
	element: string;
	x: number;
	y: number;
	z: number;
	resName: string;
	chainId: string;
	resSeq: number;
}

export interface Bond {
	atom1: number;
	atom2: number;
}

export interface PDBData {
	atoms: Atom[];
	bonds: Bond[];
}

export function parsePDB(pdbText: string): PDBData {
	const lines = pdbText.split("\n");
	const atoms: Atom[] = [];
	const bonds: Bond[] = [];

	for (const line of lines) {
		const record = line.substring(0, 6).trim();

		if (record === "HETATM" || record === "ATOM") {
			// Parse ATOM/HETATM line
			const serial = parseInt(line.substring(6, 11).trim());
			const name = line.substring(12, 16).trim();
			const resName = line.substring(17, 20).trim();
			const chainId = line.substring(21, 22).trim();
			const resSeq = parseInt(line.substring(22, 26).trim());
			const x = parseFloat(line.substring(30, 38).trim());
			const y = parseFloat(line.substring(38, 46).trim());
			const z = parseFloat(line.substring(46, 54).trim());
			const element = line.substring(76, 78).trim() || name.charAt(0);

			atoms.push({
				serial,
				name,
				element: element.toUpperCase(),
				x,
				y,
				z,
				resName,
				chainId,
				resSeq,
			});
		} else if (record === "CONECT") {
			// Parse CONECT line for bonds
			const atomSerial = parseInt(line.substring(6, 11).trim());
			const bondedAtoms = [];

			for (let i = 11; i < line.length; i += 5) {
				const bondedSerial = parseInt(line.substring(i, i + 5).trim());
				if (!isNaN(bondedSerial)) {
					bondedAtoms.push(bondedSerial);
				}
			}

			for (const bondedSerial of bondedAtoms) {
				// Avoid duplicate bonds
				if (atomSerial < bondedSerial) {
					bonds.push({
						atom1: atomSerial,
						atom2: bondedSerial,
					});
				}
			}
		}
	}

	// If no CONECT records, infer bonds based on distance
	if (bonds.length === 0) {
		inferBonds(atoms, bonds);
	}

	return { atoms, bonds };
}

function inferBonds(atoms: Atom[], bonds: Bond[]): void {
	const MAX_BOND_DISTANCE = 1.8; // Angstroms

	for (let i = 0; i < atoms.length; i++) {
		for (let j = i + 1; j < atoms.length; j++) {
			const atom1 = atoms[i];
			const atom2 = atoms[j];

			const dx = atom1.x - atom2.x;
			const dy = atom1.y - atom2.y;
			const dz = atom1.z - atom2.z;
			const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);

			if (distance < MAX_BOND_DISTANCE) {
				bonds.push({
					atom1: atom1.serial,
					atom2: atom2.serial,
				});
			}
		}
	}
}

export function getAtomColor(element: string): string {
	return CPK_COLORS[element.toUpperCase()] || CPK_COLORS.DEFAULT;
}

export function getCenterOfMass(atoms: Atom[]): [number, number, number] {
	if (atoms.length === 0) return [0, 0, 0];

	let sumX = 0,
		sumY = 0,
		sumZ = 0;
	for (const atom of atoms) {
		sumX += atom.x;
		sumY += atom.y;
		sumZ += atom.z;
	}

	return [sumX / atoms.length, sumY / atoms.length, sumZ / atoms.length];
}
