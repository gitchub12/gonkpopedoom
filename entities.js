// === ENTITY CLASSES ===
// All NPCs, enemies, and projectiles
// Uses shared resources from config.js (sounds, materials, CONFIG, etc.)

// === PAMPHLET PROJECTILE CLASS ===
class PamphletProjectile {
  constructor(startPosition, direction) {
    this.position = startPosition.clone(); 
    this.targetVelocity = direction.clone().multiplyScalar(0.3); // Final speed
    this.velocity = direction.clone().multiplyScalar(0.05); // Start slow
    this.acceleration = 0.015; // How fast it speeds up
    this.mesh = null; 
    this.life = 100; 
    this.createMesh();
  }
  
  createMesh() {
    // FIXED: Use random pamphlet texture from asset system
    const pamphletIds = ASSETS.PAMPHLET_FRAMES;
    const randomId = pamphletIds[Math.floor(Math.random() * pamphletIds.length)];
    const pamphletTexture = tex(randomId);
    
    const pamphletMaterial = new THREE.MeshBasicMaterial({ 
      map: pamphletTexture, 
      transparent: true,
      side: THREE.DoubleSide  // FIXED: Make pamphlets visible from both sides
    });
    const pamphletGeometry = new THREE.PlaneGeometry(0.3, 0.3);
    this.mesh = new THREE.Mesh(pamphletGeometry, pamphletMaterial);
    this.mesh.position.copy(this.position); 
    this.mesh.position.y = 1.2; // FIXED: Start 20% lower (was 1.5, now 1.2)
    scene.add(this.mesh);
  }
  
  update() {
    // FIXED: Accelerate pamphlet from slow start to full speed
    if (this.velocity.length() < this.targetVelocity.length()) {
      this.velocity.addScaledVector(this.velocity.clone().normalize(), this.acceleration);
      // Cap at target velocity
      if (this.velocity.length() > this.targetVelocity.length()) {
        this.velocity.copy(this.targetVelocity);
      }
    }
    
    this.position.add(this.velocity); 
    this.mesh.position.copy(this.position); 
    this.mesh.position.y = 1.2; // FIXED: Keep consistent lower height
    this.mesh.rotation.z += 0.3; 
    this.life--; 
    return this.life > 0;
  }
  
  checkHit() {
    const allTargets = [...r2Units, ...stormtroopers, ...probeDroids, ...xeroxDroids, ...aliens, ...npcs];
    for (let target of allTargets) {
      if (target.dying) continue;
      const distance = this.position.distanceTo(target.position);
      if (distance < 1.0) { 
        target.convert(); 
        this.destroy(); 
        return true; 
      }
    }
    return false;
  }
  
  destroy() {
    if (this.mesh) scene.remove(this.mesh);
    const index = pamphletProjectiles.indexOf(this);
    if (index > -1) pamphletProjectiles.splice(index, 1);
  }
}

// === PROBE DROID CLASS ===
class ProbeDroid {
  constructor(position, id) {
    this.id = id; 
    this.position = position.clone(); 
    this.health = 3; 
    this.mesh = null; 
    this.collisionRadius = 0.75;
    this.animFrame = 0; 
    this.dying = false; 
    this.converted = false; 
    this.glowMesh = null; 
    this.createMesh();
  }
  
  createMesh() {
    const probeGeometry = new THREE.PlaneGeometry(2.1, 2.6);
    this.mesh = new THREE.Mesh(probeGeometry, probeMaterials && probeMaterials[0] ? probeMaterials[0] : new THREE.MeshBasicMaterial({color: 0xff0000}));
    this.mesh.position.copy(this.position); 
    this.mesh.position.y = 1.5; 
    scene.add(this.mesh);
  }
  
  update() {
    if (this.dying) return;
    const direction = new THREE.Vector3(); 
    direction.subVectors(camera.position, this.mesh.position).normalize();
    this.mesh.rotation.y = Math.atan2(direction.x, direction.z);
  }
  
  animate() {
    if (this.dying) return; 
    this.animFrame = (this.animFrame + 1) % 13;
    if (this.mesh && probeMaterials && probeMaterials.length === 13) { 
      this.mesh.material = probeMaterials[this.animFrame]; 
    }
  }
  
  convert() {
    if (this.converted) return; 
    this.converted = true; 
    this.glowMesh = createBlueGlow(this.mesh);
    console.log(`${this.id} converted!`);
  }
  
