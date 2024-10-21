import './style.scss'

import * as THREE from 'https://cdn.skypack.dev/three@0.129.0/build/three.module.js'
import { GLTFLoader } from 'https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/GLTFLoader.js'
import { gsap } from 'https://cdn.skypack.dev/gsap'
import model from './assets/demon_bee_full_texture.glb'

// Cam View Field
const camera = new THREE.PerspectiveCamera(
	10,
	window.innerWidth / window.innerHeight,
	0.1,
	1000,
)

camera.position.z = 13

// Scene Set
const scene = new THREE.Scene()
let bee: any
let mixer: any // animation manager
const loader = new GLTFLoader()
loader.load(
	model,
	function (gltf: any) {
		// Complete
		bee = gltf.scene
		// instead use moveMethod
		// bee.position.y = -1
		// bee.rotation.y = 1.5
		scene.add(bee)

		mixer = new THREE.AnimationMixer(bee)
		// Select same animation name inside
		mixer.clipAction(gltf.animations[0]).play()

		// better - call move here
		modelMove()

		console.log(gltf.animations)
	},
	function (xhr: any) {
		// Check loading
	},
	function (error: any) {
		// Check errors
	},
)
const renderer = new THREE.WebGLRenderer({ alpha: true })
// renderer.setSize(window.innerWidth, window.innerHeight) // better use windows resize event - resp
document.querySelector('#container3D')?.appendChild(renderer.domElement)

// lights
const ambientLight = new THREE.AmbientLight(0xffffff, 1.3)
scene.add(ambientLight)

const topLight = new THREE.DirectionalLight(0xffffff, 1)
topLight.position.set(500, 500, 500)
scene.add(topLight)

// merge
const reRender3D = () => {
	requestAnimationFrame(reRender3D)
	renderer.render(scene, camera)
	if (mixer) mixer.update(0.02)
}
reRender3D()

// Positioning ary
let arrPositionModel: {
	id: string
	position: { x: number; y: number; z: number }
	rotation: { x: number; y: number; z: number }
}[] = [
	{
		id: 'banner',
		position: { x: 0, y: -1, z: 0 },
		rotation: { x: 0, y: 1.5, z: 0 },
	},
	{
		id: 'intro',
		position: { x: 1, y: -1, z: -5 },
		rotation: { x: 0.5, y: -0.5, z: 0 },
	},
	{
		id: 'description',
		position: { x: -1, y: -1, z: -5 },
		rotation: { x: 0, y: 0.5, z: 0 },
	},
	{
		id: 'contact',
		position: { x: 0.8, y: -1, z: 0 },
		rotation: { x: 0.3, y: -0.5, z: 0 },
	},
]

// Move model function
const modelMove = () => {
	const sections = document.querySelectorAll('.section')
	let currentSection: any

	sections.forEach((section) => {
		const rect = section.getBoundingClientRect()

		if (rect.top <= window.innerHeight / 3) {
			currentSection = section.id
		}
	})

	let position_active = arrPositionModel.findIndex(
		(val) => val.id == currentSection,
	)

	if (position_active >= 0) {
		let new_coordinates = arrPositionModel[position_active]
		// bee.position.x = new_coordinates.position.x
		// bee.position.y = new_coordinates.position.y
		// bee.position.z = new_coordinates.position.z
		// Gsap for smooth
		gsap.to(bee.position, {
			x: new_coordinates.position.x,
			y: new_coordinates.position.y,
			z: new_coordinates.position.z,
			duration: 1,
			ease: 'power1.out',
		})

		gsap.to(bee.rotation, {
			x: new_coordinates.rotation.x,
			y: new_coordinates.rotation.y,
			z: new_coordinates.rotation.z,
			duration: 3,
			ease: 'power1.out',
		})
	}
}

// Scroll event
window.addEventListener('scroll', () => {
	if (bee) {
		modelMove()
	}
})

// Responsive
window.addEventListener('resize', () => {
	renderer.setSize(window.innerWidth, window.innerHeight)
	// asratio fix
	camera.aspect = window.innerWidth / window.innerHeight
	camera.updateProjectionMatrix()
})
