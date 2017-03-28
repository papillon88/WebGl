var vertexShaderText =
[
"precision mediump float;",
"",
"attribute vec2 vertPosition;",
"attribute vec3 vertColor;",
"varying vec3 fragColor;",
"",
"void main()",
"{",
"fragColor = vertColor;",
"gl_Position = vec4(vertPosition,0.0,1.0);",
"}"
].join("\n")

var fragShaderText =
[
"precision mediump float;",
"",
"varying vec3 fragColor;",
"",
"void main()",
"{",
"gl_FragColor = vec4(fragColor,1.0);",
"}"
].join("\n")


var initializeDemo = function(){
	//console.log("this is working so far")
	
	var canvas = document.getElementById("game_surface")
	var gl = canvas.getContext("webgl")
	if(!gl){
		console.log("no webgl support")
	}
	
	gl.clearColor(0.3,0.4,0.5,1.0)
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
	
	//setup graphics pipeline
	
	var vertexShader = gl.createShader(gl.VERTEX_SHADER)
	var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER)
	
	gl.shaderSource(vertexShader,vertexShaderText)
	gl.shaderSource(fragmentShader,fragShaderText)
	
	gl.compileShader(vertexShader)
	gl.compileShader(fragmentShader)
	
	//check if the shaders compiled successfully
	if(!gl.getShaderParameter(vertexShader,gl.COMPILE_STATUS)){
		console.error("error vertex shader",gl.getShaderInfoLog(vertexShader))
		return
	}
	if(!gl.getShaderParameter(fragmentShader,gl.COMPILE_STATUS)){
		console.error("error fragment shader",gl.getShaderInfoLog(fragmentShader))
		return
	}
	
	//create,link and validate program
	var program = gl.createProgram()
	gl.attachShader(program,vertexShader)
	gl.attachShader(program,fragmentShader)
	gl.linkProgram(program)
	if(!gl.getProgramParameter(program,gl.LINK_STATUS)){
		console.error("error linking program",gl.getProgramInfoLog(program))
		return
	}
	gl.validateProgram(program)
	if(!gl.getProgramParameter(program,gl.VALIDATE_STATUS)){
		console.error("error validating program",gl.getProgramInfoLog(program))
		return
	}
	
	
	var triangleVertices =
	[
		0.0,0.5,      0.0,1.0,0.0,
		-0.5,-0.5,	  1.0,0.0,0.0,
		0.5,-0.5,	  0.0,0.0,1.0
	]
	var triangleVertexBufferObject = gl.createBuffer()
	//we bind this buffer to gl, so this is active buffer. later we can detach this buffer and attach another buffer !
	gl.bindBuffer(gl.ARRAY_BUFFER,triangleVertexBufferObject)
	gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(triangleVertices),gl.STATIC_DRAW)

	var positionAttribLocation = gl.getAttribLocation(program,"vertPosition")
	var colorAttribLocation = gl.getAttribLocation(program,"vertColor")
	gl.vertexAttribPointer(
		positionAttribLocation,
		2,
		gl.FLOAT,
		gl.FALSE,
		5*Float32Array.BYTES_PER_ELEMENT,
		0
	)
	gl.vertexAttribPointer(
		colorAttribLocation, //attribute location
		3, //number of elements for this particular attribute per vertex
		gl.FLOAT, //types of elements
		gl.FALSE,
		5*Float32Array.BYTES_PER_ELEMENT, //total size of an individual vertex
		2*Float32Array.BYTES_PER_ELEMENT//offset from begining to the first occurence of an element of this attrubute
	)
	gl.enableVertexAttribArray(positionAttribLocation)
	gl.enableVertexAttribArray(colorAttribLocation)
	
	
	gl.useProgram(program)
	gl.drawArrays(gl.TRIANGLES,0,3)
	
	
}