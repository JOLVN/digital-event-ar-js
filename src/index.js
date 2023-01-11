const gltfLoader = new THREE.GLTFLoader()
const pane = new Tweakpane.Pane()

const scene = new THREE.Scene()
const camera = new THREE.Camera()
const marker1 = new THREE.Group()
const marker2 = new THREE.Group()

scene.add(camera)
scene.add(marker1)
scene.add(marker2)

/**
 * RENDERER
 */

const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true,
});
document.body.appendChild(renderer.domElement);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * ARTOOLKITSOURCE
 */

const arToolkitSource = new THREEx.ArToolkitSource({
    sourceType: "webcam",
});

const onResize = () => {
    arToolkitSource.onResizeElement()
    arToolkitSource.copySizeTo(renderer.domElement)
    if (arToolkitContext.arController !== null) {
        arToolkitSource.copySizeTo(arToolkitContext.arController.canvas)
    }
}

arToolkitSource.init(() => {
    setTimeout(() => {
        onResize()
    }, 1000);
})

window.addEventListener("resize", function () {
    onResize();
});

/**
 * ARTOOLKITCONTEXT
 */

const arToolkitContext = new THREEx.ArToolkitContext({
    cameraParametersUrl: "camera_para.dat",
    detection_mode: "color_and_matrix",
});

arToolkitContext.init(() => {
    camera.projectionMatrix.copy(arToolkitContext.getProjectionMatrix())
});

/**
 * MARKERS
 */

// Marker 1

const arMarkerControls1 = new THREEx.ArMarkerControls(
    arToolkitContext,
    marker1,
    {
        type: "pattern",
        patternUrl: "markers/marker.patt",
    }
);

const cubeGeometry = new THREE.BoxGeometry(1, 1, 1)
const cubeMaterial = new THREE.MeshNormalMaterial({
    transparent: true,
    opacity: 0.5,
    side: THREE.DoubleSide,
});
const cube = new THREE.Mesh(cubeGeometry, cubeMaterial)
marker1.add(cube)

// Marker 2

const arMarkerControls2 = new THREEx.ArMarkerControls(
    arToolkitContext,
    marker2,
    {
        type: "pattern",
        patternUrl: "markers/marker2.patt",
    }
);

gltfLoader.load("/models/spaceship.glb", (gltf) => {
    gltf.scene.scale.x = 0.2
    gltf.scene.scale.y = 0.2
    gltf.scene.scale.z = 0.2
    marker2.add(gltf.scene)
});

const animate = () => {
    requestAnimationFrame(animate)

    cube.rotation.x += 0.001

    if (arToolkitSource.ready !== false) arToolkitContext.update(arToolkitSource.domElement)

    renderer.render(scene, camera);

    animate()
}
