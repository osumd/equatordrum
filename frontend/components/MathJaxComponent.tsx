
import MathJax from 'react-mathjax2'

const ascii = 'U = 1/(R_(si) + sum_(i=1)^n(s_n/lambda_n) + R_(se))'
const content = `This can be dynamic text (e.g. user-entered) text with ascii math embedded in  symbols like $$${ascii}$$`

const AsciiMathComponent = ({ asciiContent }) => {
    const content = `${asciiContent}`;

    return (
        <MathJax.Context
            input="ascii"
            onLoad={() => console.log("Loaded MathJax script!")}
            onError={(MathJax, error) => {
                console.warn(error);
                console.log("Encountered a MathJax error, re-attempting a typeset!");
                MathJax.Hub.Queue(MathJax.Hub.Typeset());
            }}
            script="https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.2/MathJax.js?config=AM_HTMLorMML"
            options={{
                asciimath2jax: {
                    useMathMLspacing: true,
                    delimiters: [["$", "$"]],
                    preview: "none",
                },
            }}
        >
            <MathJax.Text text={content} />
        </MathJax.Context>
    );
};

const Math = ({ children, style ={} }) => {

    const defaultMathStyle = {
        fontSize: '16px', // Adjust the font size as needed
        fontFamily: 'Arial, sans-serif', // Change the font family
        color: 'blue', // Change the font color
        // Add more default styling properties as needed
    };

    const mergedStyle = { ...defaultMathStyle, ...style };

    return (
        <MathJax.Context
            input="ascii"
            onLoad={() => console.log("Loaded MathJax script!")}
            onError={(MathJax, error) => {
                console.warn(error);
                console.log("Encountered a MathJax error, re-attempting a typeset!");
                MathJax.Hub.Queue(MathJax.Hub.Typeset());
            }}
            script="https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.2/MathJax.js?config=AM_HTMLorMML"
            options={{
                asciimath2jax: {
                    useMathMLspacing: true,
                    delimiters: [["$", "$"]],
                    preview: "none",
                },
            }}
        >
        <div style={mergedStyle}>
        <MathJax.Text text={`${children}`} />
        </div >
        </MathJax.Context>
        
    );
};



export default Math;