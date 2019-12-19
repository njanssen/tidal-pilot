require('module-alias/register')
const tidal = require('@lib/tidal')
const pilot = require('@lib/pilot')
const _ = require('lodash')

tidal.on('message', message => {
	//console.log('Tidal message', message)
	let commands = []

	// Tidal sound/note translates to Pilot note
	if (message.s) {
		const channel = message.s.toUpperCase()
		const midinote = message.midinote		
		const note = pilot.midiNoteToPilotNote(midinote)
		const velocity = (typeof message.velocity === 'undefined') ? 1 : message.velocity
		const vel = pilot.floatToPilotArg(parseFloat(velocity), 0, 1)
		// TODO Note length
		const command = `${channel}${note}${vel}`
		commands.push(command)
	}

	const strCommands = commands.join(';')
	console.log('Pilot commands:', strCommands)
	pilot.sendCommand(strCommands)
})

