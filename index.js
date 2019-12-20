require('module-alias/register')
const tidal = require('@lib/tidal')
const pilot = require('@lib/pilot')
const _ = require('lodash')

tidal.events.on('message', message => {
	console.log('Tidal message', message)
	let commands = []

	// Tidal bpc (beats per cycle) used to calculate BPM setting
	if (typeof message.bpc !== 'undefined') { 
		tidal.settings.bpc = message.bpc
		console.log(`BPC setting: ${tidal.settings.bpc}`)
	}

	// Tidal cps (cycles per second) mapping to BPM setting
	if (!_.isEqual(message.cps,tidal.settings.cps)) { 
		tidal.settings.cps = message.cps
		console.log(`CPS setting: ${tidal.settings.cps}`)
		const bpm = tidal.cpsToBpm()
		const command = `BPM${bpm}`
		commands.push(command)
	}

	// Tidal sound/note mapping to Play Command
	if (message.s) {
		const channel = message.s.toUpperCase()
		const midinote = message.midinote		
		const note = pilot.midiNoteToPilotNote(midinote)
		let vel = ''
		if (typeof message.velocity !== 'undefined') {
			vel = pilot.floatToPilotArg(parseFloat(message.velocity), 0, 1)	
		}
		const command = `${channel}${note}${vel}`
		commands.push(command)
	}

	const strCommands = commands.join(';')
	console.log('Pilot commands:', strCommands)
	pilot.sendCommand(strCommands)
})

