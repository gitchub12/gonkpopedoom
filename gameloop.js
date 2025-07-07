// === GAME LOOP & CONTROLS ===
// Main game loop, event handlers, HUD updates
// Uses shared resources from config.js

// === HUD UPDATES ===
function updateHUD() {
  if (gameOver) return;
  const healthPercentage = (gameState.health / gameState.maxHealth) * 100;
  document.getElementById('healthFill').style.width = healthPercentage + '%';
  document.getElementById('healthText').textContent = `${gameState.health}/${gameState.maxHealth}`;
  document.getElementById('ammoCounter').textContent = `Pamphlets: ${gameState.pamphlets}`;
  document.getElementById('zapperFill').style.height = (gameState.zapCharge * 100) + '%';
  
  const statusText = document.getElementById('statusText');
  const baseText = 'WASD move, Mouse look, Left zap, Right pamphlet, Space doors, +/- music, P no-clip';
  statusText.textContent = noClipMode ? baseText + ' [NO-CLIP ON]' : baseText;
  if (noClipMode) statusText.style.color = '#ff0000';
  else statusText.style.color = '#ffff00';
}

// === EVENT LISTENERS ===
function setupEventListeners() {
  document.addEventListener("keydown", e => { 
    keys[e.code] = true; 
    if (!gameStarted) gameStarted = true; 
    startBackgroundMusic();
    
    if (e.code === "Space") {
      e.preventDefault(); 
      console.log(`Space pressed! Player at: (${camera.position.x.toFixed(2)}, ${camera.position.z.toFixed(2)})`);
      console.log(`Available doors: ${doors ? doors.length : 'doors not defined'}`);
      
      let nearestDoor = null; 
      let nearestDistance = Infinity;
      
      if (doors && doors.length > 0) {
        for (let door of doors) {
          const distance = camera.position.distanceTo(door.position);
          console.log(`Door ${door.id} at distance ${distance.toFixed(2)}`);
          if (distance < 4 && distance < nearestDistance) { 
            nearestDoor = door; 
            nearestDistance = distance; 
          }
        }
      }
      
      if (nearestDoor) {
        console.log(`Opening nearest door: ${nearestDoor.id} at distance ${nearestDistance.toFixed(2)}`);
        nearestDoor.open();
      } else {
        console.log('No door within range (4 units)');
      }
    }
    
    if (e.code === "KeyP") {
      e.preventDefault(); 
      noClipMode = !noClipMode; 
      console.log(`No-clip mode: ${noClipMode ? 'ON' : 'OFF'}`);
    }
    
    if (e.code === "KeyM") {
      e.preventDefault();
      toggleAudioMode();
    }
    
    if (e.code === "Equal" || e.code === "NumpadAdd") { 
      e.preventDefault(); 
      switchMusicTrack('next'); 
    }
    if (e.code === "Minus" || e.code === "NumpadSubtract") { 
      e.preventDefault(); 
      switchMusicTrack('prev'); 
    }
  });
  
  document.addEventListener("keyup", e => { 
    keys[e.code] = false; 
  });
  
  document.addEventListener("mousedown", e => { 
    // FIXED: Only activate zapper if pointer is already locked (already in game)
    if (e.button === 0) {
      if (!gameStarted) { 
        gameStarted = true; 
        startBackgroundMusic(); 
      } else if (document.pointerLockElement === document.body) { 
        // Only zap if we're already in pointer lock mode
        handleZapperAttack(); 
      }
    }
    if (e.button === 2) { 
      e.preventDefault(); 
      if (document.pointerLockElement === document.body) {
        handlePamphletAttack(); 
      }
    }
  });
  
  window.addEventListener("contextmenu", e => { 
    e.preventDefault(); 
  });
  
  document.addEventListener("click", () => {
    if (document.pointerLockElement !== document.body) { 
      document.body.requestPointerLock(); 
    }
  });
  
  document.addEventListener("mousemove", onMouseMove); 
  window.addEventListener("resize", onWindowResize);
}

function onMouseMove(event) {
  if (document.pointerLockElement === document.body) { 
    yaw -= event.movementX * 0.002; 
    camera.rotation.y = yaw; 
  }
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight; 
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}