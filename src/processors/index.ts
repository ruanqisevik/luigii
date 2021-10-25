import Loader from "./loader"
import Node from "./node"
import Pipeline from "./pipeline"
import { CUSTOMIZED_PROCESSORS } from '../static'


function getProcossers(ctx: any): {[key: string]: any} {
	const customizedProcessors = ctx[CUSTOMIZED_PROCESSORS]
	return {
		loader: Loader,
		node: Node,
		pipeline: Pipeline,
		...customizedProcessors
	}
}

export default getProcossers