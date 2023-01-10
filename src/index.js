const canvas = document.querySelector('canvas.webgl')

const scene = new THREE.Scene()
const camera = new THREE.Camera()

scene.add(camera)

const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true
})
document.body.appendChild(renderer.domElement)
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))


const ArToolkitSource = new THREEx.ArToolkitSource({
    sourceType: 'webcam'
})

ArToolkitSource.init(() => {
    setTimeout(() => {
        ArToolkitSource.onResizeElement()
        ArToolkitSource.copyElementSizeTo(renderer.domElement)
        console.log('test');
    }, 2000);
})

const ArToolkitContext = new THREEx.ArToolkitContext({
    cameraParametersUrl: 'camera_para.dat',
    detection_mode: 'color_and_matrix'
})

ArToolkitContext.init(() => {
    camera.projectionMatrix.copy(ArToolkitContext.getProjectionMatrix())
})

const ArMarkerControls = new THREEx.ArMarkerControls(ArToolkitContext, camera, {
    type: 'pattern',
    patternUrl: 'marker.patt',
    changeMatrixMode: 'cameraTransformMatrix'
})

scene.visble = false

const geometry = new THREE.SphereGeometry(1, 10)
const material = new THREE.MeshBasicMaterial({
    color: new THREE.Color('#FF00FF'),
    transparent: true,
    opacity: 0.5,
    side: THREE.DoubleSide
})

const sphere = new THREE.Mesh(geometry, material)
// scene.add(sphere)

const cubeGeometry = new THREE.BoxGeometry(1, 1, 1)
const cubeMaterial = new THREE.MeshNormalMaterial({
    transparent: true,
    opacity: 0.5,
    side: THREE.DoubleSide
})

const cube = new THREE.Mesh(cubeGeometry, cubeMaterial)
cube.position.y = 1
console.log(cubeGeometry.parameters.height / 2);
window.cube = cube
console.log(cubeGeometry);
scene.add(cube)



const animate = () => {
    requestAnimationFrame(animate)

    // cube.rotation.x += 0.01

    ArToolkitContext.update(ArToolkitSource.domElement)
    scene.visible = camera.visible
    renderer.render(scene, camera)
}

animate()