import { BackgroundTransformer } from "./backgroundTransformer";
import { ClassTransformer } from "./classTransformer";
import { StyleTransformer } from "./styleTransformer";

export interface AttributeTransformer {

	transform(element: Properties): void;
}

export abstract class Properties {
	private transformer: AttributeTransformers;

	private style: Map<string, string>;
	private class: Set<string>;
	private attributes: Map<string, string>;

	public addClass(name: string): Properties {
		this.class.add(name);
		return this;
	}

	public deleteClass(name: string): Properties {
		this.class.delete(name);
		return this;
	}

	public hasClass(name: string): boolean {
		return this.class.has(name);
	}

	public addStyle(key: string, value: string): Properties {
		this.style.set(key, value);
		return this;
	}

	public deleteStyle(key: string): Properties {
		this.style.delete(key);
		return this;
	}

	public hasStyle(name: string): boolean {
		return this.style.has(name);
	}

	public addAttribute(key: string, value: string): Properties {
		this.attributes.set(key, value);
		this.transformer.transform(this);
		return this;
	}

	public deleteAttribute(key: string): Properties {
		this.attributes.delete(key);
		return this;
	}

	public hasAttribute(name: string): boolean {
		return this.attributes.has(name);
	}

	public getAttribute(name: string): string {
		return this.attributes.get(name);
	}

	constructor(attributes: Map<string, string>) {
		this.style = new Map<string, string>();
		this.class = new Set<string>();
		this.attributes = attributes;

		this.transformer = new AttributeTransformers();
		this.transformer.transform(this);
	}

	public getClasses(): string {
		return Array.from(this.class).join(' ');
	}

	public getStyles(): string {

		const result = Array<string>();

		for (const [key, value] of this.style) {
			result.push(`${key}: ${value}`);
		}

		return result.join('; ');
	}

	public getAttributes(): string {

		const result = Array<string>();

		for (const [key, value] of this.attributes) {
			result.push(`${key}="${value}"`);
		}

		return result.join(' ');
	}

}

class AttributeTransformers {

	private allTransformers: Array<AttributeTransformer> = new Array<AttributeTransformer>();

	constructor() {
		this.allTransformers.push(new ClassTransformer());
		this.allTransformers.push(new StyleTransformer());
		this.allTransformers.push(new BackgroundTransformer());
	}

	transform(element: Properties) {

		for (let x = 0; x < this.allTransformers.length; x++) {
			const transformer = this.allTransformers[x];
			transformer.transform(element);
		}
	}
}
