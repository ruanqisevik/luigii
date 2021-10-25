import path from 'path'
import fs from 'fs'
import https from 'https'
import { URL } from 'url'
import yaml from 'js-yaml'
import Processor from '../processor'
import Spec, { SpecOptions } from '../spec'
import { ProcessorError } from '../error'

export default class Loader extends Processor {
	name: string;
	type: string;
	uri: string;

	constructor(options: SpecOptions) {
		super()
		const { name, data } = options || {}
		const { type, uri } = data || {}
		this.name = name
		if (!type || !uri) {
			throw new ProcessorError(`loader(${name}) 初始化失败, type 或 uri 参数为空, options: ${options}`)
		}
		this.type = type
		this.uri = uri
	}
	
	async execute(ctx: any, input?: any): Promise<any> {
		let spec: Spec | null = null
		if (this.type === 'url') {
			spec = await this.getRemoteSpec(this.uri)
		} else if (this.type === 'path') {
			spec = this.getLocalSpec(this.uri)
		}

		const processor = spec?.processor(ctx)
		return await processor?.execute(ctx, input)
	}      

		// 获取远端配置
	async getRemoteSpec(uri: string): Promise<Spec | null> {
		// 远程资源
		try {
			const configPath = './config'
			const specUrl = new URL(uri).toString()
			const specFile = await this.getRemoteFile(specUrl, fs.createWriteStream(this.resolve(configPath)))
			const spec = new Spec(this.parse(specFile, this.extname(uri)))
			return spec
		} catch (error) {
			throw new ProcessorError(`loader(${name}) 加载失败, url: ${uri}, error: ${error}`)
		}
	}

	getLocalSpec(uri: string): Spec | null {
		if (fs.existsSync(uri)) {
			const specFile = fs.readFileSync(this.resolve(uri), 'utf-8')
			//TODO yaml 文件解析
			const spec = new Spec(this.parse(specFile, this.extname(uri)))
			return spec
		} else {
			throw new ProcessorError(`loader(${name}) 加载失败, url: ${uri}`)
		}
	}

	private resolve(src: string) {
		return path.resolve(__dirname, src)
	}

	private extname(src: string) {
		return path.extname(src)
	}

	private parse(file: string, extname: string) {
		if (extname === '.yaml' || extname === '.yml') {
			try {
				const parsed = yaml.load(file)
				// todo 补充完备信息
				return parsed
			} catch (error) {
				return null    
			}
		} else if (extname === '.json') {
			try {
				return JSON.parse(file)
			} catch (error) {
				return null
			}
		} else {
			return null
		}
	}

	// TODO 如何考虑缓存问题, 对于远端配置是否需要落地为本地文件
	async getRemoteFile(url: string, file: fs.WriteStream) {
		return new Promise<string>((resolve, reject) => {
			https.get(url, response => {
				var stream = response.pipe(file);
				stream.on("finish", function() {
					try {
						const remoteConfig =  fs.readFileSync(file.path, 'utf-8')
						resolve(remoteConfig)
					} catch (error) {
						reject()
					}
				});
			}).on('error', (e) => {
				reject(e.message)
			});
		})
	}
}

