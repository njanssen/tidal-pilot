const udp = require('dgram')
const midi = require('@tonaljs/midi')

const PILOT_ADDRESS = '127.0.0.1'
const PILOT_PORT = 49161
const PILOT_ARGS = [
	'0',
	'1',
	'2',
	'3',
	'4',
	'5',
	'6',
	'7',
	'8',
	'9',
	'A',
	'B',
	'C',
	'D',
	'E',
	'F'
]

const socket = udp.createSocket('udp4')

const sendCommand = command => {
	const packet = Buffer.from(command)
	const len = packet.length

	//console.log('Pilot command:', command)
	socket.send(packet, 0, len, PILOT_PORT, PILOT_ADDRESS)
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

const scale = (num, in_min, in_max, out_min, out_max) => {
	return ((num - in_min) * (out_max - out_min)) / (in_max - in_min) + out_min
}

const floatToPilotArg = (f, fmin, fmax) => {
	const pilotMin = 0
	const pilotMax = 15

	const pilotIdx = Math.round(scale(f, fmin, fmax, pilotMin, pilotMax))
	const pilotArg = PILOT_ARGS[pilotIdx]

	return pilotArg
}

module.exports = {
	sendCommand: sendCommand,
	midiNoteToPilotNote: midiNoteToPilotNote,
	floatToPilotArg: floatToPilotArg
}
