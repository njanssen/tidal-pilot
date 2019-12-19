require('module-alias/register')
const tidal = require('@lib/tidal')
const pilot = require('@lib/pilot')
const _ = require('lodash')

tidal.on('message', message => {
	let commands = []

	// Tidal sound/note translates to Pilot note
	if (message.s) {
		const channel = message.s.toUpperCase()
		const midinote = message.midinote 
		const note = pilot.midiNoteToPilotNote(midinote)
		const command = `${channel}${note}`
		commands.push(command)
	}

	const strCommands = commands.join(';')
	console.log('Pilot commands:', strCommands)
	pilot.sendCommand(strCommands)
})
