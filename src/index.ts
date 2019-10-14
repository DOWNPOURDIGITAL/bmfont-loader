import { LayoutGenerator } from '@downpourdigital/bmfont-utils';
import BMFont from '@downpourdigital/bmfont-utils/dist/cjs/types/BMFont';
import { getCurrentRequest } from 'loader-utils';


interface PackedBMFont {
	common: any;
	info: any;
	kernings: number[][];
	chars: number[][];
}


export default function load( source: string ) {
	const callback = this.async();
	const json: BMFont = JSON.parse( source );
	let output = '';


	// only generate font output if ?metricsOnly flag isn't set

	if ( !/\?metricsOnly$/.test( getCurrentRequest( this ) ) ) {

		// create packed version of bmfont

		const out: PackedBMFont = {
			common: {
				lineHeight: json.common.lineHeight,
				base: json.common.base,
				scaleW: json.common.scaleW,
				scaleH: json.common.scaleH,
			},
			info: {
				size: json.info.size,
				charset: json.info.charset,
				stretchH: json.info.stretchH,
				padding: json.info.padding,
				spacing: json.info.spacing,
			},
			kernings: [],
			chars: json.chars.map( c => ([
				c.id,
				c.x,
				c.y,
				c.width,
				c.height,
				c.xoffset,
				c.yoffset,
				c.xadvance,
			]) ),
		};


		// add kernings for included chars

		const chars = json.chars.map( c => c.id );

		json.kernings.forEach( ( c ) => {
			if ( chars.includes( c.first ) && chars.includes( c.second ) ) {
				out.kernings.push([
					c.first,
					c.second,
					c.amount,
				]);
			}
		});


		// mark pages as dependencies

		const pages: string[] = [];

		json.pages.forEach( ( s ) => {
			this.addDependency( s );
			pages.push( `require("./${s}")` );
		});


		// add packed font and unpacker runtime to output

		output += `
			var o = ${JSON.stringify( out ).replace( /}$/, `,"pages":[${pages.join( ',' )}]}` )};
			o.chars = o.chars.map(function( c ) {
				return { id: c[0], x: c[1], y: c[2], width: c[3], height: c[4], xoffset: c[5], yoffset: c[6], xadvance: c[7] }
			});

			o.kernings = o.kernings.map(function( c ) {
				return { first: c[0], second: c[1], amount: c[2] };
			});

			module.exports.font = o;
		`;
	}


	// get metrics by parsing BMFont

	const generator = new LayoutGenerator( json );
	const metrics = {
		capHeight: generator.capHeight,
		xHeight: generator.xHeight,
		ascenderHeight: generator.ascenderHeight,
		descenderHeight: generator.descenderHeight,
	};

	output += `module.exports.metrics = ${JSON.stringify( metrics )};`;

	callback( null, output );
}
