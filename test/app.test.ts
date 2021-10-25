import Actuator from '../src/actuator'
import Spec from '../src/spec'
// import requireDir from 'require-dir'
import serviceNode from './addProcessors/serviceNode'

async function main() {
	// const dir = requireDir('../../egg-fund/app/service')
	// const spec = new Spec({
	// 	"name": "二阶段推荐",
	// 	"processor": "loader",
	// 	"data": {
	// 		"type": "url",
	// 		"uri": "https://gw.alipayobjects.com/os/antfincdn/fXfy0Hsiq/test.json"
	// 	}
	// })
	const spec = new Spec({
		"processor": "pipeline",
		"data": [
			{
				"processor": "serviceNode",
				"data": "test",
			}
		],
		"name": "测试"
	})
	const ac = new Actuator(spec, {
		ctx: {
			service: {
				// test: (input: any) => {
				// 	return {
				// 		success: true,
				// 		result: input
				// 	}
				// }
				test: () => {
					throw 'service error'
				}
 			}
		},
		input: '5',
		processors: {
			serviceNode
		}
	})

	try {
		const result = await ac.perform()
		console.log(result)
	} catch (error) {
		console.log(error)	
	}
	
}

main()