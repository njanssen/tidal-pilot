const Tidal = require('@vliegwerk/tidal')
const Pilot = require('@vliegwerk/pilot')
const midi = require('@tonaljs/midi')
const _ = require('lodash')

const tidal = new Tidal({
	addMidiData: true
})

const pilot = new Pilot()

const settings = {
	cps: undefined,
	bpc: 2
}

tidal.on('ready', () => {
	console.log('Listening to messages from TidalCycles')
})

tidal.on('message', message => {
	let commands = []

	// Tidal bpc (beats per cycle) setting used to calculate BPM
	if (typeof message.bpc !== 'undefined') {
		settings.bpc = message.bpc
		console.log(`BPC setting: ${settings.bpc}`)
	}

	// Tidal cps (cycles per second) mapping to global BPM setting
	if (!_.isEqual(message.cps, settings.cps)) {
		settings.cps = message.cps
		console.log(`CPS setting: ${settings.cps}`)
		const bpm = cpsToBpm()
		const command = `BPM${bpm}`
		commands.push(command)
	}

	// Tidal sound/note mapping to Play Command
	if (typeof message.s !== 'undefined') {
		const channel = message.s.toUpperCase()
		const midinote = message.midinote
		const note = midiNoteToPilotNote(midinote)
		let vel = ''
		if (typeof message.velocity !== 'undefined') {
			vel = Pilot.scaleToArgs(parseFloat(message.velocity), 0, 1)
		}
		const command = `${channel}${note}${vel}`
		commands.push(command)
	}

	const strCommands = commands.join(';')
	console.log('Pilot commands:', strCommands)
	pilot.sendCmd(strCommands)
})

const cpsToBpm = () => {
	return Math.round(settings.cps * 60 * settings.bpc)
}

const midiNoteToPilotNote = note => {
	let notename = midi.midiToNoteName(note, { sharps: true })

	notename = notename
		.split('')
		.reverse()
		.join('')
	if (notename.includes('#')) {
		notename = notename.toLowerCase()
		notename = notename.replace('#', '')
	}

	return notename
}
