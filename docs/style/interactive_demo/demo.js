document.addEventListener('DOMContentLoaded', function () {
  const container = document.getElementById('blendshape-viewer');

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(container.clientWidth, container.clientHeight);
  container.appendChild(renderer.domElement);

  const light = new THREE.DirectionalLight(0xffffff, 1);
  light.position.set(1, 1, 1).normalize();
  scene.add(light);

  const loader = new THREE.ObjectLoader();
  loader.load(
    'https://raw.githubusercontent.com/PeizhiYan/PeizhiYan.github.io/master/docs/style/interactive_demo/avatars/style-1/0.obj',
    (object) => {
      object.scale.set(1, 1, 1);
      scene.add(object);
    },
    undefined,
    (error) => {
      console.error('Error loading .obj:', error);
    }
  );

  camera.position.z = 5;
  function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
  }
  animate();

  window.addEventListener('resize', () => {
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
  });
});
