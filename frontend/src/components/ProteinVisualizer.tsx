import React, { useRef } from "react";
import { View, StyleSheet, PanResponder } from "react-native";
import { Canvas, useFrame, useThree } from "@react-three/fiber/native";
import { PDBData, Atom } from "../utils/pdbParser";
import BS_MoleculeModel from "./balls_and_sticks_model/BS_MoleculeModel";
import SF_MoleculeModel from "./space_filling_model/SF_MoleculeModel";
import Ribbon_MoleculeModel from "./ribbon_model/Ribbon_MoleculeModel";

interface ProteinVisualizerProps {
	pdbData: PDBData;
	onAtomClick?: (atom: Atom) => void;
	displayMode: "space-filling" | "ribbon" | "ball-stick";
}

// Configuration for gesture sensitivity
const ROTATION_SPEED = 0.01; // Lower = slower rotation
const ZOOM_SPEED = 0.07; // Pinch zoom sensitivity
const MOVEMENT_THRESHOLD = 5; // Minimum pixels to move before capturing gesture

// Shared rotation and distance refs accessible by both gesture handler and camera
const rotationRef = { current: { x: 0, y: 0 } };
const distanceRef = { current: 30 };

// Interactive Camera with touch controls
function InteractiveCamera() {
	const { camera } = useThree();

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
	displayMode,
}: ProteinVisualizerProps) {
	const lastDistanceRef = useRef(0);
	const lastTouchRef = useRef({ x: 0, y: 0 });
	const hasMoved = useRef(false);

	const panResponder = useRef(
		PanResponder.create({
			onStartShouldSetPanResponder: (evt) => {
				// Immediately capture if it's a multi-touch (pinch)
				return evt.nativeEvent.touches.length === 2;
			},
			onMoveShouldSetPanResponder: (evt, gestureState) => {
				// Only capture single touch gestures if moved beyond threshold
				// This allows taps to pass through to atom click handlers
				const moved = Math.abs(gestureState.dx) > MOVEMENT_THRESHOLD ||
					Math.abs(gestureState.dy) > MOVEMENT_THRESHOLD;
				const isMultiTouch = evt.nativeEvent.touches.length === 2;
				return moved || isMultiTouch;
			},
			onPanResponderGrant: (evt) => {
				lastDistanceRef.current = 0;
				hasMoved.current = false;
				const touch = evt.nativeEvent.touches[0];
				if (touch) {
					lastTouchRef.current = { x: touch.pageX, y: touch.pageY };
				}
			},
			onPanResponderMove: (evt, gestureState) => {
				const touches = evt.nativeEvent.touches;
				hasMoved.current = true;

				if (touches.length === 2) {
					// Pinch to zoom
					const dx = touches[0].pageX - touches[1].pageX;
					const dy = touches[0].pageY - touches[1].pageY;
					const distance = Math.sqrt(dx * dx + dy * dy);

					if (lastDistanceRef.current > 0) {
						const delta = distance - lastDistanceRef.current;
						distanceRef.current = Math.max(
							10,
							Math.min(100, distanceRef.current - delta * ZOOM_SPEED)
						);
					}

					lastDistanceRef.current = distance;
				} else if (touches.length === 1) {
					// Single touch to rotate - calculate delta from last position
					const currentX = touches[0].pageX;
					const currentY = touches[0].pageY;

					const deltaX = currentX - lastTouchRef.current.x;
					const deltaY = currentY - lastTouchRef.current.y;

					rotationRef.current.y += deltaX * ROTATION_SPEED;
					rotationRef.current.x -= deltaY * ROTATION_SPEED; // Inverted for natural movement

					// Clamp vertical rotation to prevent flipping
					rotationRef.current.x = Math.max(
						-Math.PI / 2,
						Math.min(Math.PI / 2, rotationRef.current.x)
					);

					// Update last position
					lastTouchRef.current = { x: currentX, y: currentY };
				}
			},
			onPanResponderRelease: () => {
				lastDistanceRef.current = 0;
			},
		})
	).current;

	return (
		<View style={styles.container} {...panResponder.panHandlers}>
			<Canvas
				camera={{ position: [0, 0, 30], fov: 50 }}
				gl={{ antialias: true, alpha: true }}
			>
				<ambientLight intensity={0.5} />
				<directionalLight position={[10, 10, 5]} intensity={1} />
				<directionalLight position={[-10, -10, -5]} intensity={0.5} />
				<InteractiveCamera />
				{ displayMode === "ball-stick" && <BS_MoleculeModel pdbData={pdbData} onAtomClick={onAtomClick} /> }
				{ displayMode === "space-filling" && <SF_MoleculeModel pdbData={pdbData} onAtomClick={onAtomClick} /> }
				{ displayMode === "ribbon" && <Ribbon_MoleculeModel pdbData={pdbData} onAtomClick={onAtomClick} /> }
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
