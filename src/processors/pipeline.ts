// TODO 文档
import { ProcessorError } from '../error';
import Processor from '../processor'
import Logger from '../logger'
import Spec, { SpecOptions} from '../spec'

export default class Pipeline extends Processor {
	processors: SpecOptions[];
	name: string;

	constructor({
		name,
		data
	}: SpecOptions) {
		super()
		this.name = name
		this.processors = data
	}

	async execute(ctx: any, input: any): Promise<any> {
		const preprocessedInput = this.beforeExecute(input)

		if (!this.processors.length) {
			Logger.debug(`${this.name} processors is empty`)
			return preprocessedInput
		}
		const processors = this.processors.map((item, index) => {
			try {
				const spec = new Spec(item)
				return spec.processor(ctx)
			} catch (error) {
				const processorInfo = {
					name: item.name,
					pipeline: this.name,
					sn: index,
					errorMsg: error
				}
				throw new ProcessorError(`初始化 pipeline 节点失败, ${JSON.stringify(processorInfo)}`)
			}
		})

		const pipelineOutput = processors.reduce(async (pre, item, index) => {
			try {
				const outputOfProcessor = await item.execute(ctx, pre)
				// 当前 processor 的输出作为下一个 processor 的输入
				return outputOfProcessor
			} catch (error) {
				const processorInfo = {
					name: item.name,
					pipeline: this.name,
					sn: index,
					errorMsg: error
				}
				throw new ProcessorError(`执行 pipeline 节点失败${JSON.stringify(processorInfo)}`)
			}
		}, preprocessedInput)

		const postProcessedOutput = this.afterExecute(pipelineOutput)
		
		return postProcessedOutput
	}

	beforeExecute(input: any): any {
		return input
	}

	afterExecute(output: any): any {
		return output
	}
}