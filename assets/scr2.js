function process(node, literal=random()){
	let isTextNode = /text/i.test(node.nodeName);
	let converted = "";
	
	if(isTextNode){
		//content
		converted+=`const ${literal} = document.createTextNode("${node.data.trim()}");\n`;
	}
	else{
		//creating the node
		converted+=`const ${literal} = document.createElement("${node.localName}");\n`;
		
		//adding attributes
		if(node.attributes.length===1){
			let attribute = node.attributes[0];
			converted+=`${literal}.setAttribute("${attribute.name}", "${attribute.value}");\n`;
		}
		else if(node.attributes.length>1){
			let allAttributes = new Array();

			[...node.attributes].forEach(attr=>{
				let {
					localName: name,
					value
				} = attr;

				allAttributes.push({name, value});
			});

			let attributesObjectString = "{";

			for(let i of allAttributes){
				attributesObjectString+=`\n  "${i.name}": \`${i.value}\`,`;
			}

			attributesObjectString+="}";

			converted+=`for(const [key, value] of Object.entries(${attributesObjectString})){\n  ${literal}.setAttribute(key, value); \n}\n`;
		}

	}

	if(node.childNodes.length>0){
		for(let child of node.childNodes){
			let tempChildName = random();
			converted+=`${process(child, tempChildName)}\n`;
			converted+=`${literal}.appendChild(${tempChildName});\n`;
		}
	}

	return converted;
}


function random(length = 8){
    // Declare all characters
    let chars = 'abcdefghijklmnopqrstuvwxyz';

    // Pick characers randomly
    let str = '';
    for (let i = 0; i < length; i++) {
        str += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    return str;
};


function prepare(){
	let input = document.querySelector("#input").value.trim();

	let invisible = document.createRange().createContextualFragment(input);
	try{
		let result = process(invisible.children[0]);
		let output = document.querySelector("#output");
		output.innerText=result;
	}catch{
		alert("invalid input");

	}
}

document.querySelectorAll("[title=copy]").forEach(copy=>{
	copy.addEventListener("click", (e)=>{
		e.currentTarget.parentElement.parentElement.querySelector(".containers").select();
		document.execCommand("copy");
		alert("Copied to clipboard!")
	})
})