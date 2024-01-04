import Math from '../components/MathJaxComponent';

import { parse, HtmlGenerator } from 'latex.js'
import { createHTMLWindow } from 'svgdom'

const math = require('mathjs');

const v = require('./vecie');

// Importing three.js and GLTFLoader
import * as THREE from 'three';

// Ensure the GLTFLoader is available (it's part of the main three.js package)
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

type CoordinateProjectionScheme = (vertex: { c0: vecn, c1: vecn, c2: vecn, c3: vecn }) => { p0: vec3, p1: vec3, p2: vec3, p3: vec3 };



class ParameterizedSurface{

    externalDelimiter:number;
    equation:string;
    delimiter:number;

    uniqueVariables:number;
    uniqueDimensions:number;

    acceptedDelimiters:number[];
    acceptedOperators:number[]=[40,41,42,43,45,57];
    equations:string[] = [];
    debugDisplay:any[]=[];

    variables:Map<string,number>;
    variablesArray:Array<string>;
    variableScope:{};

    //Different forms of coordinate system
    CoordinateSystem3D:{x:vec3, y:vec3, z:vec3}; //Uses projection in unique dimensions greater than three.
    system:Array<vec3>; //Uses unique dimension axis vectors for each unique dimension.

    //Parameter space
    parameterSteps:number[];
    parameterSpaces:vec2[];


    constructor( equation:string )
    {

        this.acceptedDelimiters=[
            44,45,39
        ];

        this.externalDelimiter = equation.charCodeAt(0);
        this.equation=equation;

        this.decodeEquation();

        

    }

    pass3DCoordinateSystem(x:vec3, y:vec3, z:vec3)
    {
        this.CoordinateSystem3D={x,y,z};
    }

    passNCoordinateSystem(system:Array<vec3>)
    {
        this.system = system;
    }


    decodeEquation()
    {
        const equationLength:number = this.equation.length;
        var   currentCharacter:number = 0;

        var delimiterFound:boolean = false;

        var currentEquation:number = 0;

        var equationString = ""
        
        console.log(this.acceptedOperators.length);


        for (var i = 1; i < equationLength; i++)
        {
            
            currentCharacter = this.equation.charCodeAt(i);

            if(currentCharacter === this.externalDelimiter)
            {
                continue;
            }


            var acceptedOperator = false;

            
            for(var k = 0; k < this.acceptedOperators.length; k++)
            {

                if(currentCharacter === this.acceptedOperators[k])
                {
                    acceptedOperator = true;
                    k = this.acceptedOperators.length;
                    
                }

            }

            if((currentCharacter <= 122 && currentCharacter >= 65) || currentCharacter >= 48 && currentCharacter <= 57 || currentCharacter == 46 || acceptedOperator == true)
            {

                if(acceptedOperator != true)
                {   
                    if(!this.variables.has(String.fromCharCode(currentCharacter)))
                    {
                        this.variables.set(String.fromCharCode(currentCharacter), 0);
                        this.variableScope[String.fromCharCode(currentCharacter)] = this.uniqueDimensions;
                        this.variablesArray.push(String.fromCharCode(currentCharacter));
                        this.uniqueDimensions+=1;

                    }
                    

                }

                equationString += String.fromCharCode(currentCharacter);


            }

            if(delimiterFound == false)
            {
                for (var j = 0; j < this.acceptedDelimiters.length; j++) 
                {
                    if (currentCharacter == this.acceptedDelimiters[j]) {
                        delimiterFound = true;
                        this.delimiter = currentCharacter;
                        j = this.acceptedDelimiters.length;
                        this.equations.push(equationString);
                        equationString = "";
                    }
                }
            }else if(currentCharacter == this.delimiter)
            {
                this.equations.push(equationString);
                equationString = "";
            }else
            {

                //invalid character ignore.

            }

            

            




            
            

        }

        this.equations.push(equationString);
        equationString = "";

    }

    /**
     * Takes two numbers and returns their sum
     * @param x1 first value interpolating from
     * @param x2 value interpolating through
     * @param x3 end value interpolating to
     * @param k1 derivative slopes of interpolating function at endpoint A??
     * @param k2 derivative slopes of interpolating function at endpoint B??
     * @returns interpolated value?
     */
    interpolatingCubicSplines(x:vecn, y:vecn, k1:number, k2:number, t:number):number
    {
        //assuming normalized t
        let tx:number = (t-x[0])/x[1]-x[0];

        let a: number = k1*(x[1]-x[0])-(y[1]-y[2]);
        let b: number = -k2*(x[1] - x[0]) - (y[1] - y[2]);

        

        return (1-tx)*y[0] + tx*y[1] + tx*(1-tx)*((1-tx)*a + tx*b);


    }

