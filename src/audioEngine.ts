import { AmbientSoundType } from './types';

export class AudioEngine {
  private ctx: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private masterGain: GainNode | null = null;
  private musicGainNode: GainNode | null = null;
  private musicVolume: number = 0.85; // default music/synth volume factor

  // Synthesizer State
  private bpm: number = 92;
  private intensity: number = 5; // 1 to 10
  private bassDepth: number = 6;  // 1 to 10
  private ambientLevel: number = 5; // 1 to 10
  private synthPreset: string = 'warm-pad';

  // Playback state
  private playing: boolean = false;
  private schedulerTimer: any = null;
  private nextNoteTime: number = 0;
  private currentStep: number = 0;
  private lastScheduledStep: number = -1;

  // Sound Modules Volumes
  private ambientGains: Record<AmbientSoundType, GainNode | null> = {
    rain: null,
    thunder: null,
    wind: null,
    forest: null,
    waves: null,
    fire: null,
    city: null,
    train: null,
    coffee: null,
    space: null,
  };

  // Noise generators (rain, wind, etc.) info for dynamic updates
  private noiseNodes: Record<string, any> = {};

  // Track sequence step memory
  private chordProgression: number[][] = [
    [57, 60, 64, 67], // Am7
    [53, 57, 60, 64], // Fmaj7
    [55, 59, 62, 65], // G7
    [52, 55, 59, 62], // Em7
  ];
  private currentChordIndex: number = 0;

  constructor() {
    // Audio engine is initialized lazily upon user interaction to satisfy browser security policies
  }

  public init() {
    if (this.ctx) return;

    try {
      // Create custom AudioContext
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) {
        console.warn("Web Audio API is not supported in this browser");
        return;
      }
      this.ctx = new AudioContextClass();

      // Create Analyser Node for reactive visuals
      this.analyser = this.ctx.createAnalyser();
      this.analyser.fftSize = 512;

      // Master Gain
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.7, this.ctx.currentTime);

      // Music/Synth Gain Node
      this.musicGainNode = this.ctx.createGain();
      this.musicGainNode.gain.setValueAtTime(this.musicVolume, this.ctx.currentTime);
      this.musicGainNode.connect(this.masterGain);

      // Patch nodes
      this.masterGain.connect(this.analyser);
      this.analyser.connect(this.ctx.destination);