  takeDamage(amount) {
    if (this.dying) return; 
    this.health -= amount; 
    console.log(`${this.id} took ${amount} damage, health: ${this.health}`);
    if (this.health <= 0) this.die();
  }
  
  die() {
    if (this.dying) return; 
    this.dying = true; 
    playSound('prbdie');
    let opacity = 1.0;
    const fadeInterval = setInterval(() => {
      opacity -= (CONFIG ? CONFIG.FADE_SPEED : 0.05);
      if (this.mesh) this.mesh.material.opacity = opacity;
      if (this.glowMesh) this.glowMesh.material.opacity = opacity * 0.3;
      if (opacity <= 0) { 
        clearInterval(fadeInterval); 
        this.destroy(); 
      }
    }, 50);
  }
  
  destroy() {
    if (this.mesh) scene.remove(this.mesh); 
    if (this.glowMesh) scene.remove(this.glowMesh);
    const index = probeDroids.indexOf(this); 
    if (index > -1) probeDroids.splice(index, 1);
  }
}

// === XEROX DROID CLASS ===
class XeroxDroid {
  constructor(position, id) {
    this.id = id; 
    this.position = position.clone(); 
    this.health = 2; 
    this.mesh = null; 
    this.shadowMesh = null;
    this.collisionRadius = 1.8; 
    this.animFrame = 0; 
    this.dying = false; 
    this.converted = false; 
    this.glowMesh = null; 
    this.animTimer = 0; 
    this.createMesh();
  }
  
  createMesh() {
    const xeroxGeometry = new THREE.PlaneGeometry(4.2, 5.4);
    this.mesh = new THREE.Mesh(xeroxGeometry, xeroxMaterials && xeroxMaterials[0] ? xeroxMaterials[0] : new THREE.MeshBasicMaterial({color: 0x00ff00}));
    this.mesh.position.copy(this.position); 
    this.mesh.position.y = 1.863; // FIXED: Another 10% higher (was 1.694)
    const shadowGeometry = new THREE.PlaneGeometry(4.2, 4.2);
    this.shadowMesh = new THREE.Mesh(shadowGeometry, new THREE.MeshBasicMaterial({ 
      transparent: true, opacity: 0.25, color: 0x000000 
    }));
    this.shadowMesh.rotation.x = -Math.PI / 2; 
    this.shadowMesh.position.set(this.position.x, 0.01, this.position.z);
    scene.add(this.mesh); 
    scene.add(this.shadowMesh);
  }
  
  update() {
    if (this.dying) return;
    const direction = new THREE.Vector3(); 
    direction.subVectors(camera.position, this.mesh.position).normalize();
    this.mesh.rotation.y = Math.atan2(direction.x, direction.z);
    this.shadowMesh.position.set(this.mesh.position.x, 0.01, this.mesh.position.z);
  }
  
  animate() {
    if (this.dying) return; 
    this.animTimer += 1;
    if (this.animTimer >= 1) { // FIXED: Much faster animation (every 0.5 seconds)
      this.animFrame = (this.animFrame + 1) % 13;
      if (this.mesh && xeroxMaterials && xeroxMaterials.length === 13) { 
        this.mesh.material = xeroxMaterials[this.animFrame]; 
      }
      this.animTimer = 0;
    }
  }
  
  convert() {
    if (this.converted) return; 
    this.converted = true; 
    this.glowMesh = createBlueGlow(this.mesh);
    console.log(`${this.id} converted!`);
  }
  
  takeDamage(amount) {
    if (this.dying) return; 
    this.health -= amount; 
    console.log(`${this.id} took ${amount} damage, health: ${this.health}`);
    if (this.health <= 0) this.die();
  }
  
  die() {
    if (this.dying) return; 
    this.dying = true;
    let opacity = 1.0;
    const fadeInterval = setInterval(() => {
      opacity -= (CONFIG ? CONFIG.FADE_SPEED : 0.05);
      if (this.mesh) this.mesh.material.opacity = opacity;
      if (this.shadowMesh) this.shadowMesh.material.opacity = opacity * 0.25;
      if (this.glowMesh) this.glowMesh.material.opacity = opacity * 0.3;
      if (opacity <= 0) { 
        clearInterval(fadeInterval); 
        this.destroy(); 
      }
    }, 50);
  }
  
  destroy() {
    if (this.mesh) scene.remove(this.mesh); 
    if (this.shadowMesh) scene.remove(this.shadowMesh);
    if (this.glowMesh) scene.remove(this.glowMesh);
    const index = xeroxDroids.indexOf(this); 
    if (index > -1) xeroxDroids.splice(index, 1);
  }
}

