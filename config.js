// === SHARED GAME RESOURCES ===
// This file contains ALL shared resources that other modules need to reference
// Add new sounds, materials, or config here and all modules can use them
// Note: Core variables (scene, camera, baseY, etc.) are defined in main.html
// Note: Assets (sounds, images) are now defined in assets.js with short IDs

// === GAME CONFIGURATION ===
const CONFIG = {
  MOVE_SPEED: 0.08,
  BOB_SPEED: 8,
  BOB_AMOUNT: 0.1,
  FRICTION: 0.85,
  COLLISION_RADIUS: 0.4,
  WALL_BARRIER: 0.6,
  DOOR_OPEN_TIME: 5000,
  ZAP_RANGE: 3.0,
  ZAP_RECHARGE_TIME: 1.0, // FIXED: Reduced from 2.0 to 1.0 second
  STORMIE_SHOT_COOLDOWN: 2000,
  STORMIE_ATTACK_RANGE: 8.0,
  ANIMATION_INTERVAL: 500,
  STORMIE_ANIM_SPEED: 12,
  XEROX_ANIM_SPEED: 12, // Faster animation, matches stormtroopers
  FADE_SPEED: 0.05,
  DEATH_ANIM_DELAY: 1400
};

// === AUDIO MODE SYSTEM ===
let audioMode = 0; // 0 = all on, 1 = music off, 2 = all off
let originalMusicVolume = 0.15;

function toggleAudioMode() {
  audioMode = (audioMode + 1) % 3;
  
  switch(audioMode) {
    case 0: // All sounds on
      if (window.currentMusic) {
        window.currentMusic.volume = originalMusicVolume;
      }
      showAudioMessage("Sounds On");
      break;
    case 1: // Music off
      if (window.currentMusic) {
        window.currentMusic.volume = 0;
      }
      showAudioMessage("Music Off");
      break;
    case 2: // All sounds off
      if (window.currentMusic) {
        window.currentMusic.volume = 0;
      }
      showAudioMessage("All Sound Off");
      break;
  }
}

function showAudioMessage(message) {
  // Remove existing message if any
  const existing = document.getElementById('audioMessage');
  if (existing) existing.remove();
  
  // Create new message
  const messageDiv = document.createElement('div');
  messageDiv.id = 'audioMessage';
  messageDiv.textContent = message;
  messageDiv.style.cssText = `
    position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
    background: rgba(0, 0, 0, 0.8); color: #ffff00; padding: 20px 40px;
    font-family: Arial, sans-serif; font-size: 24px; font-weight: bold;
    border: 2px solid #ffff00; border-radius: 10px; z-index: 2000;
    text-shadow: 2px 2px 4px rgba(0,0,0,0.8);
  `;
  document.body.appendChild(messageDiv);
  
  // Remove after 2 seconds
  setTimeout(() => {
    if (messageDiv.parentNode) {
      messageDiv.remove();
    }
  }, 2000);
}

// === AUDIO SYSTEM (Now using assets.js) ===
// Audio files and volumes are managed in assets.js
// Use play('s001') instead of direct audio references

// === SHARED UTILITY FUNCTIONS ===
// Basic playSound function is now in assets.js as play()

// Legacy function for compatibility
function playSound(soundName, volume = null) {
  // Map old sound names to new asset IDs
  const soundMap = {
    'r2scream': 's025',
    'prbdie': 's040', 
    'gonkdie': 's100',
    'dooropen': 's015',
    'doorclose': 's016',
    'blast1': 's006',
    'stormiedies1': 's055'
  };
  
  const assetId = soundMap[soundName];
  if (assetId) {
    play(assetId, volume);
  } else {
    console.warn(`Sound ${soundName} not found in asset map`);
  }
}

function createBlueGlow(mesh) {
  const glowGeometry = mesh.geometry.clone();
  const glowMaterial = new THREE.MeshBasicMaterial({ color: 0x3333ff, transparent: true, opacity: 0.3 });
  const glowMesh = new THREE.Mesh(glowGeometry, glowMaterial);
  glowMesh.position.copy(mesh.position); 
  glowMesh.rotation.copy(mesh.rotation); 
  glowMesh.scale.setScalar(1.1);
  scene.add(glowMesh); 
  return glowMesh;
}

function triggerElectricFlash() {
  const flashElement = document.getElementById('electricFlash');
  flashElement.style.opacity = '1'; 
  setTimeout(() => flashElement.style.opacity = '0', 50);
}

// === MATERIALS (Now using assets.js short IDs) ===
let r2Materials, stormieIdleMaterials, stormieAttackMaterial, stormieDieMaterials, probeMaterials, xeroxMaterials, alienAMaterials;

