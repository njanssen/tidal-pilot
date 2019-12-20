# tidal-pilot

Some OSC/UDP glue written in Javascript/Node.js for using Hundred Rabbit's Pilot synth with TidalCycles.

## Instructions

### Install Pilot

TidalCycles is typically used together with SuperCollider. This app forwards TidalCycles OSC messages to Hundred Rabbit's [Pilot](https://github.com/hundredrabbits/Pilot) UDP synthetizer. To install Pilot, following the instructions in the README of its [GitHub repository](https://github.com/hundredrabbits/Pilot) or download a pre-built version of the Electron app [here](https://hundredrabbits.itch.io/pilot).

### Install TidalCycles

This app uses TidalCycles for live-coding patterns. Install your local TidalCycles environment by following the instructions found in the [TidalCycles documentation](https://tidalcycles.org/index.php/Installation).

### Install and run tidal-pilot

This repository contains a Node.js app that acts as glue between TidalCycles and Pilot. To run the app, follow these steps:

```
npm install
npm start
```

The app listens for TidalCycles OSC messages on UDP port 9000.

### Start live-coding

Create or open a `.tidal` file in your editor with TidalCycles support (e.g. VSCode or Atom), and start live-coding patterns with Pilot. Make sure to use the `BootTidal.hs` in this repo, or add a `superDirtTarget` that uses port 9000 in your own boot file. 

#### Play commands

Use the parameters `s`, `n`, and `octave` to send Play commands to Pilot: 

```
-- Play command: 05C (channel 0, note C5)
d1 $ s "0" 

-- Play command: B3C (channel B, note C5)
d1 $ s "b" # n "c3"
-- or 
d1 $ s "b" # n "c" # octave 3
-- or 
d1 $ s "b" # n "0" # octave 3

-- Play command: E4e (channel E, note E#4)
d1 $ s "e" # n "es4"
```

Optionally use the parameter `velocity` (`0 .. 1`) to control the velocity in your Play command (`0 .. F`):

```
-- Play command: 74G8 (channel 7, note G4, velocity 8)
d1 $ s "7" # n "g4" # velocity 0.5

-- Play command: A5CF (channel 7, note G4, velocity F)
d1 $ s "a" # n "c5" # velocity 1
```

And yes, you can pattern all those parameters! For more examples, see the `tidal` folder of this repository.

#### Global Settings

Use the `setcps` function and the parameter `cps` to control the global BPM setting in Pilot which is applied to effects such as feedback. As a default, tidal-pilot uses 4 beats per cycle (bpc) when calculating BPM (`bpm = cps/60/bpc`). Use the parameter `bpc` to set another value for beats per cycle in the BPM calculations performed by tidal-pilot:

```
-- Global command: BPM120
setcps 0.5
-- or 
setcps (120/60/4)

-- Global and Play command: BPM120;A5C followed by BPM180;A5C
d1 $ s "a*2" # cps "0.5 0.75"

-- Global command: BPM90 (setting bpc to 3)
once $ cps 0.5 # bpc 3

-- Global and Play command: BPM90;A5C followed by BPM135;A3CF (setting bpc to 3)
d1 $ s "a*2" # cps "0.75 0.5" # bpc 3
```

#### Effects

Effects are not supported by tidal-pilot yet, you can type these commands (e.g. `REV10` for some reverb) manually in the Pilot window.