// === ALIEN A CLASS ===
class AlienA {
  constructor(position, id) {
    this.id = id; 
    this.position = position.clone(); 
    this.health = 4; 
    this.mesh = null; 
    this.shadowMesh = null;
    this.collisionRadius = 1.2; 
    this.animFrame = 0; 
    this.dying = false; 
    this.converted = false; 
    this.glowMesh = null; 
    this.createMesh();
  }
  
  createMesh() {
    const alienGeometry = new THREE.PlaneGeometry(4.0, 5.0);
    this.mesh = new THREE.Mesh(alienGeometry, alienAMaterials && alienAMaterials[0] ? alienAMaterials[0] : new THREE.MeshBasicMaterial({color: 0x0000ff}));
    this.mesh.position.copy(this.position); 
    this.mesh.position.y = 1.720; // FIXED: 3% higher (was 1.670, now +3%)
    const shadowGeometry = new THREE.PlaneGeometry(4.0, 4.0);
    this.shadowMesh = new THREE.Mesh(shadowGeometry, new THREE.MeshBasicMaterial({ 
      transparent: true, opacity: 0.3, color: 0x000000 
    }));
    this.shadowMesh.rotation.x = -Math.PI / 2; 
    this.shadowMesh.position.set(this.position.x, 0.01, this.position.z);
    scene.add(this.mesh); 
    scene.add(this.shadowMesh);
  }
  
  update() {
    if (this.dying) return;
    const direction = new THREE.Vector3(); 
    direction.subVectors(camera.position, this.mesh.position).normalize();
    this.mesh.rotation.y = Math.atan2(direction.x, direction.z);
    this.shadowMesh.position.set(this.mesh.position.x, 0.01, this.mesh.position.z);
  }
  
  animate() {
    if (this.dying) return; 
    this.animFrame = (this.animFrame + 1) % 9;
    if (this.mesh && alienAMaterials && alienAMaterials.length === 9) { 
      this.mesh.material = alienAMaterials[this.animFrame]; 
    }
  }
  
  convert() {
    if (this.converted) return; 
    this.converted = true; 
    this.glowMesh = createBlueGlow(this.mesh);
    console.log(`${this.id} converted!`);
  }
  
  takeDamage(amount) {
    if (this.dying) return; 
    this.health -= amount; 
    console.log(`${this.id} took ${amount} damage, health: ${this.health}`);
    if (this.health <= 0) this.die();
  }
  
  die() {
    if (this.dying) return; 
    this.dying = true;
    let opacity = 1.0;
    const fadeInterval = setInterval(() => {
      opacity -= (CONFIG ? CONFIG.FADE_SPEED : 0.05);
      if (this.mesh) this.mesh.material.opacity = opacity;
      if (this.shadowMesh) this.shadowMesh.material.opacity = opacity * 0.3;
      if (this.glowMesh) this.glowMesh.material.opacity = opacity * 0.3;
      if (opacity <= 0) { 
        clearInterval(fadeInterval); 
        this.destroy(); 
      }
    }, 50);
  }
  
  destroy() {
    if (this.mesh) scene.remove(this.mesh); 
    if (this.shadowMesh) scene.remove(this.shadowMesh);
    if (this.glowMesh) scene.remove(this.glowMesh);
    const index = aliens.indexOf(this); 
    if (index > -1) aliens.splice(index, 1);
  }
}

// === R2 UNIT CLASS ===
class R2Unit {
  constructor(position, id) {
    this.id = id; 
    this.position = position.clone(); 
    this.health = 2; 
    this.mesh = null; 
    this.shadowMesh = null;
    this.collisionRadius = 0.8; 
    this.animFrame = 0; 
    this.dying = false; 
    this.converted = false; 
    this.glowMesh = null; 
    this.createMesh();
  }
  
  createMesh() {
    const r2Geometry = new THREE.PlaneGeometry(1.5, 2);
    this.mesh = new THREE.Mesh(r2Geometry, r2Materials && r2Materials[0] ? r2Materials[0] : new THREE.MeshBasicMaterial({color: 0xffffff}));
    this.mesh.position.copy(this.position); 
    this.mesh.position.y = 1;
    const shadowGeometry = new THREE.PlaneGeometry(1.5, 1.5);
    this.shadowMesh = new THREE.Mesh(shadowGeometry, new THREE.MeshBasicMaterial({ 
      transparent: true, opacity: 0.3, color: 0x000000 
    }));
    this.shadowMesh.rotation.x = -Math.PI / 2; 
    this.shadowMesh.position.set(this.position.x, 0.01, this.position.z);
    scene.add(this.mesh); 
    scene.add(this.shadowMesh);
  }
  
