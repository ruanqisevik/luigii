import Processor from './processor'
import Spec from './spec'
import { CUSTOMIZED_PROCESSORS } from './static'
import { ActuatorError } from './error'

interface ActuatorOptions {
	ctx: any;
	input: any;
	configPath: string;
	processors: { [key: string]: any }
}

export default class Actuator {
	spec: Spec
	options: Partial<ActuatorOptions>;

	constructor(spec: Spec, options?: object) {
		this.spec = spec
		this.options = options || {}
	}

	public async perform() {
		const { ctx, input, processors } = this.options
		processors && this.registerProcessors(processors)

		const processor = this.spec.processor(ctx)
		if (!processor.execute) {
			throw new ActuatorError(`处理器 ${processor.name} 没有声明 execute 方法`)
		}
		return await this.excuteProcessor(processor, ctx || {}, input)
	}

	public async registerProcessors(processors: { [key: string]: any }) {
		const { ctx } = this.options
		if (!ctx) {
			return
		}
		ctx[CUSTOMIZED_PROCESSORS] = processors
	}

	private async excuteProcessor(processor: Processor, context: any, input: any) {
		return await processor.execute(context, input)
	}
}