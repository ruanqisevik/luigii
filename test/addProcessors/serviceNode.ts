import Node, { NodeOptions } from '../../src/processors/node'

export default class ServiceNode extends Node {
	name: string;
	service: string;
	inputValidation: {
		(param: any): boolean
	};
	outputValidation: {
		(param: any): boolean
	};

	protected constructor(options: NodeOptions) {
		super(options)
		const { name, data } = options
		const {
			service,
			inputValidation = () => true,
			outputValidation = () => true	
		} = data || {}
		this.name = name
		this.service = (typeof data === 'string' ? data : service) || ''
		this.inputValidation = inputValidation
		this.outputValidation = outputValidation
	}

	run(ctx: any, input: any): any {
		const service = ctx.service[this.service]
		if (!service) {
			throw new Error(`serviceNode ${this.name}, 调用的 service: ctx.service.${this.service} 不存在`)
		}
		return service(input)
	}

	execute(ctx: any, input: any): any {
		const preprocessedInput = this.beforeExecute(input)
		const output = this.run(ctx, preprocessedInput)
		const postProcessedOutput = this.afterExecute(output)
		
		return postProcessedOutput
	}

	protected _inputValidation(input: any): boolean {
		return this.inputValidation(input)
	}

	protected _outputValidation(output: any): boolean {
		return this.outputValidation(output)
	}
}