  update() {
    if (this.dying) return;
    const direction = new THREE.Vector3(); 
    direction.subVectors(camera.position, this.mesh.position).normalize();
    this.mesh.rotation.y = Math.atan2(direction.x, direction.z);
    this.shadowMesh.position.set(this.mesh.position.x, 0.01, this.mesh.position.z);
  }
  
  animate() {
    if (this.dying) return; 
    this.animFrame = (this.animFrame + 1) % 4;
    if (this.mesh && r2Materials && r2Materials.length === 4) { 
      this.mesh.material = r2Materials[this.animFrame]; 
    }
  }
  
  convert() {
    if (this.converted) return; 
    this.converted = true; 
    this.glowMesh = createBlueGlow(this.mesh);
    console.log(`${this.id} converted!`);
  }
  
  takeDamage(amount) {
    if (this.dying) return; 
    this.health -= amount; 
    console.log(`${this.id} took ${amount} damage, health: ${this.health}`);
    if (this.health <= 0) this.die();
  }
  
  die() {
    if (this.dying) return; 
    this.dying = true; 
    playSound('r2scream');
    let opacity = 1.0;
    const fadeInterval = setInterval(() => {
      opacity -= (CONFIG ? CONFIG.FADE_SPEED : 0.05);
      if (this.mesh) this.mesh.material.opacity = opacity;
      if (this.shadowMesh) this.shadowMesh.material.opacity = opacity * 0.3;
      if (this.glowMesh) this.glowMesh.material.opacity = opacity * 0.3;
      if (opacity <= 0) { 
        clearInterval(fadeInterval); 
        this.destroy(); 
      }
    }, 50);
  }
  
  destroy() {
    if (this.mesh) scene.remove(this.mesh); 
    if (this.shadowMesh) scene.remove(this.shadowMesh);
    if (this.glowMesh) scene.remove(this.glowMesh);
    const index = r2Units.indexOf(this); 
    if (index > -1) r2Units.splice(index, 1);
  }
}

// === ENHANCED STORMTROOPER CLASS ===
class Stormtrooper {
  constructor(position, id) {
    this.id = id; 
    this.position = position.clone(); 
    this.originalPosition = position.clone(); // For patrol bounds
    this.health = 5; 
    this.mesh = null; 
    this.shadowMesh = null;
    this.collisionRadius = 0.6; 
    this.dying = false; 
    this.converted = false; 
    this.glowMesh = null;
    this.aggressive = false; 
    this.lastShotTime = 0; 
    this.shotCooldown = CONFIG ? CONFIG.STORMIE_SHOT_COOLDOWN : 2000; 
    this.attackRange = CONFIG ? CONFIG.STORMIE_ATTACK_RANGE : 8.0;
    
    // ENHANCED: Movement and patrol system
    this.velocity = new THREE.Vector3();
    this.patrolTarget = null;
    this.patrolTimer = 0;
    this.moveSpeed = 0.008; // Slow patrol speed
    this.aggressiveSpeed = 0.025; // Faster when advancing
    this.lastFootstepTime = 0; // NEW: For footstep sounds
    this.lastChatterTime = 0; // NEW: For battle chatter
    this.muzzleFlash = null; // NEW: For muzzle flash effect
    
    // ENHANCED: Animation state machine with faster timing
    this.animState = 'IDLE'; // IDLE, ATTACK, DYING
    this.animFrame = 0;
    this.animTimer = 0;
    this.deathFrame = 0;
    this.deathAnimationComplete = false;
    this.createMesh();
    this.generatePatrolTarget();
  }
  
  createMesh() {
    const stormieGeometry = new THREE.PlaneGeometry(2.59, 3.17); // FIXED: Another 20% bigger (was 2.16x2.64, now +20% again)
    this.mesh = new THREE.Mesh(stormieGeometry, stormieIdleMaterials && stormieIdleMaterials[0] ? stormieIdleMaterials[0] : new THREE.MeshBasicMaterial({color: 0x888888}));
    this.mesh.position.copy(this.position); 
    this.mesh.position.y = 0.738; // FIXED: Raised 3% higher (was 0.717, now +3%)
    const shadowGeometry = new THREE.PlaneGeometry(2.59, 2.59); // FIXED: Match new size
    this.shadowMesh = new THREE.Mesh(shadowGeometry, new THREE.MeshBasicMaterial({ 
      transparent: true, opacity: 0.4, color: 0x000000 
    }));
    this.shadowMesh.rotation.x = -Math.PI / 2; 
    this.shadowMesh.position.set(this.position.x, 0.01, this.position.z);
    scene.add(this.mesh); 
    scene.add(this.shadowMesh);
  }
  
