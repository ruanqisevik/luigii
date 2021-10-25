// TODO 补充文档

interface Execute {
	(ctx: any, input?: any): Promise<any>
}

interface BeforeExecute<T> {
	(input: T): T
}

interface AfterExecute<T> {
	(output: T): T
}

abstract class Processor {
	abstract name: string;
	abstract execute(ctx: any, input?: any): Promise<any>;
	beforeExecute?<T>(input: T): T;
	afterExecute?<T>(input: T): T;
}

export {
	Execute,
	BeforeExecute,
	AfterExecute
}

export default Processor 