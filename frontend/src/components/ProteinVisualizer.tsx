import React, { useRef } from "react";
import { View, StyleSheet } from "react-native";
import { Canvas, useFrame, useThree } from "@react-three/fiber/native";
import { PDBData, Atom } from "../utils/pdbParser";
import MoleculeModel from "./MoleculeModel";

interface ProteinVisualizerProps {
	pdbData: PDBData;
	onAtomClick?: (atom: Atom) => void;
}

// Interactive Camera with touch controls
function InteractiveCamera() {
	const { camera, gl } = useThree();
	const rotationRef = useRef({ x: 0, y: 0 });
	const lastTouchRef = useRef({ x: 0, y: 0 });
	const distanceRef = useRef(30);
	const isDraggingRef = useRef(false);

	React.useEffect(() => {
		const canvas = gl.domElement;

		const handleTouchStart = (e: TouchEvent) => {
			if (e.touches.length === 1) {
				isDraggingRef.current = true;
				lastTouchRef.current = {
					x: e.touches[0].clientX,
					y: e.touches[0].clientY,
				};
			}
		};

		const handleTouchMove = (e: TouchEvent) => {
			if (!isDraggingRef.current || e.touches.length !== 1) return;

			const deltaX = e.touches[0].clientX - lastTouchRef.current.x;
			const deltaY = e.touches[0].clientY - lastTouchRef.current.y;

			rotationRef.current.y += deltaX * 0.01;
			rotationRef.current.x += deltaY * 0.01;

			rotationRef.current.x = Math.max(
				-Math.PI / 2,
				Math.min(Math.PI / 2, rotationRef.current.x)
			);

			lastTouchRef.current = {
				x: e.touches[0].clientX,
				y: e.touches[0].clientY,
			};
		};

		const handleTouchEnd = () => {
			isDraggingRef.current = false;
		};

		let lastDistance = 0;
		const handleTouchMovePinch = (e: TouchEvent) => {
			if (e.touches.length === 2) {
				const dx = e.touches[0].clientX - e.touches[1].clientX;
				const dy = e.touches[0].clientY - e.touches[1].clientY;
				const distance = Math.sqrt(dx * dx + dy * dy);

				if (lastDistance > 0) {
					const delta = distance - lastDistance;
					distanceRef.current = Math.max(
						10,
						Math.min(100, distanceRef.current - delta * 0.05)
					);
				}

				lastDistance = distance;
			}
		};

		const handleTouchEndPinch = () => {
			lastDistance = 0;
		};

		canvas.addEventListener("touchstart", handleTouchStart);
		canvas.addEventListener("touchmove", handleTouchMove);
		canvas.addEventListener("touchmove", handleTouchMovePinch);
		canvas.addEventListener("touchend", handleTouchEnd);
		canvas.addEventListener("touchend", handleTouchEndPinch);

		return () => {
			canvas.removeEventListener("touchstart", handleTouchStart);
			canvas.removeEventListener("touchmove", handleTouchMove);
			canvas.removeEventListener("touchmove", handleTouchMovePinch);
			canvas.removeEventListener("touchend", handleTouchEnd);
			canvas.removeEventListener("touchend", handleTouchEndPinch);
		};
	}, [gl]);

	useFrame(() => {
		const theta = rotationRef.current.y;
		const phi = rotationRef.current.x + Math.PI / 2;

		camera.position.x =
			distanceRef.current * Math.sin(phi) * Math.cos(theta);
		camera.position.y = distanceRef.current * Math.cos(phi);
		camera.position.z =
			distanceRef.current * Math.sin(phi) * Math.sin(theta);

		camera.lookAt(0, 0, 0);
	});

	return null;
}

export default function ProteinVisualizer({
	pdbData,
	onAtomClick,
}: ProteinVisualizerProps) {
	return (
		<View style={styles.container}>
			<Canvas
				camera={{ position: [0, 0, 30], fov: 50 }}
				gl={{ antialias: true, alpha: true }}
			>
				<ambientLight intensity={0.5} />
				<directionalLight position={[10, 10, 5]} intensity={1} />
				<directionalLight position={[-10, -10, -5]} intensity={0.5} />
				<InteractiveCamera />
				<MoleculeModel pdbData={pdbData} onAtomClick={onAtomClick} />
			</Canvas>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#1a1a1a",
	},
});