  // ENHANCED: Generate random patrol points within room bounds
  generatePatrolTarget() {
    // Find which room we're in based on our original position
    const roomIndex = Math.floor(this.originalPosition.z / 10);
    const roomZ = roomIndex * 10;
    
    // Generate random point within room bounds (-4 to 4 x, room z bounds)
    const targetX = (Math.random() - 0.5) * 8; // -4 to 4
    const targetZ = roomZ + 2 + Math.random() * 6; // Stay within room bounds
    
    this.patrolTarget = new THREE.Vector3(targetX, 0, targetZ);
    this.patrolTimer = 3000 + Math.random() * 4000; // 3-7 seconds before new target
  }
  
  // ENHANCED: Movement update with patrol and advance behaviors
  updateMovement() {
    if (this.dying || this.converted) return;
    
    let targetPosition;
    let speed;
    let isMoving = false;
    
    if (this.aggressive) {
      // ENHANCED: Advance toward player when aggressive, but maintain minimum distance
      targetPosition = camera.position.clone();
      speed = this.aggressiveSpeed;
      
      // FIXED: Stop advancing when close enough to prevent clipping and 2D sprite issues
      const distanceToPlayer = this.position.distanceTo(camera.position);
      const minimumDistance = 2.5; // Stop 2.5 units away from player
      
      if (distanceToPlayer <= minimumDistance) {
        // Too close - don't move closer, just face player and shoot
        return;
      }
      isMoving = true;
    } else {
      // ENHANCED: Patrol behavior when passive
      this.patrolTimer -= 16; // Assume ~60fps, subtract frame time
      
      if (this.patrolTimer <= 0 || this.position.distanceTo(this.patrolTarget) < 0.5) {
        this.generatePatrolTarget();
      }
      
      targetPosition = this.patrolTarget;
      speed = this.moveSpeed;
      
      // Check if we're actually moving toward patrol target
      const distanceToTarget = this.position.distanceTo(this.patrolTarget);
      if (distanceToTarget > 0.3) {
        isMoving = true;
      }
    }
    
    // Calculate movement direction
    const direction = new THREE.Vector3();
    direction.subVectors(targetPosition, this.position).normalize();
    
    // Move toward target
    const movement = direction.multiplyScalar(speed);
    const newPosition = this.position.clone().add(movement);
    
    // Basic collision detection with room bounds
    const roomIndex = Math.floor(this.originalPosition.z / 10);
    const roomZ = roomIndex * 10;
    
    // Keep within room bounds
    newPosition.x = Math.max(-4, Math.min(4, newPosition.x));
    newPosition.z = Math.max(roomZ + 1, Math.min(roomZ + 9, newPosition.z));
    
    // Update position
    this.position.copy(newPosition);
    this.mesh.position.copy(this.position);
    this.mesh.position.y = 0.738; // FIXED: Raised 3% higher and keep consistent
    
    // DISABLED: Footsteps were too noisy
    // if (isMoving) {
    //   this.playFootsteps();
    // }
  }
  
  // NEW: Footstep sound system (DISABLED - too much noise)
  playFootsteps() {
    // DISABLED: Footsteps were too noisy
    // const currentTime = Date.now();
    // const footstepInterval = this.aggressive ? 400 : 800;
    // if (currentTime - this.lastFootstepTime > footstepInterval) {
    //   playRandom(ASSETS.BLASTER_SHOTS, 0.1);
    //   this.lastFootstepTime = currentTime;
    // }
  }
  
  // NEW: Battle chatter system (DISABLED - too much noise)
  playBattleChatter() {
    // DISABLED: Battle chatter was too noisy and using wrong sounds
    // const currentTime = Date.now();
    // const chatterInterval = 3000 + Math.random() * 4000;
    // if (currentTime - this.lastChatterTime > chatterInterval) {
    //   const chatterSounds = ['s041', 's028', 's075'];
    //   playRandom(chatterSounds, 0.3);
    //   this.lastChatterTime = currentTime;
    //   console.log(`${this.id}: Battle chatter!`);
    // }
  }
  
