import { SpecError } from './error'
import Processor from './processor'
import getProcossers from './processors'

export interface SpecOptions {
	name: string;
	processor: string;
	data: any;
}

class Spec {
	options: SpecOptions

	constructor(options: SpecOptions) {
		this.options = options
	}

	processor(ctx: any): Processor {
		const { processor: processorName } = this.options || {}
		const processors = getProcossers(ctx)
		const processor = new processors[processorName](this.options)
		if (!processor) {
			throw new SpecError(`从配置初始化处理器失败, spec: ${this.options}`)
		}
		return processor		
	}
}

export default Spec