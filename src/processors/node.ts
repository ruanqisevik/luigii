import { SpecOptions } from '../spec'
import Processor from '../processor'
import { ProcessorError } from '../error'

export {
	SpecOptions as NodeOptions
}

export default abstract class Node extends Processor {
	options: SpecOptions;

	constructor(options: SpecOptions) {
		super()
		this.options = options
	}

	execute(ctx: any, input: any): any {
		const preprocessedInput = this.beforeExecute(input)
		const output = this.run(ctx, preprocessedInput)
		const postProcessedOutput = this.afterExecute(output)
		
		return postProcessedOutput
	}

	beforeExecute(input: any): any {
		const valid = this._inputValidation(input)
		if (!valid) {
			const nodeInfo = {
				name: this.name,
				errorMsg: 'input validation failed'
			}
			throw new ProcessorError(JSON.stringify(nodeInfo))
		}
		return input
	}

	afterExecute(output: any): any {
		const valid = this._inputValidation(output)
		if (!valid) {
			const nodeInfo = {
				name: this.name,
				errorMsg: 'ouput validation failed'
			}
			throw new ProcessorError(JSON.stringify(nodeInfo))
		}
		return output
	}

	abstract run(ctx: any, input: any): any
	protected abstract _inputValidation(input: any): boolean;
	protected abstract _outputValidation(output: any): boolean;
}