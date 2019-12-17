const udp = require('dgram')
const osc = require('osc')
const _ = require('lodash')
const midi = require('@tonaljs/midi')

const TIDALCYCLES_LISTEN_ADDRESS = '127.0.0.1'
const TIDALCYCLES_LISTEN_PORT = 9000
const PILOT_ADDRESS = '127.0.0.1'
const PILOT_PORT = 49161

const socket = udp.createSocket('udp4')
const udpSendPilotCommand = command => {
	const packet = Buffer.from(command)
	const len = packet.length

	socket.send(packet, 0, len, PILOT_PORT, PILOT_ADDRESS)
}

const oscPort = new osc.UDPPort({
	localAddress: TIDALCYCLES_LISTEN_ADDRESS,
	localPort: TIDALCYCLES_LISTEN_PORT,
	broadcast: false,
	metadata: true
})

oscPort.open()

oscPort.on('ready', () => {
	console.log(`Listening for TidalCycles messages on ${TIDALCYCLES_LISTEN_ADDRESS}:${TIDALCYCLES_LISTEN_PORT}`)
})

oscPort.on('bundle', (oscBundle, timeTag, info) => {
	// Extract data from TidalCycles
	_.forEach(oscBundle.packets, (oscMessage, index, arr) => {
		const address = oscMessage.address
		const args = oscMessage.args
		const type = getOscTypeTag(args)

		// Handle IMU data
		if (_.startsWith(address, '/play2')) {
			let message = {}
			for (var i = 0; i < args.length; i += 2) {
				message[args[i].value] = args[i + 1].value
			}			

			setTimeout(() => {
				console.log('Tidal message:', message)
				const channel = message.s
				const n = message.n || 0
				const midinote = n + 60
				const notename = midiNoteToPilotNote(midinote)
				const command = `${channel}${notename}`
				console.log('Pilot command:', command)
				udpSendPilotCommand(command)
			}, message.delta * 1000)
		}
	})
})

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

const getOscTypeTag = args => {
	let type = ''
	const len = args.length
	for (let i = 0; i < len; i++) {
		const arg = args[i]
		type += arg.type
	}
	return type
}