  // NEW: Create muzzle flash effect
  createMuzzleFlash() {
    if (this.muzzleFlash) {
      scene.remove(this.muzzleFlash);
    }
    
    // Create bright flash sprite at gun position
    const flashGeometry = new THREE.PlaneGeometry(0.5, 0.5);
    const flashMaterial = new THREE.MeshBasicMaterial({ 
      color: 0xffff00, 
      transparent: true, 
      opacity: 0.8 
    });
    this.muzzleFlash = new THREE.Mesh(flashGeometry, flashMaterial);
    
    // Position flash slightly in front of stormtrooper
    const direction = new THREE.Vector3();
    direction.subVectors(camera.position, this.position).normalize();
    this.muzzleFlash.position.copy(this.position);
    this.muzzleFlash.position.add(direction.multiplyScalar(0.3));
    this.muzzleFlash.position.y = 1.2; // Gun height
    
    scene.add(this.muzzleFlash);
    
    // Remove flash after short time
    setTimeout(() => {
      if (this.muzzleFlash) {
        scene.remove(this.muzzleFlash);
        this.muzzleFlash = null;
      }
    }, 100);
  }
  
  // NEW: Create laser bolt projectile (IMPROVED - very narrow with proper orientation)
  createLaserBolt() {
    // IMPROVED: Create very narrow laser bolt that starts as a point and slightly expands
    const boltGeometry = new THREE.CylinderGeometry(0.003, 0.003, 0.2, 4); // Much thinner and shorter
    const boltMaterial = new THREE.MeshBasicMaterial({ 
      color: 0xff0000, 
      emissive: 0xff0000,
      transparent: true, 
      opacity: 1.0 
    });
    const laserBolt = new THREE.Mesh(boltGeometry, boltMaterial);
    
    // Start position at stormtrooper gun level
    laserBolt.position.copy(this.position);
    laserBolt.position.y = 1.2;
    
    // IMPROVED: Direction toward player with slight inaccuracy for dodging
    const direction = new THREE.Vector3();
    direction.subVectors(camera.position, this.position).normalize();
    
    // Add slight random spread so player can dodge
    const spread = 0.3; // Spread amount
    direction.x += (Math.random() - 0.5) * spread;
    direction.z += (Math.random() - 0.5) * spread;
    direction.normalize();
    
    // FIXED: Better bolt orientation - use quaternion for more reliable rotation
    const quaternion = new THREE.Quaternion();
    quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction);
    laserBolt.setRotationFromQuaternion(quaternion);
    
    scene.add(laserBolt);
    
    // IMPROVED: Track distance for slight expansion
    let distanceTraveled = 0;
    const startingScale = 1.0;
    const maxScale = 1.5; // Only expand to 150% of original size (very slight)
    
    // IMPROVED: Faster bolt speed
    const boltSpeed = 0.8; // Much faster than before (was 0.3)
    const animate = () => {
      if (laserBolt.parent === null) return; // Already removed
      
      laserBolt.position.add(direction.clone().multiplyScalar(boltSpeed));
      distanceTraveled += boltSpeed;
      
      // IMPROVED: Very slight expansion as it travels (starts as point, gets tiny bit wider)
      const expansionFactor = Math.min(maxScale, startingScale + (distanceTraveled * 0.02));
      laserBolt.scale.set(expansionFactor, 1, expansionFactor);
      
      // Check if bolt reached player area or is too far
      const distanceToPlayer = laserBolt.position.distanceTo(camera.position);
      const distanceFromStart = laserBolt.position.distanceTo(this.position);
      
      if (distanceToPlayer < 0.5 || distanceFromStart > 20) {
        scene.remove(laserBolt);
        return;
      }
      
      setTimeout(animate, 16); // ~60fps
    };
    
