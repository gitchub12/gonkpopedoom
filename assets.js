// === ASSET DATABASE ===
// Short ID system for sounds and images
// s001-s999 = sounds, i001-i999 = images

const ASSETS = {
  // === SOUNDS ===
  
  // Weapon Sounds s001-s025 (EXPANDED)
  s001: "sounds/zapper1.wav",
  s002: "sounds/zapper2.wav", 
  s003: "sounds/zapper3.wav",
  s004: "sounds/zapper4.mp3",
  s005: "sounds/zapper5.wav",
  s006: "sounds/shot1.wav",
  s007: "sounds/pamphlet1.wav",
  s008: "sounds/pamphlet2.wav",
  s009: "sounds/pamphlet3.wav",
  s010: "sounds/pamphlet4.wav",
  s011: "sounds/pamphlet5.wav",
  s012: "sounds/zapper6.wav", // NEW
  s013: "sounds/zapper7.wav", // NEW  
  s014: "sounds/zapper8.wav", // NEW
  s015: "sounds/dooropen.wav",
  s016: "sounds/doorclose.wav",
  s017: "sounds/zapper9.wav", // NEW
  s018: "sounds/zapper10.wav", // NEW
  s019: "sounds/zapper11.wav", // NEW
  s020: "sounds/zapper12.wav", // NEW
  s021: "sounds/zapper13.wav", // NEW
  s022: "sounds/zapper14.wav", // NEW
  s023: "sounds/shot0.mp3", // NEW
  
  // R2 Unit Sounds s025-s035 (EXPANDED)
  s025: "sounds/r2scream.wav",
  s026: "sounds/r2hurt1.wav",
  s027: "sounds/r2hurt2.wav",
  s028: "sounds/r2no.wav",
  s029: "sounds/r2random.wav",
  s030: "sounds/r2random2.wav",
  s031: "sounds/r2converted.wav",
  s032: "sounds/r2fallingover.wav",
  
  // Probe Droid Sounds s040-s050 (EXPANDED)
  s040: "sounds/PRBdie.wav",
  s041: "sounds/PRBno.wav",
  s042: "sounds/PRBrandom1.wav",
  s043: "sounds/PRBrandom3.wav",
  s044: "sounds/PRBconverted.wav",
  s045: "sounds/PRBrandom2.mp3", // NEW
  
  // Stormtrooper Sounds s055-s065
  s055: "sounds/stormiedies1.wav",
  
  // Alien A Sounds s070-s080
  s070: "sounds/aa1.wav",
  s071: "sounds/aa2.wav",
  s072: "sounds/aa3.wav",
  s073: "sounds/aaconverted.wav",
  s074: "sounds/aadies.wav",
  s075: "sounds/aano.wav",
  
  // Xerox Sounds s085-s095 (EXPANDED)
  s085: "sounds/xerox1.wav",
  s086: "sounds/xerox2.wav", // NEW
  s087: "sounds/xerox made.wav",
  
  // Game System Sounds s100-s110
  s100: "sounds/gonkdie.wav",
  
  // Music s199-s209 (FIXED: Added music0 and updated range)
  s199: "sounds/music0.mp3", // NEW: Added music0
  s200: "sounds/music1.mp3",
  s201: "sounds/music2.mp3",
  s202: "sounds/music3.mp3",
  s203: "sounds/music4.mp3",
  s204: "sounds/music5.mp3",
  s205: "sounds/music6.mp3",
  s206: "sounds/music7.mp3",
  s207: "sounds/music8.mp3",
  s208: "sounds/music9.mp3",
  s209: "sounds/Gonk and Roll (Remix)(3).mp3", // This can be music10 if needed
  
  // === SOUND GROUPS FOR EASY ACCESS ===
  ZAPPERS: ['s001', 's002', 's003', 's004', 's005', 's012', 's013', 's014', 's017', 's018', 's019', 's020', 's021', 's022'], // EXPANDED
  PAMPHLETS: ['s007', 's008', 's009', 's010', 's011'],
  BLASTER_SHOTS: ['s006', 's023'], // NEW - for stormtrooper shooting
  R2_HURT: ['s026', 's027'],
  R2_RANDOM: ['s029', 's030'],
  PRB_RANDOM: ['s042', 's043', 's045'], // EXPANDED
  AA_RANDOM: ['s070', 's071', 's072'],
  XEROX_SOUNDS: ['s085', 's086'],
  MUSIC_TRACKS: ['s199', 's200', 's201', 's202', 's203', 's204', 's205', 's206', 's207', 's208'], // FIXED: Updated to include music0-music9
  
  // === IMAGES ===
  
  // R2 Unit Frames i001-i010
  i001: "pngs/r2d2_frame_00.png",
  i002: "pngs/r2d2_frame_01.png",
  i003: "pngs/r2d2_frame_02.png",
  i004: "pngs/r2d2_frame_03.png",
  
  // Stormtrooper Idle i025-i050
  i025: "pngs/stormie1.png",
  i026: "pngs/stormie2.png",
  i027: "pngs/stormie3.png",
  i028: "pngs/stormie4.png",
  i029: "pngs/stormie5.png",
  i030: "pngs/stormie6.png",
  i031: "pngs/stormie7.png",
  i032: "pngs/stormie8.png",
  i033: "pngs/stormie9.png",
  i034: "pngs/stormie10.png",
  i035: "pngs/stormie11.png",
  i036: "pngs/stormie12.png",
  i037: "pngs/stormie13.png",
  i038: "pngs/stormie14.png",
  i039: "pngs/stormie15.png",
  i040: "pngs/stormie16.png",
  i041: "pngs/stormie17.png",
  i042: "pngs/stormie18.png",
  i043: "pngs/stormie19.png",
  i044: "pngs/stormie20.png",
  i045: "pngs/stormie21.png",
  i046: "pngs/stormie22.png",
  i047: "pngs/stormie23.png",
  i048: "pngs/stormie24.png",
  
  // Stormtrooper Attack/Special i055-i060
  i055: "pngs/stormie0.png", // FIXED: Corrected filename from "storemie0.png"
  
  // Stormtrooper Death i065-i080
  i065: "pngs/stormiedie1.png",
  i066: "pngs/stormiedie2.png",
  i067: "pngs/stormiedie3.png",
  i068: "pngs/stormiedie4.png",
  i069: "pngs/stormiedie5.png",
  i070: "pngs/stormiedie6.png",
  i071: "pngs/stormiedie7.png",
  i072: "pngs/stormiedie8.png",
  i073: "pngs/stormiedie9.png",
  i074: "pngs/stormiedie10.png",
  i075: "pngs/stormiedie11.png",
  i076: "pngs/stormiedie12.png",
  i077: "pngs/stormiedie13.png",
  i078: "pngs/stormiedie14.png",
  
  // Probe Droid Frames i100-i125
  i100: "pngs/probe1.png",
  i101: "pngs/probe2.png",
  i102: "pngs/probe3.png",
  i103: "pngs/probe4.png",
  i104: "pngs/probe5.png",
  i105: "pngs/probe6.png",
  i106: "pngs/probe7.png",
  i107: "pngs/probe8.png",
  i108: "pngs/probe9.png",
  i109: "pngs/probe10.png",
  i110: "pngs/probe11.png",
  i111: "pngs/probe12.png",
  i112: "pngs/probe13.png",
  // i113: "pngs/probe9o - Copy.png", // Skipping duplicate copy
  
  // Lightsaber Frames i113-i115
  i113: "pngs/saber1.png",
  i114: "pngs/saber2.png",
  
  // Skippy Droid Frames i120-i148
  i120: "pngs/skippy1.png",
  i121: "pngs/skippy2.png",
  i122: "pngs/skippy3.png",
  i123: "pngs/skippy4.png",
  i124: "pngs/skippy5.png",
  i125: "pngs/skippy6.png",
  i126: "pngs/skippy7.png",
  i127: "pngs/skippy8.png",
  i128: "pngs/skippy9.png",
  i129: "pngs/skippy10.png",
  i130: "pngs/skippy11.png",
  i131: "pngs/skippy12.png",
  i132: "pngs/skippy13.png",
  i133: "pngs/skippy14.png",
  i134: "pngs/skippy15.png",
  i135: "pngs/skippy16.png",
  i136: "pngs/skippy17.png",
  i137: "pngs/skippy18.png",
  i138: "pngs/skippy19.png",
  i139: "pngs/skippy20.png",
  i140: "pngs/skippy21.png",
  i141: "pngs/skippy22.png",
  i142: "pngs/skippy23.png",
  i143: "pngs/skippy24.png",
  i144: "pngs/skippy25.png",
  i145: "pngs/skippy26.png",
  i146: "pngs/skippy27.png",
  i147: "pngs/skippy28.png",
  i148: "pngs/skippy29.png",
  
  // Xerox Droid Frames i150-i175
  i150: "pngs/xerox1.png",
  i151: "pngs/xerox2.png",
  i152: "pngs/xerox3.png",
  i153: "pngs/xerox4.png",
  i154: "pngs/xerox5.png",
  i155: "pngs/xerox6.png",
  i156: "pngs/xerox7.png",
  i157: "pngs/xerox8.png",
  i158: "pngs/xerox9.png",
  i159: "pngs/xerox10.png",
  i160: "pngs/xerox11.png",
  i161: "pngs/xerox12.png",
  i162: "pngs/xerox13.png",
  
  // Explosion/Boom Frames i180-i205
  i180: "pngs/boom1.png",
  i181: "pngs/boom2.png",
  i182: "pngs/boom3.png",
  i183: "pngs/boom4.png",
  i184: "pngs/boom5.png",
  i185: "pngs/boom6.png",
  i186: "pngs/boom7.png",
  i187: "pngs/boom8.png",
  i188: "pngs/boom9.png",
  i189: "pngs/boom10.png",
  i190: "pngs/boom11.png",
  i191: "pngs/boom12.png",
  i192: "pngs/boom13.png",
  i193: "pngs/boom14.png",
  i194: "pngs/boom15.png",
  i195: "pngs/boom16.png",
  i196: "pngs/boom17.png",
  i197: "pngs/boom18.png",
  i198: "pngs/boom19.png",
  i199: "pngs/boom20.png",
  i250: "pngs/boom21.png",
  i251: "pngs/boom22.png",
  i252: "pngs/boom23.png",
  i253: "pngs/boom24.png",
  i254: "pngs/boom25.png",
  i255: "pngs/boom26.png",
  
  // Alien A Frames i200-i225
  i200: "pngs/aliena1.png",
  i201: "pngs/aliena2.png",
  i202: "pngs/aliena3.png",
  i203: "pngs/aliena4.png",
  i204: "pngs/aliena5.png",
  i205: "pngs/aliena6.png",
  i206: "pngs/aliena7.png",
  i207: "pngs/aliena8.png",
  i208: "pngs/aliena9.png",
  
  // Alien B Frames i220-i229 (NEW)
  i220: "pngs/alienb1.png",
  i221: "pngs/alienb2.png",
  i222: "pngs/alienb3.png",
  i223: "pngs/alienb4.png",
  i224: "pngs/alienb5.png",
  i225: "pngs/alienb6.png",
  i226: "pngs/alienb7.png",
  i227: "pngs/alienb8.png",
  
  // BB-8 Frames i230-i239 (NEW)
  i230: "pngs/bb81.png",
  i231: "pngs/bb82.png",
  i232: "pngs/bb83.png",
  i233: "pngs/bb84.png",
  i234: "pngs/bb85.png",
  i235: "pngs/bb86.png",
  i236: "pngs/bb87.png",
  
  // R5 Droid Frames i240-i259 (NEW)
  i240: "pngs/r52.png",
  i241: "pngs/r53.png",
  i242: "pngs/r54.png",
  i243: "pngs/r55.png",
  i244: "pngs/r56.png",
  i245: "pngs/r57.png",
  i246: "pngs/r58.png",
  i247: "pngs/r59.png",
  i248: "pngs/r591.png",
  i249: "pngs/r592.png",
  i250: "pngs/r593.png",
  i251: "pngs/r594.png",
  i252: "pngs/r595.png",
  i253: "pngs/r596.png",
  
  // Pop/Effect Frames i260-i269
  i260: "pngs/pop1.png",
  i261: "pngs/pop2.png",
  i262: "pngs/pop3.png",
  i263: "pngs/pop4.png",
  i264: "pngs/pop5.png",
  i265: "pngs/pop6.png",
  i266: "pngs/pop7.png",
  i267: "pngs/pop8.png",
  i268: "pngs/pop9.png",
  i269: "pngs/pop10.png",
  
  // Environment Textures i300-i325
  i300: "pngs/floor1_512.png",
  i301: "pngs/wall1_512.png",
  i302: "pngs/splitdoor.png",
  
  // Pamphlet Textures i400-i404 (NEWLY ADDED)
  i400: "pngs/pamphlet_leia.png",
  i401: "pngs/pamphlet_saber.png",
  i402: "pngs/pamphlet_skippy.png",
  i403: "pngs/pamphlet_empire.png",
  i404: "pngs/pamphlet_kenobi.png",
  
  // === IMAGE GROUPS ===
  R2_FRAMES: ['i001', 'i002', 'i003', 'i004'],
  STORMIE_IDLE: ['i025', 'i026', 'i027', 'i028', 'i029', 'i030', 'i031', 'i032', 'i033', 'i034', 'i035', 'i036', 'i037', 'i038', 'i039', 'i040', 'i041', 'i042', 'i043', 'i044', 'i045', 'i046', 'i047', 'i048'],
  STORMIE_ATTACK: ['i055'],
  STORMIE_DEATH: ['i065', 'i066', 'i067', 'i068', 'i069', 'i070', 'i071', 'i072', 'i073', 'i074', 'i075', 'i076', 'i077', 'i078'],
  PROBE_FRAMES: ['i100', 'i101', 'i102', 'i103', 'i104', 'i105', 'i106', 'i107', 'i108', 'i109', 'i110', 'i111', 'i112'],
  XEROX_FRAMES: ['i150', 'i151', 'i152', 'i153', 'i154', 'i155', 'i156', 'i157', 'i158', 'i159', 'i160', 'i161', 'i162'],
  ALIENA_FRAMES: ['i200', 'i201', 'i202', 'i203', 'i204', 'i205', 'i206', 'i207', 'i208'],
  ALIENB_FRAMES: ['i220', 'i221', 'i222', 'i223', 'i224', 'i225', 'i226', 'i227'], // NEW
  BB8_FRAMES: ['i230', 'i231', 'i232', 'i233', 'i234', 'i235', 'i236'], // NEW
  R5_FRAMES: ['i240', 'i241', 'i242', 'i243', 'i244', 'i245', 'i246', 'i247', 'i248', 'i249', 'i250', 'i251', 'i252', 'i253'], // NEW
  ENVIRONMENT: ['i300', 'i301', 'i302'],
  SABER_FRAMES: ['i113', 'i114'],
  SKIPPY_FRAMES: ['i120', 'i121', 'i122', 'i123', 'i124', 'i125', 'i126', 'i127', 'i128', 'i129', 'i130', 'i131', 'i132', 'i133', 'i134', 'i135', 'i136', 'i137', 'i138', 'i139', 'i140', 'i141', 'i142', 'i143', 'i144', 'i145', 'i146', 'i147', 'i148'],
  BOOM_FRAMES: ['i180', 'i181', 'i182', 'i183', 'i184', 'i185', 'i186', 'i187', 'i188', 'i189', 'i190', 'i191', 'i192', 'i193', 'i194', 'i195', 'i196', 'i197', 'i198', 'i199', 'i250', 'i251', 'i252', 'i253', 'i254', 'i255'],
  POP_FRAMES: ['i260', 'i261', 'i262', 'i263', 'i264', 'i265', 'i266', 'i267', 'i268', 'i269'],
  PAMPHLET_FRAMES: ['i400', 'i401', 'i402', 'i403', 'i404'] // NEWLY ADDED
};

