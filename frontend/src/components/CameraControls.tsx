import React, { useRef } from "react";
import { useThree, useFrame } from "@react-three/fiber/native";
import {
	PanGestureHandler,
	PinchGestureHandler,
} from "react-native-gesture-handler";
import * as THREE from "three";

export default function CameraControls() {
	const { camera, gl } = useThree();
	const rotationRef = useRef({ x: 0, y: 0 });
	const distanceRef = useRef(30);
	const targetRef = useRef(new THREE.Vector3(0, 0, 0));

	useFrame(() => {
		// Update camera position based on rotation and distance
		const theta = rotationRef.current.y;
		const phi = rotationRef.current.x;

		camera.position.x =
			distanceRef.current * Math.sin(theta) * Math.cos(phi);
		camera.position.y = distanceRef.current * Math.sin(phi);
		camera.position.z =
			distanceRef.current * Math.cos(theta) * Math.cos(phi);

		camera.lookAt(targetRef.current);
	});

	return null;
}
