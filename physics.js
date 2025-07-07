// === PHYSICS & COMBAT SYSTEMS ===
// Movement, collision detection, weapon systems
// Uses shared resources from config.js

// === COLLISION DETECTION ===
function checkWallCollision(newPosition) {
  const buffer = CONFIG.COLLISION_RADIUS + CONFIG.WALL_BARRIER;
  
  // FIXED: Simple collision for 6 square rooms (10x10 each)
  // Rooms are at z: 0-10, 10-20, 20-30, 30-40, 40-50, 50-60
  
  // Find which room we're in
  const roomIndex = Math.floor(newPosition.z / 10);
  const roomZ = roomIndex * 10;
  
  // Check if we're within valid room bounds
  if (roomIndex < 0 || roomIndex >= 6) return false;
  
  // Check east/west walls (x boundaries)
  if (newPosition.x < -5 + buffer || newPosition.x > 5 - buffer) return false;
  
  // Check south wall (only for first room)
  if (roomIndex === 0 && newPosition.z < roomZ + buffer) return false;
  
  // Check north wall (only for last room)
  if (roomIndex === 5 && newPosition.z > roomZ + 10 - buffer) return false;
  
  // Check north walls with door gaps for rooms 0-4
  if (roomIndex < 5) {
    const nextRoomZ = (roomIndex + 1) * 10;
    if (newPosition.z > nextRoomZ - buffer) {
      // Check if we're outside the door gap (door gap is x: -1.5 to 1.5)
      if (newPosition.x < -1.5 + buffer || newPosition.x > 1.5 - buffer) {
        return false;
      }
      // Also check if there's a closed door blocking this specific gap
      for (let door of doors) { 
        if (Math.abs(door.position.z - nextRoomZ) < 0.1) { // This is the door for this room boundary
          if (!door.checkCollision(newPosition)) return false; 
        }
      }
    }
  }
  
  return true;
}

function checkEntityCollision(newPosition, entities) {
  for (let entity of entities) {
    if (entity.dying) continue;
    const distance = newPosition.distanceTo(entity.position);
    if (distance < CONFIG.COLLISION_RADIUS + entity.collisionRadius) return false;
  }
  return true;
}