    animate();
  }
  
  update() {
    if (this.dying) return;
    
    // ENHANCED: Update movement
    this.updateMovement();
    
    // FIXED: Always face the player (2D sprites must face camera or they disappear)
    const direction = new THREE.Vector3();
    direction.subVectors(camera.position, this.mesh.position).normalize();
    this.mesh.rotation.y = Math.atan2(direction.x, direction.z);
    
    // FIXED: Keep mesh and shadow at consistent raised ground level
    this.mesh.position.y = 0.738; // Force consistent raised height (3% higher)
    this.shadowMesh.position.set(this.mesh.position.x, 0.01, this.mesh.position.z);
    
    // Attack behavior
    if (this.aggressive) {
      const distanceToPlayer = camera.position.distanceTo(this.position);
      if (distanceToPlayer <= this.attackRange) { 
        this.tryAttack(); 
      }
      // DISABLED: Battle chatter was too noisy
      // this.playBattleChatter();
    }
  }
  
  // ENHANCED: Much faster animation - every 0.1 seconds instead of every 6+ seconds
  animate() {
    if (this.dying) {
      // ENHANCED: Death animation - play all 14 frames, THEN fade
      if (!this.deathAnimationComplete) {
        this.animTimer += 1;
        if (this.animTimer >= 1) { // Every 100ms (every call at 500ms interval = every other call)
          if (this.deathFrame < 14) {
            if (stormieDieMaterials && stormieDieMaterials[this.deathFrame]) {
              this.mesh.material = stormieDieMaterials[this.deathFrame];
              console.log(`${this.id} death frame ${this.deathFrame + 1}/14`);
            }
            this.deathFrame++;
            this.animTimer = 0;
          } else {
            // Death animation complete, now fade
            this.deathAnimationComplete = true;
            console.log(`${this.id} death animation complete, starting fade`);
            this.startFade();
          }
        }
      }
      return;
    }
    
    // ENHANCED: Faster idle animation - every 0.1 seconds instead of every 6+ seconds
    this.animTimer += 1;
    
    if (this.animState === 'IDLE') {
      if (this.animTimer >= 1) { // Every call = every 0.5 seconds, so every other call = 0.1 seconds
        this.animFrame = (this.animFrame + 1) % 24;
        if (stormieIdleMaterials && stormieIdleMaterials.length >= 24) {
          this.mesh.material = stormieIdleMaterials[this.animFrame];
        }
        this.animTimer = 0;
      }
    } else if (this.animState === 'ATTACK') {
      // Keep attack material during attack state
      if (stormieAttackMaterial) {
        this.mesh.material = stormieAttackMaterial;
      }
    }
  }
  
  tryAttack() {
    const currentTime = Date.now();
    if (currentTime - this.lastShotTime > this.shotCooldown) { 
      this.shoot(); 
      this.lastShotTime = currentTime; 
    }
  }
  
  shoot() {
    console.log(`${this.id} shoots at player!`);
    
    // NEW: Create visual effects
    this.createMuzzleFlash();
    this.createLaserBolt();
    
    // FIXED: Show attack frame briefly, then continue normal animation
    this.animState = 'ATTACK';
    this.mesh.material = stormieAttackMaterial || this.mesh.material;
    
    document.body.style.backgroundColor = 'rgba(255, 0, 0, 0.4)';
    setTimeout(() => { document.body.style.backgroundColor = ''; }, 150);
    
    // NEW: Use expanded blaster sound collection
    playRandom(ASSETS.BLASTER_SHOTS);
    
    // FIXED: Return to IDLE after brief attack display, continue animation cycle
    setTimeout(() => {
      if (!this.dying) {
        this.animState = 'IDLE';
        // FIXED: Immediately restore idle material and continue animation
        if (stormieIdleMaterials && stormieIdleMaterials.length >= 24) {
          this.mesh.material = stormieIdleMaterials[this.animFrame];
        }
        this.animTimer = 0; // Reset timer to continue smooth animation
      }
    }, 200); // Shorter display time for attack frame
    
    const distanceToPlayer = camera.position.distanceTo(this.position);
    if (distanceToPlayer <= this.attackRange) {
      const hitChance = Math.max(0.3, 1.0 - (distanceToPlayer / this.attackRange));
      if (Math.random() < hitChance) { 
        this.hitPlayer(); 
      } else { 
        console.log(`${this.id} missed!`); 
      }
    }
  }
  
  hitPlayer() {
    if (gameOver) return; 
    gameState.health -= 1; 
    console.log(`Player hit by ${this.id}! Health: ${gameState.health}`);
    if (gameState.health <= 0) { 
      gameState.health = 0; 
      if (typeof triggerGameOver === 'function') triggerGameOver(); 
    }
  }
  
  makeAggressive() {
    if (!this.aggressive) { 
      this.aggressive = true; 
      console.log(`${this.id} becomes aggressive and advances!`); 
    }
  }
  
  // ENHANCED: Pamphlet conversion now makes them aggressive instead of passive
  convert() {
    if (this.converted) return; 
    this.converted = true; 
    this.makeAggressive(); // ENHANCED: Make them advance when converted
    this.glowMesh = createBlueGlow(this.mesh);
    console.log(`${this.id} converted and made aggressive!`);
  }
  
  takeDamage(amount) {
    if (this.dying) return; 
    this.health -= amount; 
    this.makeAggressive(); // Make aggressive when damaged
    console.log(`${this.id} took ${amount} damage, health: ${this.health}`);
    if (this.health <= 0) this.die();
  }
  
  die() {
    if (this.dying) return; 
    this.dying = true;
    this.animState = 'DYING';
    this.deathFrame = 0;
    this.animTimer = 0;
    this.deathAnimationComplete = false;
    
    playSound('stormiedies1');
    console.log(`${this.id} starting death sequence - will play 14 frames then fade`);
  }
  
  // ENHANCED: Separate fade function called after death animation completes
  startFade() {
    let opacity = 1.0;
    const fadeInterval = setInterval(() => {
      opacity -= 0.15; // Faster fade than other entities
      if (this.mesh) this.mesh.material.opacity = opacity;
      if (this.shadowMesh) this.shadowMesh.material.opacity = opacity * 0.4;
      if (this.glowMesh) this.glowMesh.material.opacity = opacity * 0.3;
      if (opacity <= 0) { 
        clearInterval(fadeInterval); 
        this.destroy(); 
      }
    }, 50);
  }
  
  destroy() {
    if (this.mesh) scene.remove(this.mesh); 
    if (this.shadowMesh) scene.remove(this.shadowMesh);
    if (this.glowMesh) scene.remove(this.glowMesh);
    if (this.muzzleFlash) scene.remove(this.muzzleFlash); // NEW: Clean up muzzle flash
    const index = stormtroopers.indexOf(this); 
    if (index > -1) stormtroopers.splice(index, 1);
    console.log(`${this.id} destroyed`);
  }
}

