# bmfont-loader

A webpack loader for inlining JSON formatted bmfonts.

The JSON data is internally packed into a slightly smaller format and unpacked on the client.

## Installation
```
yarn add --dev @downpourdigital/bmfont-loader
``` 
```
npm i --dev @downpourdigital/bmfont-loader
```

## Usage
**webpack.config.js**

```javascript
module.exports = {
	module: {
		rules: [
			{
				test: /\.(bmfont)$/,
				loader: '@downpourdigital/bmfont-loader',
			},
		],
	},
};

```

**file.js**

```typescript
import TestFont from 'TestFont-Regular.bmfont';

TestFont.font; // the actual bmfont data
TestFont.metrics; // some metrics
```

## Metrics

Some additional metrics are exported: 

```typescript
{
	capHeight: number;
	xHeight: number;
	ascenderHeight: number;
	descenderHeight: number;
}
```
All metrics are relative to font size 1.

If you only want to export metrics and omit the actual bmfont data, add `?metricsOnly` to the end of your import statement, i.e.

```typescript
import TestFont from 'TestFont-Regular.bmfont?metricsOnly';

TestFont.font; // undefined
TestFont.metrics; // some metrics
```

## Typescript

`bmfont-loader` comes with type declarations for your imported fonts.
To include them, add the folowing to your `tsconfig.json`:

```javascript
{
	"include" : [
		// ...
		"./node_modules/@downpourdigital/bmfont-loader/dist/import.d.ts"
	]
}
```
Now, all imports ending in `.bmfont` will appear properly typed.

### License
© 2019 [DOWNPOUR DIGITAL](https://downpour.digital), licensed under BSD-4-Clause