function initializeMaterials() {
  console.log('Initializing materials...');
  
  // FIXED: Added safety checks and error handling
  if (typeof THREE === 'undefined') {
    console.error('THREE.js not loaded, cannot initialize materials');
    return false;
  }
  
  if (typeof ASSETS === 'undefined') {
    console.error('ASSETS not loaded, cannot initialize materials');
    return false;
  }
  
  if (typeof mat !== 'function') {
    console.error('mat() function not available, cannot initialize materials');
    return false;
  }
  
  try {
    // Convert asset groups to material arrays with error handling
    r2Materials = ASSETS.R2_FRAMES.map(id => {
      const material = mat(id);
      if (!material) console.warn(`Failed to create material for ${id}`);
      return material;
    }).filter(m => m !== null);
    
    stormieIdleMaterials = ASSETS.STORMIE_IDLE.map(id => {
      const material = mat(id);
      if (!material) console.warn(`Failed to create material for ${id}`);
      return material;
    }).filter(m => m !== null);
    
    stormieAttackMaterial = mat('i055');
    if (!stormieAttackMaterial) console.warn('Failed to create stormie attack material');
    
    stormieDieMaterials = ASSETS.STORMIE_DEATH.map(id => {
      const material = mat(id);
      if (!material) console.warn(`Failed to create material for ${id}`);
      return material;
    }).filter(m => m !== null);
    
    probeMaterials = ASSETS.PROBE_FRAMES.map(id => {
      const material = mat(id);
      if (!material) console.warn(`Failed to create material for ${id}`);
      return material;
    }).filter(m => m !== null);
    
    xeroxMaterials = ASSETS.XEROX_FRAMES.map(id => {
      const material = mat(id);
      if (!material) console.warn(`Failed to create material for ${id}`);
      return material;
    }).filter(m => m !== null);
    
    alienAMaterials = ASSETS.ALIENA_FRAMES.map(id => {
      const material = mat(id);
      if (!material) console.warn(`Failed to create material for ${id}`);
      return material;
    }).filter(m => m !== null);
    
    console.log('Materials initialized successfully');
    console.log(`- R2 materials: ${r2Materials.length}`);
    console.log(`- Stormie idle materials: ${stormieIdleMaterials.length}`);
    console.log(`- Stormie death materials: ${stormieDieMaterials.length}`);
    console.log(`- Probe materials: ${probeMaterials.length}`);
    console.log(`- Xerox materials: ${xeroxMaterials.length}`);
    console.log(`- Alien A materials: ${alienAMaterials.length}`);
    
    return true;
  } catch (error) {
    console.error('Error initializing materials:', error);
    return false;
  }
}

// === MUSIC FUNCTIONS ===
function getNextMusicTrack() { 
  currentMusicTrack++; 
  if (currentMusicTrack > 9) currentMusicTrack = 0; // FIXED: Cycle 0-9 instead of 1-9
  return currentMusicTrack; 
}

function getPrevMusicTrack() { 
  currentMusicTrack--; 
  if (currentMusicTrack < 0) currentMusicTrack = 9; // FIXED: Cycle 0-9 instead of 1-9
  return currentMusicTrack; 
}

function startMusic(trackNumber = currentMusicTrack) {
  // Stop current music
  if (window.currentMusic) { 
    window.currentMusic.pause(); 
    window.currentMusic = null; 
  }
  
  // Get asset ID for music track (s199-s209 for music0-music9)
  const musicAssetId = `s${199 + trackNumber}`;
  const musicPath = asset(musicAssetId);
  
  if (musicPath) {
    window.currentMusic = new Audio(musicPath);
    window.currentMusic.loop = true; 
    // FIXED: Set volume based on audio mode
    window.currentMusic.volume = (audioMode === 1 || audioMode === 2) ? 0 : originalMusicVolume;
    window.currentMusic.play().catch(e => console.log('Music play failed:', e));
    currentMusicTrack = trackNumber; 
    musicStarted = true;
  }
}

function startBackgroundMusic() { 
  if (!musicStarted) {
    // FIXED: Start with random music track 0-9
    const randomTrack = Math.floor(Math.random() * 10);
    startMusic(randomTrack);
    console.log(`Started with random music track ${randomTrack}`);
  }
}

function switchMusicTrack(direction) {
  if (direction === 'next') getNextMusicTrack(); 
  else if (direction === 'prev') getPrevMusicTrack();
  startMusic(currentMusicTrack); 
  console.log(`Switched to music track ${currentMusicTrack}`);
}