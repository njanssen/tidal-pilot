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

Using `s`, `n` (or `midinote`), and `octave` to send Play commands to Pilot: 

```
-- Play command: 05C (channel 0, note C5)
d1 $ s "0" 

-- Play command: B3C (channel B, note C5)
d1 $ s "b" # n "c3"
-- or 
d1 $ s "b" # n "c" # octave 3
-- or 
d1 $ s "b" # n "0" # octave 3

-- Play command: 94e (channel 9, note E#4)
d1 $ s "9" # n "es4"
```

Use `velocity` parameter to control the velocity in your Play command:

```
-- Play command: 74e (channel 7, note E2, velocity 8)
d1 $ s "7" # n "e2" # velocity 0.5

-- Play command: 74e (channel 7, note E2, velocity F)
d1 $ s "7" # n "e2" # velocity 1
```

And yes, you can pattern those parameters! For more examples, see the `tidal` folder of this repository.

Effects are not supported by tidal-pilot yet, you can type these commands (e.g. `REV10` for some reverb) manually in the Pilot window.