    generateMeshPoints(projectionMethod:CoordinateProjectionScheme)
    {

        var tpo = new v.vecn(this.uniqueDimensions);
        var tpe = new v.vecn(this.uniqueDimensions);
        var tpne = new v.vecn(this.uniqueDimensions);
        var tpn = new v.vecn(this.uniqueDimensions);

        //Principal Dimensions
        let firstPrincipal = this.variablesArray[0];
        let secondPrincipal = this.variablesArray[1];


        var vertexAttributes:Array<vec3>;
        var elementAttributes:Array<vec3>;
        var memoryDataBack:number;
        var indexDataBack:number;
        var index:number;



        for(var i = 0; i < 1; i++)
        {
            
            //Calculate parameter space length.
            let paramLength = this.parameterSpaces[i].y - this.parameterSpaces[i].x;
            let paramStep = paramLength / this.parameterSteps[i];
            

            //For each step in dimension i
            for(var j = 0; j < paramStep; j++)
            {
                
                

                let currentParameter = j*paramStep;

                //Just for another effect less scientific.
                let normalizedParameter = currentParameter/paramLength;
                let linearInterpolation = this.parameterSpaces[i].x*(1-normalizedParameter) + this.parameterSpaces[i].y*(normalizedParameter);
                

                

                for(var k = 0; k < this.uniqueDimensions; k++)
                {
                    var mathNode = math.parse(this.equations[i]);
                    var tree = mathNode.compile();

                    var firstDerivative = mathNode.derivative();
                    var prime = firstDerivative.compile();
                    var secondDerivative = firstDerivative.derivative();
                    var doubleprime = secondDerivative.compile();

                    // Get variable indentifier label.
                    let dimensionIdentifier = this.variablesArray[k];

                    this.variableScope[dimensionIdentifier] = currentParameter;

                    //Adjacent laplace dimensions : Use coming soon.
                    let eastDimension = this.variablesArray[k+1];
                    let westDimension = this.variablesArray[k+2];
                    let northDimenion = this.variablesArray[k+3];
                    let southDimension = this.variablesArray[k+4];



                    //Sampling first principal points
                    tpo[k] = tree.evaluate(this.variableScope);

                    this.variableScope[firstPrincipal] += 1;
                    tpe[k] = tree.evaluate(this.variableScope);
                    
                    this.variableScope[secondPrincipal] += 1;
                    tpne[k] = tree.evaluate(this.variableScope);

                    this.variableScope[firstPrincipal] -= 1;
                    tpn[k] = tree.evaluate(this.variableScope);
                    
                    // Derivative samples

                    let du = prime.evaluate(this.variableScope);
                    let ddu = doubleprime.evaluate(this.variableScope);


                    //Forward animation
                    this.variableScope[dimensionIdentifier] += currentParameter;

                    //K Modulus Class
                }



                //After this point we have constructed the geometric vector sets at paramStep x0

                //This step must advance the principals, or may be neccecary to reset them.

                this.variableScope[firstPrincipal] += 1;
                this.variableScope[secondPrincipal] += 1;

                //Geometric production
                let projectedCoordinates:{p0:vec3, p1:vec3, p2:vec3, p3:vec3} = projectionMethod({c0:tpo, c1:tpe, c2:tpne, c3:tpn});

                if(j == 0)
                {
                    this.startGeometryMesh({vertexData:vertexAttributes, elementData:elementAttributes, vertexDataBack:memoryDataBack, elementDataBack:indexDataBack, elementIndex:index},projectedCoordinates);
                }else{
                    this.updateGeometryMesh({ vertexData: vertexAttributes, elementData: elementAttributes, vertexDataBack: memoryDataBack, elementDataBack: indexDataBack, elementIndex: index }, projectedCoordinates);
                }

            }



        }

    }

    geometric3DProjection(vertex: { c0: vecn, c1: vecn, c2: vecn, c3: vecn }) : {p0: vec3, p1: vec3, p2: vec3, p3: vec3}
    {

        //Set inital values based on first three dimensions

        var p0:vec3;
        p0.setVecn(vertex.c0);
        var p1:vec3;
        p1.setVecn(vertex.c1);
        var p2:vec3;
        p2.setVecn(vertex.c2);
        var p3:vec3;
        p3.setVecn(vertex.c3);

    

        for(var i = 3; i < this.uniqueDimensions-3; i++)
        {
            p0.divide(vertex.c0[i]);
            p1.divide(vertex.c1[i]);
            p2.divide(vertex.c2[i]);
            p3.divide(vertex.c3[i]);
        }

        return {p0,p1,p2,p3};

    }

    startGeometryMesh(meshInformant: { vertexData: Array<vec3>, elementData: Array<vec3>, vertexDataBack: number, elementDataBack: number, elementIndex: number}, geometry: {p0:vec3, p1:vec3, p2:vec3, p3:vec3})
    {

    }

    updateGeometryMesh(meshInformant: { vertexData: Array<vec3>, elementData: Array<vec3>, vertexDataBack: number, elementDataBack: number, elementIndex: number }, geometry: { p0: vec3, p1: vec3, p2: vec3, p3: vec3 })
    {





    }


    generateQuadrature()
    {
        //for paramsteps
        //for paramsteps
        
        //use firstPrincipal+1
        //use secondPrincipal+2
        //update all other variables.

        //increment second principal
        //increment first principal
    }



    meshEquations()
    {

        //Pick staple dimension


    }





    display()
    {

        const latexString = '$\\frac{ \\frac{u \\cdot v}{u^2} + v^2 }{12}$';
        //let latex = "Hi, this is a line of text."

        //let generator = new HtmlGenerator({ hyphenate: false })

        //let doc = parse(latex, { generator: generator }).htmlDocument()

        //console.log(doc.documentElement.outerHTML)
        

        const rows = [];

        for(var i = 0; i < this.equations.length; i++)
        {

            rows.push(
                <div key={i}>
                {this.equations[i]}
                </div>
            );  

        }

        return(
            <div>
            {this.debugDisplay}
            {rows}

            <Math>{latexString}</Math>
            
            </div>

        );

    }

};

export default ParameterizedSurface;