export class GraphicContext
{
    gl: WebGL2RenderingContext;
    width: number;
    height: number;

    bufferBaseTail:number;

    constructor(gl: WebGL2RenderingContext, width:number, height:number)
    {
        this.gl = gl;
        this.width = width;
        this.height = height;
        this.bufferBaseTail = 0;

    }
}