// === MOVEMENT SYSTEM ===
function updateMovement(deltaTime) {
  if (gameOver) return;
  const acceleration = new THREE.Vector3(); 
  let isMoving = false;
  const forward = new THREE.Vector3(Math.sin(yaw), 0, Math.cos(yaw)).normalize();
  const right = new THREE.Vector3(Math.cos(yaw), 0, -Math.sin(yaw)).normalize();
  
  if (keys["KeyW"]) { 
    acceleration.addScaledVector(forward, -CONFIG.MOVE_SPEED); 
    isMoving = true; 
  }
  if (keys["KeyS"]) { 
    acceleration.addScaledVector(forward, CONFIG.MOVE_SPEED); 
    isMoving = true; 
  }
  if (keys["KeyA"]) { 
    acceleration.addScaledVector(right, -CONFIG.MOVE_SPEED); 
    isMoving = true; 
  }
  if (keys["KeyD"]) { 
    acceleration.addScaledVector(right, CONFIG.MOVE_SPEED); 
    isMoving = true; 
  }
  
  gameState.isMoving = isMoving; 
  velocity.add(acceleration); 
  velocity.multiplyScalar(CONFIG.FRICTION);
  const newPosition = camera.position.clone(); 
  newPosition.add(velocity); 
  newPosition.y = baseY;
  
  if (noClipMode) {
    camera.position.copy(newPosition);
  } else {
    // NEW: Check for NPC pushing and handle it
    let pushingNPC = false;
    const allNPCs = [...r2Units, ...stormtroopers, ...probeDroids, ...xeroxDroids, ...aliens, ...npcs];
    
    for (let npc of allNPCs) {
      if (npc.dying) continue;
      const distanceToNPC = newPosition.distanceTo(npc.position);
      if (distanceToNPC < CONFIG.COLLISION_RADIUS + npc.collisionRadius) {
        // We're pushing this NPC
        pushingNPC = true;
        
        // Calculate push direction (from player to NPC)
        const pushDirection = new THREE.Vector3();
        pushDirection.subVectors(npc.position, camera.position).normalize();
        
        // Try to move NPC in push direction
        const npcNewPosition = npc.position.clone();
        npcNewPosition.add(pushDirection.multiplyScalar(CONFIG.MOVE_SPEED * 0.3)); // Slow NPC movement
        
        // FIXED: Check if NPC would hit wall - if so, stop both player and NPC
        if (checkWallCollision(npcNewPosition)) {
          // NPC can move, so update its position
          npc.position.copy(npcNewPosition);
          if (npc.mesh) {
            npc.mesh.position.copy(npc.position);
            npc.mesh.position.y = npc.mesh.position.y; // Keep NPC at its height
          }
          
          // Player moves at reduced speed when pushing
          const reducedVelocity = velocity.clone().multiplyScalar(CONFIG.PUSH_SPEED_MULTIPLIER);
          const playerPushPosition = camera.position.clone().add(reducedVelocity);
          
          // FIXED: Double-check player position is valid and within world bounds
          if (checkWallCollision(playerPushPosition) && 
              playerPushPosition.x > -50 && playerPushPosition.x < 50 && 
              playerPushPosition.z > -5 && playerPushPosition.z < 65) {
            camera.position.copy(playerPushPosition);
          } else {
            // FIXED: If player would go out of bounds, stop movement entirely
            velocity.set(0, 0, 0);
          }
        } else {
          // FIXED: If NPC can't move (would hit wall), player also can't move in that direction
          velocity.multiplyScalar(0.1); // Stop player movement
        }
        break;
      }
    }
    
    // Normal movement if not pushing NPCs
    if (!pushingNPC) {
      // FIXED: Extra safety check to prevent going outside world bounds
      if (checkWallCollision(newPosition) && checkEntityCollision(newPosition, allNPCs) &&
          newPosition.x > -50 && newPosition.x < 50 && 
          newPosition.z > -5 && newPosition.z < 65) {
        camera.position.copy(newPosition);
      } else { 
        velocity.multiplyScalar(0.5); 
      }
    }
  }
}

// === WEAPON BOBBING ===
let isZapping = false; // FIXED: Flag to prevent bob from overriding zap animation

function updateWeaponBob(deltaTime) {
  if (gameOver || isZapping) return; // FIXED: Don't update bob during zap animation
  if (gameState.isMoving) {
    bobTime += deltaTime * CONFIG.BOB_SPEED; 
    const bobOffset = Math.sin(bobTime) * CONFIG.BOB_AMOUNT;
    camera.position.y = baseY + bobOffset; 
    const sway = Math.sin(bobTime * 0.5) * 0.02; 
    camera.position.x += sway;
    weaponBobOffset = Math.sin(bobTime * 1.5) * 10;
    const weaponSprite = document.getElementById('weaponSprite');
    // UPDATED: Adjusted for new weapon position (right 10%, down 5% more)
    weaponSprite.style.transform = `translateX(-70%) translateY(${weaponBobOffset + 198}px) rotate(10deg)`;
  } else {
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, baseY, 0.1);
    weaponBobOffset = THREE.MathUtils.lerp(weaponBobOffset, 0, 0.1);
    const weaponSprite = document.getElementById('weaponSprite');
    // UPDATED: Maintain same new positioning with rotation when not moving
    weaponSprite.style.transform = `translateX(-70%) translateY(${weaponBobOffset + 198}px) rotate(10deg)`;
    bobTime = 0;
  }
}

// === WEAPON SPRITE HELPER FUNCTIONS ===
function setWeaponSprite(spriteNumber) {
  const weaponSprite = document.getElementById('weaponSprite');
  weaponSprite.style.backgroundImage = `url('pngs/weapon_sprite${spriteNumber}.png')`;
}

function resetWeaponSprite() {
  setWeaponSprite(1); // Back to weapon_sprite1.png
}

