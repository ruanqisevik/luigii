class ActuatorError extends Error {
	constructor(message: string) {
		super()
		this.name = 'ActuatorError'
		this.message = message 
	}
}

class SpecError extends Error {
	constructor(message: string) {
		super()
		this.name = 'SpecError'
		this.message = message 
	}	
}

class ProcessorError extends Error {
	constructor(message: string) {
		super()
		this.name = 'ProcessorError'
		this.message = message
	}	
}

export {
	ActuatorError,
	SpecError,
	ProcessorError,
}