// === ENTITY CREATION FUNCTIONS ===
function createAllUnits() {
  console.log('Creating all game units...');
  
  try {
    // FIXED: Distribute entities across 6 rooms - keep within room bounds (-4 to 4 x, room center z)
    // Room 0 (z: 0-10): R2 units  
    const r2_1 = new R2Unit(new THREE.Vector3(-2, 0, 3), 'r2_room1_a'); 
    const r2_2 = new R2Unit(new THREE.Vector3(2, 0, 6), 'r2_room1_b');
    r2Units.push(r2_1, r2_2);
    
    // Room 1 (z: 10-20): Probe droids
    const probe1 = new ProbeDroid(new THREE.Vector3(-2, 0, 13), 'probe_room2_a'); 
    const probe2 = new ProbeDroid(new THREE.Vector3(2, 0, 16), 'probe_room2_b');
    probeDroids.push(probe1, probe2);
    
    // Room 2 (z: 20-30): Stormtroopers
    const stormie1 = new Stormtrooper(new THREE.Vector3(-2, 0, 23), 'stormie_room3_a'); 
    const stormie2 = new Stormtrooper(new THREE.Vector3(2, 0, 26), 'stormie_room3_b');
    stormtroopers.push(stormie1, stormie2);
    
    // Room 3 (z: 30-40): Xerox droids
    const xerox1 = new XeroxDroid(new THREE.Vector3(-2, 0, 33), 'xerox_room4_a'); 
    const xerox2 = new XeroxDroid(new THREE.Vector3(2, 0, 36), 'xerox_room4_b');
    xeroxDroids.push(xerox1, xerox2);
    
    // Room 4 (z: 40-50): Aliens
    const alien1 = new AlienA(new THREE.Vector3(-2, 0, 43), 'alien_room5_a'); 
    const alien2 = new AlienA(new THREE.Vector3(2, 0, 46), 'alien_room5_b');
    aliens.push(alien1, alien2);
    
    // Room 5 (z: 50-60): Mixed enemies (boss room)
    const stormie3 = new Stormtrooper(new THREE.Vector3(-2, 0, 53), 'stormie_boss'); 
    const probe3 = new ProbeDroid(new THREE.Vector3(2, 0, 53), 'probe_boss');
    const alien3 = new AlienA(new THREE.Vector3(0, 0, 56), 'alien_boss');
    stormtroopers.push(stormie3);
    probeDroids.push(probe3);
    aliens.push(alien3);
    
    console.log(`Created units: ${r2Units.length} R2s, ${stormtroopers.length} stormies, ${probeDroids.length} probes, ${xeroxDroids.length} xerox, ${aliens.length} aliens`);
  } catch (error) {
    console.error('Error creating units:', error);
  }
}