// === ZAPPER SYSTEM ===
function updateZapperCharge(deltaTime) {
  if (gameOver) return;
  if (!gameState.zapReady && gameState.zapCharge < 1.0) {
    gameState.zapCharge += deltaTime / CONFIG.ZAP_RECHARGE_TIME;
    if (gameState.zapCharge >= 1.0) { 
      gameState.zapCharge = 1.0; 
      gameState.zapReady = true; 
    }
  }
}

function playRandomZapperSound() {
  // FIXED: Use complete list of all available zapper sounds
  const zapperSounds = ['s001', 's002', 's003', 's004', 's005', 's012', 's013', 's014', 's017', 's018', 's019', 's020', 's021', 's022']; // All zapper sounds
  const randomSound = zapperSounds[Math.floor(Math.random() * zapperSounds.length)];
  play(randomSound); // Use the asset system directly
}

function handleZapperAttack() {
  if (!gameState.zapReady || gameOver || !gameStarted) return;
  startBackgroundMusic(); 
  gameState.zapReady = false; 
  gameState.zapCharge = 0.0;
  
  isZapping = true; // FIXED: Prevent weapon bob from interfering
  console.log("Starting zapper attack animation");
  const weaponSprite = document.getElementById('weaponSprite');
  const baseY = weaponBobOffset + 198; // UPDATED: Changed from 155 to 198 for new position
  const screenHeight = window.innerHeight;
  const jabDistance = screenHeight * 0.05; // 5% of screen height
  
  console.log(`Base Y: ${baseY}, Jab distance: ${jabDistance}`);
  
  // UPDATED: Weapon jab animation with sprite changes during extension
  let animStep = 0;
  const totalSteps = 6; // Animation steps for smooth movement
  const stepDuration = 45; // 45ms per step = 270ms total (under 0.3s)
  
  const animate = () => {
    animStep++;
    console.log(`Animation step: ${animStep}`);
    
    if (animStep <= 3) {
      // Jabbing forward - change angle from 10° to 5° and move up
      const progress = animStep / 3;
      const currentAngle = 10 - (5 * progress); // 10° to 5° (5° counterclockwise)
      const currentY = baseY - (jabDistance * progress);
      console.log(`Jab phase - Angle: ${currentAngle}°, Y: ${currentY}`);
      weaponSprite.style.transform = `translateX(-70%) translateY(${currentY}px) rotate(${currentAngle}deg)`;
      
      // UPDATED: Change weapon sprites during extension frames
      if (animStep === 1) {
        setWeaponSprite(2); // weapon_sprite2.png
      } else if (animStep === 2) {
        setWeaponSprite(3); // weapon_sprite3.png
      } else if (animStep === 3) {
        setWeaponSprite(4); // weapon_sprite4.png
      }
      
      // Sound starts one frame before peak (step 2)
      if (animStep === 2) {
        playRandomZapperSound();
      }
      
      // Flash and target check at peak extension (step 3)
      if (animStep === 3) {
        triggerElectricFlash();
        checkZapperTargets();
      }
    } else {
      // Returning to base position
      const progress = (animStep - 3) / 3;
      const currentAngle = 5 + (5 * progress); // 5° back to 10°
      const currentY = (baseY - jabDistance) + (jabDistance * progress);
      console.log(`Return phase - Angle: ${currentAngle}°, Y: ${currentY}`);
      weaponSprite.style.transform = `translateX(-70%) translateY(${currentY}px) rotate(${currentAngle}deg)`;
      
      // UPDATED: Return to base sprite immediately when retracting starts
      if (animStep === 4) {
        resetWeaponSprite(); // Back to weapon_sprite1.png
      }
    }
    
    if (animStep < totalSteps) {
      setTimeout(animate, stepDuration);
    } else {
      console.log("Animation complete");
      isZapping = false; // FIXED: Re-enable weapon bob
      resetWeaponSprite(); // Ensure we're back to base sprite
    }
  };
  
  animate();
}

function checkZapperTargets() {
  const zapRange = CONFIG.ZAP_RANGE;
  const allTargets = [...r2Units, ...stormtroopers, ...probeDroids, ...xeroxDroids, ...aliens, ...npcs];
  for (let target of allTargets) {
    if (target.dying) continue;
    const distance = camera.position.distanceTo(target.position);
    if (distance < zapRange) {
      target.takeDamage(1); 
      console.log(`Zapped ${target.id} at distance ${distance.toFixed(2)}`);
    }
  }
}

