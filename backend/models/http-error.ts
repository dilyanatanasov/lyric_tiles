export class HttpError extends Error {
	public code: any;
	constructor(message, errorCode) {
		super(message);
		this.code = errorCode;
	}
}