// === UTILITY FUNCTIONS ===

// Play sound by short ID
function play(assetId, volume = null) {
  // FIXED: Check audio mode before playing sounds
  if (typeof audioMode !== 'undefined' && audioMode === 2) {
    return; // All sounds off
  }
  
  const path = ASSETS[assetId];
  if (!path) {
    console.error(`Asset ${assetId} not found`);
    return;
  }
  
  const audio = new Audio(path);
  if (volume !== null) audio.volume = volume;
  audio.currentTime = 0;
  audio.play().catch(e => console.log(`${assetId} audio failed:`, e));
}

// Get asset path by ID
function asset(assetId) {
  return ASSETS[assetId] || null;
}

// Play random sound from group
function playRandom(groupArray, volume = null) {
  if (!groupArray || groupArray.length === 0) return;
  const randomId = groupArray[Math.floor(Math.random() * groupArray.length)];
  play(randomId, volume);
}

// Load texture by short ID - FIXED: Added safety check
function tex(assetId) {
  if (typeof THREE === 'undefined') {
    console.error('THREE.js not loaded yet, cannot create texture');
    return null;
  }
  
  const path = ASSETS[assetId];
  if (!path) {
    console.error(`Texture asset ${assetId} not found`);
    return null;
  }
  return new THREE.TextureLoader().load(path);
}

// Create material by short ID - FIXED: Added safety check
function mat(assetId, transparent = true) {
  if (typeof THREE === 'undefined') {
    console.error('THREE.js not loaded yet, cannot create material');
    return null;
  }
  
  const texture = tex(assetId);
  if (!texture) return null;
  return new THREE.MeshBasicMaterial({ map: texture, transparent });
}