// === PAMPHLET SYSTEM ===
function handlePamphletAttack() {
  if (gameOver || !gameStarted || gameState.pamphlets <= 0) return;
  gameState.pamphlets -= 1;
  const forward = new THREE.Vector3(Math.sin(yaw), 0, Math.cos(yaw));
  const pamphlet = new PamphletProjectile(camera.position.clone(), forward.negate());
  pamphletProjectiles.push(pamphlet);
  console.log(`Fired pamphlet! Remaining: ${gameState.pamphlets}`);
}

// === GAME OVER SYSTEM ===
function triggerGameOver() {
  if (gameOver) return; 
  gameOver = true; 
  console.log("GAME OVER!");
  
  // FIXED: Exit pointer lock immediately when game over
  if (document.pointerLockElement) {
    document.exitPointerLock();
  }
  
  // FIXED: Stop music properly
  if (window.currentMusic) { 
    window.currentMusic.pause(); 
    window.currentMusic = null; 
  }
  
  // FIXED: Use asset system for death sound
  play('s100'); // gonkdie sound
  
  const gameOverDiv = document.createElement('div'); 
  gameOverDiv.id = 'gameOverScreen';
  gameOverDiv.style.cssText = `position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0, 0, 0, 0.8); color: red; font-family: Arial, sans-serif; display: flex; flex-direction: column; justify-content: center; align-items: center; z-index: 1000; pointer-events: auto; cursor: pointer; user-select: none;`;
  gameOverDiv.innerHTML = `<h1 style="font-size: 4em; margin: 0; text-shadow: 2px 2px 4px black; user-select: none;">GAME OVER</h1><p style="font-size: 1.5em; margin: 20px 0; text-shadow: 1px 1px 2px black; user-select: none;">Health: ${gameState.health}</p><p id="restartMessage" style="font-size: 1.2em; color: yellow; text-shadow: 1px 1px 2px black; opacity: 0; user-select: none;">Click to Restart</p>`;
  document.body.appendChild(gameOverDiv);
  
  setTimeout(() => { 
    document.getElementById('restartMessage').style.opacity = '1'; 
    gameOverDiv.addEventListener('click', restartGame); 
  }, 500); // FIXED: Much faster - changed from 2000ms (2 seconds) to 500ms (half second)
}

function restartGame() {
  console.log("Restarting game...");
  const gameOverScreen = document.getElementById('gameOverScreen'); 
  if (gameOverScreen) gameOverScreen.remove();
  
  gameOver = false; 
  gameStarted = true; 
  gameState.health = gameState.maxHealth; 
  gameState.pamphlets = 50; 
  gameState.zapReady = true; 
  gameState.zapCharge = 1.0;
  camera.position.set(0, baseY, 15); // FIXED: Start in second room (z: 10-20, center at 15)
  yaw = 0; 
  camera.rotation.y = yaw;
  
  // FIXED: Properly destroy all entities
  [...r2Units, ...stormtroopers, ...probeDroids, ...xeroxDroids, ...aliens, ...pamphletProjectiles].forEach(entity => {
    if (entity && typeof entity.destroy === 'function') {
      entity.destroy();
    }
  });
  
  // FIXED: Clean up doors properly
  for (let door of doors) { 
    if (door && door.mesh) {
      scene.remove(door.mesh); 
    }
  }
  
  r2Units.length = 0; 
  stormtroopers.length = 0; 
  probeDroids.length = 0; 
  xeroxDroids.length = 0; 
  aliens.length = 0; 
  doors.length = 0; 
  pamphletProjectiles.length = 0;
  
  createAllUnits(); 
  createDoors(); 
  
  // FIXED: Music restart using new system
  const nextTrack = getNextMusicTrack(); 
  startMusic(nextTrack);
  console.log(`Restarted with music track ${currentMusicTrack}`);
  
  // Reset weapon sprite after restart
  resetWeaponSprite();
}