      // Initialise Ambient Sound Synthesizers
      this.initAmbientGenerators();
    } catch (e) {
      console.error("Failed to initialize AudioContext", e);
    }
  }

  // Setters
  public setBPM(bpm: number) {
    this.bpm = Math.max(60, Math.min(180, bpm));
  }

  public setIntensity(intensity: number) {
    this.intensity = intensity;
  }

  public setBassDepth(depth: number) {
    this.bassDepth = depth;
  }

  public setAmbientLevel(level: number) {
    this.ambientLevel = level;
    // Update ambient volumes slightly to reflect ambient slider if active
  }

  public setSynthPreset(preset: string) {
    this.synthPreset = preset;
  }

  public setMusicVolume(volume: number) {
    this.musicVolume = Math.max(0, Math.min(1.0, volume));
    if (this.musicGainNode && this.ctx) {
      this.musicGainNode.gain.setValueAtTime(this.musicVolume, this.ctx.currentTime);
    }
  }

  public getMusicVolume(): number {
    return this.musicVolume;
  }

  public setChordProgression(chords: number[][]) {
    if (chords && chords.length > 0) {
      this.chordProgression = chords;
      this.currentChordIndex = 0;
    }
  }

  // Ambient sound synthesizer generators using pure procedural noise algorithms!
  private initAmbientGenerators() {
    if (!this.ctx || !this.masterGain) return;

    const ambientTypes: AmbientSoundType[] = [
      'rain', 'thunder', 'wind', 'forest', 'waves', 'fire', 'city', 'train', 'coffee', 'space'
    ];

    ambientTypes.forEach((type) => {
      const pNode = this.ctx!.createGain();
      pNode.gain.setValueAtTime(0.0, this.ctx!.currentTime);
      pNode.connect(this.masterGain!);
      this.ambientGains[type] = pNode;

      // Launch specialized procedural generators per ambient noise type!
      this.startProceduralNoise(type, pNode);
    });
  }

  private startProceduralNoise(type: AmbientSoundType, gainNode: GainNode) {
    if (!this.ctx) return;

    // We can generate various organic noise feels using buffer resources or multi-oscillator loops
    const bufferSize = this.ctx.sampleRate * 2; // 2 seconds of noise
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const outputList = noiseBuffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      outputList[i] = Math.random() * 2 - 1;
    }

    // Node to loop white noise
    const noiseSource = this.ctx.createBufferSource();
    noiseSource.buffer = noiseBuffer;
    noiseSource.loop = true;

    // Filter to shape raw white noise into distinct organic elements!
    const filter = this.ctx.createBiquadFilter();

    if (type === 'rain') {
      // Rain: high bandpass with resonance for thin drops falling
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1000, this.ctx.currentTime);
      filter.Q.setValueAtTime(1.5, this.ctx.currentTime);
      noiseSource.connect(filter);
      filter.connect(gainNode);
    } else if (type === 'wind') {
      // Wind: lowpass + dynamic sweeping LFO high-Q peak
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(350, this.ctx.currentTime);
      filter.Q.setValueAtTime(4.0, this.ctx.currentTime);
      noiseSource.connect(filter);
      filter.connect(gainNode);

      // Windsweep modulation
      this.modulateWindSweep(filter);
    } else if (type === 'waves') {
      // Ocean Waves: lowpass with huge gain modulation using low frequency wave cycles
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(400, this.ctx.currentTime);
      noiseSource.connect(filter);
      
      const waveModulator = this.ctx.createGain();
      waveModulator.gain.setValueAtTime(0.1, this.ctx.currentTime);
      filter.connect(waveModulator);
      waveModulator.connect(gainNode);

      this.modulateOceanWaves(waveModulator);
    } else if (type === 'fire') {
      // Soft rustle (pinkish noise) + sudden random low pops
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1200, this.ctx.currentTime);
      filter.Q.setValueAtTime(0.7, this.ctx.currentTime);
      noiseSource.connect(filter);
      filter.connect(gainNode);

      // Trigger random fire crackle pops asynchronously
      this.modulateFireCrackles(gainNode);
    } else if (type === 'space') {
      // Deep space galactic swirl (multi sweep oscillators)
      const osc1 = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      osc1.type = 'sine';
      osc2.type = 'sawtooth';
      osc1.frequency.setValueAtTime(45, this.ctx.currentTime);
      osc2.frequency.setValueAtTime(70, this.ctx.currentTime);

      const filterSpace = this.ctx.createBiquadFilter();
      filterSpace.type = 'lowpass';
      filterSpace.frequency.setValueAtTime(180, this.ctx.currentTime);
      
      osc1.connect(filterSpace);
      osc2.connect(filterSpace);
      filterSpace.connect(gainNode);

      osc1.start();
      osc2.start();
    } else if (type === 'city' || type === 'coffee') {
      // Soft mid lowpass filter for general murmur hum
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(250, this.ctx.currentTime);
      noiseSource.connect(filter);
      filter.connect(gainNode);
    } else if (type === 'train') {
      // Click clack trigger at slower pace
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(150, this.ctx.currentTime);
      noiseSource.connect(filter);
      
      const trainMod = this.ctx.createGain();
      trainMod.gain.setValueAtTime(0.2, this.ctx.currentTime);
      filter.connect(trainMod);
      trainMod.connect(gainNode);

      this.modulateTrainTracks(trainMod);
    } else if (type === 'forest') {
      // Shimmering leaves + random chirps
      filter.type = 'highpass';
      filter.frequency.setValueAtTime(3000, this.ctx.currentTime);
      noiseSource.connect(filter);
      filter.connect(gainNode);
      this.modulateForestBirds(gainNode);
    } else {
      // General pass
      noiseSource.connect(gainNode);
    }

    try {
      noiseSource.start();
    } catch (e) {
      // Handle nodes that could not start
    }

    this.noiseNodes[type] = { source: noiseSource, filter };
  }

  private modulateWindSweep(filter: BiquadFilterNode) {
    if (!this.ctx) return;
    const interval = setInterval(() => {
      if (!this.playing || !this.ctx) return;
      const baseFreq = 200 + Math.random() * 400;
      const qVal = 2.5 + Math.random() * 5.0;
      try {
        filter.frequency.exponentialRampToValueAtTime(baseFreq, this.ctx.currentTime + 3.5);
        filter.Q.linearRampToValueAtTime(qVal, this.ctx.currentTime + 3.5);
      } catch (e) {}
    }, 4000);
    this.noiseNodes['wind_timer'] = interval;
  }

  private modulateOceanWaves(gainNode: GainNode) {
    if (!this.ctx) return;
    const interval = setInterval(() => {
      if (!this.playing || !this.ctx) return;
      try {
        const time = this.ctx.currentTime;
        // Moderate swelling cycles every 6 seconds simulating tidals
        gainNode.gain.setValueAtTime(0.05, time);
        gainNode.gain.exponentialRampToValueAtTime(0.8, time + 2.5);
        gainNode.gain.exponentialRampToValueAtTime(0.05, time + 6.0);
      } catch (e) {}
    }, 6100);
    this.noiseNodes['waves_timer'] = interval;
  }

  private modulateFireCrackles(gainNode: GainNode) {
    if (!this.ctx) return;
    const interval = setInterval(() => {
      if (!this.playing || !this.ctx) return;
      // Spawn tiny intense pops spontaneously
      try {
        const popOsc = this.ctx!.createOscillator();
        const popGain = this.ctx!.createGain();
        popOsc.type = 'triangle';
        popOsc.frequency.setValueAtTime(150 + Math.random() * 800, this.ctx!.currentTime);
        
        popGain.gain.setValueAtTime(0.0, this.ctx!.currentTime);
        popGain.gain.linearRampToValueAtTime(0.18, this.ctx!.currentTime + 0.01);
        popGain.gain.exponentialRampToValueAtTime(0.0001, this.ctx!.currentTime + 0.08);
        
        popOsc.connect(popGain);
        popGain.connect(gainNode);
        popOsc.start();
        popOsc.stop(this.ctx!.currentTime + 0.1);
      } catch (e) {}
    }, 450);
    this.noiseNodes['fire_timer'] = interval;
  }

  private modulateTrainTracks(gainNode: GainNode) {
    if (!this.ctx) return;
    let clickState = 0;
    const interval = setInterval(() => {
      if (!this.playing || !this.ctx) return;
      try {
        const time = this.ctx.currentTime;
        // Rhythm: cha-chu-cha-chu click clicks
        gainNode.gain.setValueAtTime(0.05, time);
        gainNode.gain.linearRampToValueAtTime(0.35, time + 0.02);
        gainNode.gain.exponentialRampToValueAtTime(0.05, time + 0.15);
      } catch (e) {}
    }, 850);
    this.noiseNodes['train_timer'] = interval;
  }

  private modulateForestBirds(ambientGainNode: GainNode) {
    if (!this.ctx) return;
    const interval = setInterval(() => {
      if (!this.playing || !this.ctx || Math.random() > 0.45) return;
      try {
        const time = this.ctx.currentTime;
        const birdOsc = this.ctx.createOscillator();
        const birdGain = this.ctx.createGain();
        
        birdOsc.type = 'sine';
        birdOsc.frequency.setValueAtTime(1800 + Math.random() * 1200, time);
        // Chirp sweeping frequency upwards
        birdOsc.frequency.exponentialRampToValueAtTime(2800 + Math.random() * 1000, time + 0.12);
        
        birdGain.gain.setValueAtTime(0.0, time);
        birdGain.gain.linearRampToValueAtTime(0.06, time + 0.02);
        birdGain.gain.exponentialRampToValueAtTime(0.0001, time + 0.15);
        
        birdOsc.connect(birdGain);
        birdGain.connect(ambientGainNode);
        birdOsc.start();
        birdOsc.stop(time + 0.2);
      } catch (e) {}
    }, 2800);
    this.noiseNodes['forest_timer'] = interval;
  }

  public setAmbientVolume(type: AmbientSoundType, volume: number) {
    // Volume: 0.0 to 1.0
    const gainNode = this.ambientGains[type];
    if (gainNode && this.ctx) {
      const dbVol = Math.max(0, Math.min(1.0, volume));
      gainNode.gain.linearRampToValueAtTime(dbVol * 0.16, this.ctx.currentTime + 0.5);
    }
  }

  // Continuously schedules techno events using high precision clocks!
  private scheduler() {
    if (!this.ctx) return;
    
    // Guard: if nextNoteTime has fallen far behind the actual currentTime, catch up immediately to avoid infinite/huge loops
    if (this.nextNoteTime < this.ctx.currentTime) {
      this.nextNoteTime = this.ctx.currentTime + 0.02;
    }

    while (this.nextNoteTime < this.ctx.currentTime + 0.1) {
      this.schedulePlayStep(this.currentStep, this.nextNoteTime);
      this.advanceStep();
    }
  }

  private advanceStep() {
    if (!this.ctx) return;
    const secondsPerBeat = 60.0 / this.bpm;
    const stepsInBeat = 4; // 16th notes scheduling grids
    this.nextNoteTime += secondsPerBeat / stepsInBeat;

    this.currentStep = (this.currentStep + 1) % 16;
  }

  private schedulePlayStep(step: number, time: number) {
    if (!this.ctx || !this.masterGain) return;

    // Avoid double scheduling
    if (step === this.lastScheduledStep) return;
    this.lastScheduledStep = step;

    // Ensure we trigger sounds suitable to current mode configuration
    // TECHNO DRUM KICK
    // On step 0, 4, 8, 12, standard deep techno house four-on-the-floor
    if (step === 0 || step === 4 || step === 8 || step === 12) {
      if (this.intensity >= 2) {
        this.triggerKick(time);
      }
    }

    // ORGANIC GENTLE HI-HAT Percussion
    // Play on step 2, 6, 10, 14 or randomized patterns based on energy
    if (step === 2 || step === 6 || step === 10 || step === 14) {
      if (this.intensity >= 4) {
        this.triggerHihat(time);
      }
    }

    // Play subtle ride/openhats on step 4 or 12 if active
    if (step === 4 || step === 12) {
      if (this.intensity >= 6) {
        this.triggerOpenHat(time);
      }
    }

    // TECHNO BASS / DUB SYNTH LINE
    // Plays deep organic melodies based on current chord progressions!
    const bassSteps = [0, 2, 3, 6, 8, 10, 11, 14];
    if (bassSteps.includes(step)) {
      if (Math.random() < 0.7 + (this.intensity * 0.03)) {
        this.triggerTechnoBass(step, time);
      }
    }

    // ATMOSPHERIC CHORDS AND PADS
    // Change chords every 16 steps (on step 0) or slow evolving shifts
    if (step === 0) {
      this.currentChordIndex = (this.currentChordIndex + 1) % this.chordProgression.length;
      this.triggerAmbientChords(time);
    }
  }

  // Synthesis module - 1: Cyberpunk Deep Sub Kick
  private triggerKick(time: number) {
    if (!this.ctx || !this.masterGain) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.connect(gain);
    gain.connect(this.musicGainNode ?? this.masterGain);

    osc.type = 'sine';
    
    // Low frequency kick body sweep (from 150Hz decaying super fast down to 45Hz sub)
    const baseKickFreq = 42 + (this.bassDepth * 2); // Boost bass based on user sliders
    osc.frequency.setValueAtTime(130, time);
    osc.frequency.exponentialRampToValueAtTime(baseKickFreq, time + 0.12);

    // Smooth envelope setting (soft but punchy)
    gain.gain.setValueAtTime(0.0, time);
    gain.gain.linearRampToValueAtTime(0.45, time + 0.004);
    gain.gain.exponentialRampToValueAtTime(0.0001, time + 0.32);

    try {
      osc.start(time);
      osc.stop(time + 0.35);
    } catch (e) {}
  }

  // Synthesis module - 2: Shimmering Hihat
  private triggerHihat(time: number) {
    if (!this.ctx || !this.masterGain) return;

    // Synthesize hihats from filtered white noise! High bands
    const bufferSize = this.ctx.sampleRate * 0.1; // short split
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
       data[i] = Math.random() * 2 - 1;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(8000, time);
    filter.Q.setValueAtTime(7, time);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.0, time);
    gain.gain.linearRampToValueAtTime(0.08, time + 0.002);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.06);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.musicGainNode ?? this.masterGain);

    try {
      noise.start(time);
      noise.stop(time + 0.08);
    } catch (e) {}
  }

  // Synthesis module - 3: Open ride / cyber metallic sound
  private triggerOpenHat(time: number) {
    if (!this.ctx || !this.masterGain) return;

    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const bandpass = this.ctx.createBiquadFilter();
    const gain = this.ctx.createGain();

    osc1.type = 'sawtooth';
    osc2.type = 'triangle';
    osc1.frequency.setValueAtTime(6500, time);
    osc2.frequency.setValueAtTime(8500, time);

    bandpass.type = 'bandpass';
    bandpass.frequency.setValueAtTime(11000, time);
    bandpass.Q.setValueAtTime(10, time);

    gain.gain.setValueAtTime(0.0, time);
    gain.gain.linearRampToValueAtTime(0.03, time + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.2);

    osc1.connect(bandpass);
    osc2.connect(bandpass);
    bandpass.connect(gain);
    gain.connect(this.musicGainNode ?? this.masterGain);

    try {
      osc1.start(time);
      osc2.start(time);
      osc1.stop(time + 0.22);
      osc2.stop(time + 0.22);
    } catch (e) {}
  }

  // Synthesis module - 4: Melodic Dub Techno Bass Line
  private triggerTechnoBass(step: number, time: number) {
    if (!this.ctx || !this.masterGain) return;

    // Choose base note from current chord root
    const currentChordNotes = this.chordProgression[this.currentChordIndex];
    const rootMidi = currentChordNotes[0]; // standard root
    const transposer = step % 3 === 0 ? 0 : step % 4 === 1 ? 7 : 3; // custom arpeggiator intervals
    const bassMidi = rootMidi - 24 + transposer; // transpose down 2 octaves

    // MIDI to Frequency conversion
    const hz = Math.pow(2, (bassMidi - 69) / 12) * 440;

    const osc = this.ctx.createOscillator();
    const filter = this.ctx.createBiquadFilter();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(hz, time);

    filter.type = 'lowpass';
    // Modulate filter cutoff depending on track intensity and bassDepth setting
    const baseCutoff = 100 + (this.bassDepth * 35) + (this.intensity * 20);
    filter.frequency.setValueAtTime(baseCutoff, time);
    // Envelope modulation sweep on filter sweep
    filter.frequency.exponentialRampToValueAtTime(baseCutoff * 2.2, time + 0.05);
    filter.frequency.exponentialRampToValueAtTime(baseCutoff, time + 0.18);
    filter.Q.setValueAtTime(4.0, time);

    // Warm organic amplitude envelope
    gain.gain.setValueAtTime(0.0, time);
    gain.gain.linearRampToValueAtTime(0.18 + (this.intensity * 0.01), time + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, time + 0.25);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.musicGainNode ?? this.masterGain);

    try {
      osc.start(time);
      osc.stop(time + 0.28);
    } catch (e) {}
  }

  // Synthesis module - 5: Shimmering Cosmic Delays Chord Stabs
  private triggerAmbientChords(time: number) {
    if (!this.ctx || !this.masterGain) return;

    const currentChordNotes = this.chordProgression[this.currentChordIndex];
    
    // We synthesize polyphonically! Spawn multiple oscillators for each midi note in chord
    const voices: { osc: OscillatorNode; gain: GainNode }[] = [];
    
    // Dynamic delay routing for echoey ambient chords
    const delayNode = this.ctx.createDelay(1.5);
    const feedback = this.ctx.createGain();
    
    // 0.4s to 0.8s sync delay
    const delayTimeSeconds = (60.0 / this.bpm) * 1.5; // dotted chords
    delayNode.delayTime.setValueAtTime(delayTimeSeconds, time);
    feedback.gain.setValueAtTime(0.45, time); // Echo repetitions volume decay

    // Connect feedback path
    delayNode.connect(feedback);
    feedback.connect(delayNode);

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    // Warm retro filters (around 650Hz to 1200Hz)
    filter.frequency.setValueAtTime(800, time);
    filter.frequency.exponentialRampToValueAtTime(1400, time + 0.2);
    filter.frequency.exponentialRampToValueAtTime(850, time + 2.0);
    filter.Q.setValueAtTime(1.5, time);

    // Connect chord bus
    filter.connect(this.musicGainNode ?? this.masterGain);
    filter.connect(delayNode);
    delayNode.connect(this.musicGainNode ?? this.masterGain);

    currentChordNotes.forEach((midi, index) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const voiceGain = this.ctx.createGain();

      // Transpose notes to a beautiful high register octave (octave 4/5)
      const playNote = midi + 12;
      const hz = Math.pow(2, (playNote - 69) / 12) * 440;

      // Select oscillating shape depending on preset
      if (this.synthPreset === 'plucky') {
        osc.type = 'triangle';
      } else if (this.synthPreset === 'cosmic') {
        osc.type = 'sine';
      } else if (this.synthPreset === 'deep-drone') {
        osc.type = 'sawtooth';
      } else {
        osc.type = 'sawtooth'; // warm pad mix
      }

      osc.frequency.setValueAtTime(hz, time);
      // Give very subtle micro-detuning per voice for a thick choral effect!
      osc.detune.setValueAtTime((index - 1.5) * 6, time);

      // Volume envelope
      voiceGain.gain.setValueAtTime(0.0, time);
      voiceGain.gain.linearRampToValueAtTime(0.045, time + 0.15);
      voiceGain.gain.exponentialRampToValueAtTime(0.0001, time + 2.8);

      osc.connect(voiceGain);
      voiceGain.connect(filter);

      try {
        osc.start(time);
        osc.stop(time + 3.0);
      } catch (e) {}
    });
  }

  // Primary controls for starting/stopping the radio synthesized timeline
  public start() {
    this.init();
    if (this.playing || !this.ctx) return;

    // Resume AudioContext if suspended (browser interaction block)
    if (this.ctx.state === 'suspended') {
      try {
        this.ctx.resume();
      } catch (e) {
        console.error("Failed to resume AudioContext", e);
      }
    }

    // Set master gain back to 0.7 when starting!
    if (this.masterGain) {
      try {
        this.masterGain.gain.setValueAtTime(0.0, this.ctx.currentTime);
        this.masterGain.gain.linearRampToValueAtTime(0.7, this.ctx.currentTime + 0.15);
      } catch (e) {
        try {
          this.masterGain.gain.setValueAtTime(0.7, this.ctx.currentTime);
        } catch (err) {}
      }
    }

    this.playing = true;
    this.currentStep = 0;
    this.nextNoteTime = this.ctx.currentTime + 0.05;

    // Start scheduler loop
    this.schedulerTimer = setInterval(() => {
      try {
        this.scheduler();
      } catch (e) {
        console.error("Error in scheduler loop", e);
      }
    }, 25);

    // Trigger immediate chord to build atmospheric ambience
    try {
      this.triggerAmbientChords(this.ctx.currentTime);
    } catch (e) {
      console.error("Error triggering ambient chords", e);
    }
  }

  public stop() {
    this.playing = false;
    if (this.schedulerTimer) {
      clearInterval(this.schedulerTimer);
      this.schedulerTimer = null;
    }

    // Decay master volume so that audio notes don't experience clipping clicks upon suspension
    if (this.ctx && this.masterGain) {
      try {
        this.masterGain.gain.setValueAtTime(this.masterGain.gain.value, this.ctx.currentTime);
        this.masterGain.gain.linearRampToValueAtTime(0.0, this.ctx.currentTime + 0.1);
      } catch (e) {
        try {
          this.masterGain.gain.setValueAtTime(0.0, this.ctx.currentTime);
        } catch (err) {}
      }
      setTimeout(() => {
        if (!this.playing && this.ctx && this.ctx.state === 'running') {
          try {
            this.ctx.suspend();
          } catch (e) {
            console.error("Failed to suspend AudioContext on stop", e);
          }
        }
      }, 120);
    }
  }

  public resume() {
    if (this.ctx && this.ctx.state === 'suspended') {
      try {
        this.ctx.resume();
      } catch (e) {
        console.error("Failed to resume AudioContext structure", e);
      }
    }
    this.start();
  }

  public isPlaying() {
    return this.playing;
  }

  public getAnalyser() {
    return this.analyser;
  }
}

// Singleton global reference so audio scheduling tracks seamlessly across React mounts/unmounts
export const globalAudioEngine = new AudioEngine();
