const osc = require('osc')
const _ = require('lodash')
const EventEmitter = require('events')
const tidalEmitter = new EventEmitter()

const TIDALCYCLES_LISTEN_ADDRESS = '127.0.0.1'
const TIDALCYCLES_LISTEN_PORT = 9000

let settings = {
	cps : 0.5,
	bpc : 4
}

const oscPort = new osc.UDPPort({
	localAddress: TIDALCYCLES_LISTEN_ADDRESS,
	localPort: TIDALCYCLES_LISTEN_PORT,
	broadcast: false,
	metadata: true
})

oscPort.open()

oscPort.on('ready', () => {
	console.log(
		`Listening for TidalCycles messages on ${TIDALCYCLES_LISTEN_ADDRESS}:${TIDALCYCLES_LISTEN_PORT}`
	)
})

oscPort.on('bundle', (oscBundle, timeTag, info) => {
	// Extract data from TidalCycles OSC bundle
	_.forEach(oscBundle.packets, (oscMessage, index, arr) => {
		const address = oscMessage.address
		const args = oscMessage.args

		if (_.startsWith(address, '/play2')) {
			let message = {}
			for (var i = 0; i < args.length; i += 2) {
				message[args[i].value] = args[i + 1].value
			}

			// Derive octave number (octave) with a default of 5 (standard in Tidal/SuperCollider)
			const octave = (typeof message.octave === 'undefined') ? 5 : message.octave

			// Derive note number (n or note) with a default of 0 (middle C on octave 5)
			const n = message.n || message.note || 0

			// Derive MIDI note number using n and octave
			// Notes assume middle C on octave 5 (TidalCycles/SuperCollider) instead of octave 4 (MIDI standard), so we add one octave
			const midinote = n + (octave + 1) * 12

			// Add derived data to the Tidal message
			message.octave = octave
			message.n = n
			message.midinote = midinote

			setTimeout(() => {
				// Emit event on requested time of execution
				tidalEmitter.emit('message', message)
			}, message.delta * 1000)
		}
	})
})

const cpsToBpm = () => { 
	return Math.round(settings.cps * 60 * settings.bpc)	
}

module.exports = {
	events : tidalEmitter,
	settings : settings,
	cpsToBpm : cpsToBpm
}
