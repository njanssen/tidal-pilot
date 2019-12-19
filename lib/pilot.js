const udp = require('dgram')
const midi = require('@tonaljs/midi')

const PILOT_ADDRESS = '127.0.0.1'
const PILOT_PORT = 49161

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

module.exports = {
	sendCommand : sendCommand,
	midiNoteToPilotNote : midiNoteToPilotNote
}
