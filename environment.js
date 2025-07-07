// === ENVIRONMENT SYSTEMS ===
// Doors, walls, lighting, world geometry
// Uses shared resources from config.js

// === DOOR CLASS ===
class Door {
  constructor(position, id) {
    this.id = id; 
    this.position = position.clone(); 
    this.isOpen = false; 
    this.isAnimating = false; 
    this.mesh = null; 
    this.createMesh();
  }
  
  createMesh() {
    const doorTexture = new THREE.TextureLoader().load("pngs/splitdoor.png");
    const doorMaterial = new THREE.MeshStandardMaterial({ 
      map: doorTexture, 
      transparent: false, 
      side: THREE.DoubleSide 
    });
    const doorGeometry = new THREE.PlaneGeometry(3, 4);
    this.mesh = new THREE.Mesh(doorGeometry, doorMaterial);
    this.mesh.position.set(this.position.x, 2, this.position.z);
    // FIXED: No rotation needed - doors should be flush with north-south walls
    this.mesh.rotation.y = 0; 
    scene.add(this.mesh);
  }
  
  open() {
    if (this.isOpen || this.isAnimating) return; 
    this.isAnimating = true; 
    play('s015'); // FIXED: Play sound immediately when space is pressed
    console.log(`Opening door ${this.id} - starting animation`);
    
    // FIXED: Delay animation start by a couple frames (60ms)
    setTimeout(() => {
      const startY = 2, endY = 6, animationSteps = 10; 
      let step = 0;
      const animate = () => {
        step++; 
        const progress = step / animationSteps; 
        this.mesh.position.y = startY + (endY - startY) * progress;
        console.log(`Door ${this.id} animation step ${step}: y=${this.mesh.position.y}`);
        if (step < animationSteps) { 
          setTimeout(animate, 30); 
        } else { 
          this.isOpen = true; 
          this.isAnimating = false; 
          console.log(`Door ${this.id} opened, will close in ${CONFIG.DOOR_OPEN_TIME}ms`);
          setTimeout(() => this.close(), CONFIG.DOOR_OPEN_TIME); 
        }
      };
      animate();
    }, 60);
  }
  
  close() {
    if (!this.isOpen || this.isAnimating) return; 
    this.isAnimating = true; 
    play('s016'); // Use asset system for door close sound
    console.log(`Closing door ${this.id}`);
    
    const startY = 6, endY = 2, animationSteps = 10; 
    let step = 0;
    const animate = () => {
      step++; 
      const progress = step / animationSteps; 
      this.mesh.position.y = startY + (endY - startY) * progress;
      console.log(`Door ${this.id} close step ${step}: y=${this.mesh.position.y}`);
      if (step < animationSteps) { 
        setTimeout(animate, 30); 
      } else { 
        this.isOpen = false; 
        this.isAnimating = false; 
        console.log(`Door ${this.id} closed`);
      }
    };
    animate();
  }
  
  checkCollision(newPosition) {
    if (this.isOpen) return true; // Allow passage when open
    
    // FIXED: More precise collision bounds for 3-unit wide door
    const doorBounds = { 
      minX: this.position.x - 1.5, 
      maxX: this.position.x + 1.5, 
      minZ: this.position.z - 0.5, 
      maxZ: this.position.z + 0.5 
    };
    
    // Return false if player is trying to pass through closed door
    return !(newPosition.x >= doorBounds.minX && newPosition.x <= doorBounds.maxX && 
             newPosition.z >= doorBounds.minZ && newPosition.z <= doorBounds.maxZ);
  }
}

// === WORLD CREATION ===
function createEnvironment() {
  // Floor
  const floorTexture = new THREE.TextureLoader().load("pngs/floor1_512.png");
  floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping;
  floorTexture.repeat.set(20, 20);
  const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(100, 100), 
    new THREE.MeshStandardMaterial({ map: floorTexture })
  );
  floor.rotation.x = -Math.PI / 2; 
  floor.position.set(0, 0, 25); 
  floor.receiveShadow = true; 
  scene.add(floor);
  
  // Wall materials
  const wallTexture = new THREE.TextureLoader().load("pngs/wall1_512.png");
  const wallMaterial = new THREE.MeshStandardMaterial({ map: wallTexture }); 
  const wallHeight = 4;
  
  // FIXED: Create 6 simple square rooms (10x10 each) with proper door gaps
  for (let room = 0; room < 6; room++) {
    const roomStartZ = room * 10;
    const roomEndZ = (room + 1) * 10;
    
    // West wall (left side) - runs full length of room
    const westWall = new THREE.Mesh(
      new THREE.BoxGeometry(1, wallHeight, 10), 
      wallMaterial
    );
    westWall.position.set(-5, 2, roomStartZ + 5);
    westWall.castShadow = true;
    scene.add(westWall);
    
    // East wall (right side) - runs full length of room
    const eastWall = new THREE.Mesh(
      new THREE.BoxGeometry(1, wallHeight, 10), 
      wallMaterial
    );
    eastWall.position.set(5, 2, roomStartZ + 5);
    eastWall.castShadow = true;
    scene.add(eastWall);
    
    // South wall - only for first room (player entrance)
    if (room === 0) {
      const southWall = new THREE.Mesh(
        new THREE.BoxGeometry(10, wallHeight, 1), 
        wallMaterial
      );
      southWall.position.set(0, 2, roomStartZ);
      southWall.castShadow = true;
      scene.add(southWall);
    }
    
    // North wall - with door gap for rooms 0-4, solid for room 5
    if (room < 5) {
      // Left piece of north wall (door gap in center)
      const northWallLeft = new THREE.Mesh(
        new THREE.BoxGeometry(3.5, wallHeight, 1), 
        wallMaterial
      );
      northWallLeft.position.set(-3.25, 2, roomEndZ);
      northWallLeft.castShadow = true;
      scene.add(northWallLeft);
      
      // Right piece of north wall  
      const northWallRight = new THREE.Mesh(
        new THREE.BoxGeometry(3.5, wallHeight, 1), 
        wallMaterial
      );
      northWallRight.position.set(3.25, 2, roomEndZ);
      northWallRight.castShadow = true;
      scene.add(northWallRight);
      
    } else {
      // Solid north wall for final room
      const northWall = new THREE.Mesh(
        new THREE.BoxGeometry(10, wallHeight, 1), 
        wallMaterial
      );
      northWall.position.set(0, 2, roomEndZ);
      northWall.castShadow = true;
      scene.add(northWall);
    }
  }
}

// === LIGHTING SETUP ===
function setupLighting() {
  const ambientLight = new THREE.AmbientLight(0x404040, 0.6); 
  scene.add(ambientLight);
  
  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
  directionalLight.position.set(10, 10, 5); 
  directionalLight.castShadow = true; 
  scene.add(directionalLight);
}

// === DOOR CREATION ===
function createDoors() {
  // FIXED: Create doors at the gaps between rooms
  const doorArray = [];
  
  for (let i = 0; i < 5; i++) {
    const doorZ = (i + 1) * 10; // Door at boundary between rooms
    const door = new Door(new THREE.Vector3(0, 0, doorZ), `door_${i}_${i+1}`);
    doorArray.push(door);
    console.log(`Created door ${door.id} at position (0, 0, ${doorZ})`);
  }
  
  // Make doors global - FIXED: Use global variable instead of window
  if (typeof doors === 'undefined') {
    window.doors = doorArray;
  } else {
    doors.length = 0;
    doors.push(...doorArray);
  }
  console.log(`Total doors created: ${doorArray.length}`);
}