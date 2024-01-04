import { parse } from "path";




class ExpressionNode
{

    data:any;
    left:ExpressionNode|null;
    right:ExpressionNode|null;
    precedence:number;

    constructor(data)
    {
        this.data = data;
        this.left = null;
        this.right = null;


    }

}

type HandleOperatorCall = (parseIterator: { operandStack: ExpressionNode[], operatorStack: ExpressionNode[], equation: string, index: number, precedence: number }) => void;

class OperatorCallNode {
    precedence: number;
    call: HandleOperatorCall;
};


class LatexAST
{
    OperatorMap: Map<string, OperatorCallNode>;
    MathDelimeterMap: Map<string, number>;

    equation:string;


    

    
    constructor(equation:string)
    {
        this.equation = equation;
    }

    ParseExpression(equation: string) : ExpressionNode
    {

        var operandStack: ExpressionNode[];
        var operatorStack: ExpressionNode[];

        let equationLength = equation.length;
        
        var currentToken = "";

        for (var i = 0; i < equationLength; i++) 
        {

            currentToken = equation[i];

            if(currentToken != ' ')
            {
                if (this.MathDelimeterMap.has(currentToken)) {
                    this.HandleMathDelimeter({ index: i });
                } else
                if (this.OperatorMap.has(currentToken)) {
                    //Meaning it is a single character operator rather than a complex one.
                    let operatorCallNode: OperatorCallNode = this.OperatorMap.get(currentToken); //Get current call token.
                    //Calls the associated call back function for the operator.
                    operatorCallNode.call({ operandStack: operandStack, operatorStack: operatorStack, equation: equation, index: i, precedence: operatorCallNode.precedence });



                } else
                if (currentToken == '\\') {
                    this.HandleBackslash({ operandStack: operandStack, operatorStack: operatorStack, equation: equation, index: i });
                } 
            }
            

        }

        return operandStack[0];


    }


    EstablishMathDelimeterMap()
    {

        this.MathDelimeterMap.set("$", 0);


    }

    EstablishOperatorMap() {

        this.OperatorMap.set("frac", {precedence:3,call:HandleLatexOrderlyOperator});
        this.OperatorMap.set("*", {precedence: 3, call: HandleTraditionalOperator});
    }

    HandleMathDelimeter(parseIterator: { index: number })
    {
        if(this.equation[parseIterator.index] == "$")
        {

        }


    }

    HandleBackslash(parseIterator: { operandStack: ExpressionNode[], operatorStack: ExpressionNode[], equation: string, index: number }) : ExpressionNode
    {

        let maxIterations:number=50;
        let currentIterations:number=0;
        
        let virtualIndex = parseIterator.index;
    
        //Skip past excess backslashes.
        while(parseIterator.equation[virtualIndex] == '\\' && virtualIndex < parseIterator.equation.length && currentIterations <= maxIterations)
        {
            virtualIndex++;
            currentIterations++;
        }

        var operatorName:string = "";

        currentIterations = 0;

        //Absorb operator name.
        while (parseIterator.equation[virtualIndex] != '{' && parseIterator.equation[virtualIndex] != ' ' && virtualIndex < parseIterator.equation.length && currentIterations <= maxIterations)
        {
            operatorName += parseIterator.equation[virtualIndex];
            virtualIndex++;
            currentIterations++;
        }


        
        var operatorParameters:string[] = [];
        
        currentIterations = 0;

        if(parseIterator.equation[virtualIndex] == '{')
        {
            var currentParameter="";

            while (parseIterator.equation[virtualIndex] != ' ' && parseIterator.equation[virtualIndex] != ' ' && virtualIndex < parseIterator.equation.length && currentIterations <= maxIterations) 
            {

                if(parseIterator.equation[virtualIndex] == '{')
                {

                }else
                if(parseIterator.equation[virtualIndex] == '}')
                {

                    operatorParameters.push(currentParameter);
                    currentParameter="";

                }else
                {
                    currentParameter+=parseIterator.equation[virtualIndex];
                }

                virtualIndex++;
                currentIterations++;

            }
        }

        

        var operatorNode:ExpressionNode = new ExpressionNode(operatorName);


        //MAX_PARAMETERS 2

        if(operatorParameters.length >= 2)
        {
            operatorNode.left = this.ParseExpression(operatorParameters[0]);
            operatorNode.right = this.ParseExpression(operatorParameters[1]);
        }

        
        if (virtualIndex >= parseIterator.equation.length) {
            console.log("Erroneous Max Iteration Limit In AST");
            return;
        }

        if (currentIterations > maxIterations) {
            console.log("Erroneous Max Iteration Limit In AST");
            return;
        }

        return operatorNode;

    }



}



function HandleLatexOrderlyOperator(parseIterator: { operandStack: ExpressionNode[], operatorStack: ExpressionNode[], equation: string, index: number, precedence: number }): void {
    
}

function HandleTraditionalOperator(parseIterator: { operandStack: ExpressionNode[], operatorStack: ExpressionNode[], equation: string, index: number, precedence: number })
{

    

    //Get precedence from top of stack.
    let topOperator = parseIterator.operatorStack.pop();
    let topOperatorPrecedence = topOperator.precedence;

    let newOperatorNode = new ExpressionNode(parseIterator.equation[parseIterator.index])
    {
        
    }

    //Case where the top operator is an opening bracket
    if(topOperator.data == '(')
    {
        //At this point push the operator onto the operator stack.
        //parseIterator.operatorStack.push()
        return;
    }

    if(topOperatorPrecedence >= parseIterator.precedence)
    {



    }




}


function HandleMathDelimeter(parseIterator: { root: ExpressionNode[], equation: string, index: number }): void 
{

    if(parseIterator.index == parseIterator.equation.length-1)
    {
        return;
    }

    if(parseIterator.equation[parseIterator.index+1] == "$")
    {
        parseIterator.index+=1;
        return;
    }

}

