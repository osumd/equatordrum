
import * as OpenGLToolBox from '../OpenGLTools/OpenGLTools.js'

import { GraphicContext } from '../GraphicContext/GraphicContext.js';

class UniformCenterData{
    index:number;
};

class UniformCenter
{
    graphicContext: GraphicContext;
    gl:WebGL2RenderingContext;
    size:number;
    type:number;
    used:number;
    uniformBuffer: WebGLBuffer | null;
    data: Uint8Array;

    constructor(graphicContext: GraphicContext, type: number, size: number)
    {
        this.uniformBuffer = OpenGLToolBox.createUniformBuffer(graphicContext.gl, type*size, null, 0);
        this.size = size;
        this.type = type;
        this.used = 0;
        this.graphicContext = graphicContext;
        this.gl = graphicContext.gl;
    }

    RegisterData(data:Float32Array) : UniformCenterData
    {
        if(this.used >= this.size/2)
        {
            this.Resize();

        }

        this.used = this.used+1;

        let indexData:UniformCenterData = {index:this.used-1};
        return indexData;
        

    }

    Resize()
    {

        let gl:WebGL2RenderingContext = this.gl;

        let newBuffer: WebGLBuffer | null = gl.createBuffer();

        if (!newBuffer) {
            console.error("Unable to create a new buffer.");
            return null;
        }

        let newsize: number = this.type * (this.size * 2);

        gl.bindBuffer(gl.ARRAY_BUFFER, newBuffer);
        // Allocate storage for the new buffer without initializing it with data (passing null)
        gl.bufferData(gl.ARRAY_BUFFER, newsize, gl.STATIC_DRAW);

        // Bind the new buffer
        gl.bindBuffer(gl.COPY_WRITE_BUFFER, newBuffer);
        gl.bindBuffer(gl.COPY_READ_BUFFER, this.uniformBuffer);

        

        // Copy data from the old buffer to the new one
        gl.copyBufferSubData(gl.COPY_READ_BUFFER, gl.COPY_WRITE_BUFFER, 0, 0, this.type*this.size);

        // Optionally, you may want to delete the old buffer
        gl.deleteBuffer(this.uniformBuffer);

        this.uniformBuffer = newBuffer;

    }

    UpdateData(self:UniformCenterData)
    {
        let gl: WebGL2RenderingContext = this.gl;
        gl.bindBuffer(gl.ARRAY_BUFFER, this.uniformBuffer);

        const byteOffset = self.index * this.type;

        // Calculate the offset within this.data based on this.type and self.index
        const dataOffset = this.type * self.index;

        // Assuming this.data is a Uint8Array containing your raw data
        gl.bufferSubData(gl.ARRAY_BUFFER, byteOffset, this.data.subarray(dataOffset, dataOffset+this.type));

    }

    



}

