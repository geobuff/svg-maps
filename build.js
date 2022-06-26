const fs = require('fs');
const path = require('path');
const svgson = require('svgson');

const jsFile = "./index.js";
const svgFolder = "./svgs";

const allowedTypes = ["path", "polygon", "polyline", "circle", "rect", "image", "defs", "line", "g"];

let build = {};

build.checkIndex = () => {
	if (fs.existsSync(jsFile)) {
		if (fs.existsSync(jsFile)) {
			try {
				fs.unlinkSync(jsFile);
			} catch (err) {
				console.error(err);
				return;
			}
		}
	}
};

build.convertToJs = (file) => {
	fs.readFile(`${svgFolder}/${file}`, 'utf8', (err, data) => {
		if (err) {
			console.error(`Unable to read file ${file}.`, err);
			return;
		}

		build.parse(data, file);
	});
}

build.parse = (data, file) => {
	svgson.parse(data)
		.then(json => {
			const svg = build.mapSVG(json);
			const js = `module.exports.${build.getClassName(file)} = ${JSON.stringify(svg)}\n\n`;
			build.appendToFile(js);
		})
		.catch(err => {
			console.error(`Unable to parse ${file}`, err);
		});
};

build.appendToFile = (js) => {
	fs.appendFile(jsFile, js, 'utf8', err => {
		if (err) {
			console.error(`Unable to write file ${jsFile}`, err);
			return;
		}
	});
}

const getChildProps = (x) => {
	const result = [];
	switch (x.name) {
		case "path":
			result.push({
				type: x.name,
				name: x.attributes.name,
				id: x.attributes.id,
				d: x.attributes.d,
			});
			break;
		case "polygon":
		case "polyline":
			result.push({
				type: x.name,
				name: x.attributes.name,
				id: x.attributes.id,
				points: x.attributes.points,
			});
			break;
		case "rect":
			result.push({
				type: x.name,
				name: x.attributes.name,
				id: x.attributes.id,
				x: x.attributes.x,
				y: x.attributes.y,
				width: x.attributes.width,
				height: x.attributes.height,
				transform: x.attributes.transform,
			});
			break;
		case "circle":
			result.push({
				type: x.name,
				name: x.attributes.name,
				id: x.attributes.id,
				cx: x.attributes.cx,
				cy: x.attributes.cy,
				r: x.attributes.r,
			});
			break;
		case "line":
			result.push({
				type: x.name,
				name: x.attributes.name,
				id: x.attributes.id,
				x1: x.attributes.x1,
				y1: x.attributes.y1,
				x2: x.attributes.x2,
				y2: x.attributes.y2,
			});
			break;
		case "image":
			result.push({
				type: x.name,
				name: x.attributes.name,
				id: x.attributes.id,
				width: x.attributes.width,
				height: x.attributes.height,
				transform: x.attributes.transform,
				xlinkHref: x.attributes["xlink:href"],
				clipPath: x.attributes["clip-path"],
			});
			break;
		case "defs":
			if(x.children.length !== 1 || x.children[0].children.length !== 1) {
				throw Error("Invalid format for <defs> element.");
			}

			result.push({
				type: x.name,
				name: x.attributes.name,
				id: x.attributes.id,
				clipPathId: x.children[0].attributes.id,
				width: x.children[0].children[0].attributes.width,
				height: x.children[0].children[0].attributes.height,
			});
			break;
		case "g":
			for (var i=0; i < x.children.length; i++) {
				const child = x.children[i];
				child.attributes = {
					...child.attributes,
					id: x.attributes.id,
					name: x.attributes.name,
				}
				result.push(getChildProps(child));
			}
			break;
		default:
			throw Error(`Invalid SVG child type '${x.name}'.`);
		}

	return result;
}

build.mapSVG = (json) => {
	let elements = [];
	const filtered = json.children.filter(x => allowedTypes.includes(x.name));
	for (var i=0; i < filtered.length; i++) {
		elements.push(...getChildProps(filtered[i]));
	}

	return {
		label: json.attributes['aria-label'],
		viewBox: json.attributes.viewBox,
		elements: elements,
	};
};

build.getClassName = (file) => {
	const removeExt = file.substring(0, file.indexOf('.'));
	const spaces = removeExt.split("-").join(" ");
	const titleCase = build.toTitleCase(spaces);
	return titleCase.split(" ").join("");
};

build.toTitleCase = (input) => {
	return input.replace(/\w\S*/g, text => {
		return text.charAt(0).toUpperCase() + text.substr(1).toLowerCase();
	});
}

fs.readdir(svgFolder, (err, files) => {
	if (err) {
		console.log(`Unable to scan directory ${svgFolder}.`, err);
		return;
	}

	build.checkIndex();
	files.forEach(file => {
		if (path.extname(file) === '.svg') {
			build.convertToJs(file);
		}
	})
});

module.exports = build;