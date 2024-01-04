

export function createUniformBuffer(gl: WebGL2RenderingContext, size: number, data: any, index: number): WebGLBuffer | null {
    const uniformBuffer: WebGLBuffer | null = gl.createBuffer();

    if (!uniformBuffer) {
        console.error("Unable to create uniform buffer.");
        return null;
    }

    
    gl.bindBuffer(gl.ARRAY_BUFFER, uniformBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
    gl.bindBuffer(gl.UNIFORM_BUFFER, null);

    gl.bindBufferBase(gl.UNIFORM_BUFFER, index, uniformBuffer);

    return uniformBuffer;
}

