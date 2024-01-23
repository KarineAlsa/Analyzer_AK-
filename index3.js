const tokens = [
    { category:"Reservated",type: 'Else-Struct', regex: /^else/ },
    { category:"Reservated",type: 'Variable-Type', regex: /^(int|boolean|string)/ },
    //{ type: 'for', regex: /^(int)\s+/ },
    { category:"Reservated",type: 'If-Struct', regex: /^if/ },
    { category:"Assignation",type: 'Identificator', regex: /^(?!int\b)(?!string\b)(?!boolean\b)(?!true\b)(?!false\b)[a-zA-Z_]([a-zA-Z0-9_]*)/ },
    //{ type: 'boolean', regex: /^(true|false)+/ },
    { category:"Value",type: 'Number-Content', regex: /^(([1-9][0-9]*)|0)/},
    { category:"Value",type: 'String-content', regex: /^"([\s"a-zA-Z0-9][a-zA-Z0-9_]*)*"/ },
    { category:"Value",type: 'Boolean-value', regex: /^(true|false)+/ },
    { category:"Reservated",type: 'Function-declaration', regex: /^function/ },
    { category:"Symbol",type: 'Operator-Inc-Dec', regex: /^((\+){2})|((\-){2})/ },
    { category:"Symbol",type: 'Initial-Parentheses', regex: /^\(/ },
    { category:"Symbol",type: 'Final-Parentheses', regex: /^\)/ },
    { category:"Symbol",type: 'Initial-Square-Bracket', regex: /^\{/ },
    { category:"Symbol",type: 'Final-Square-Bracket', regex: /^\}/ },
    { category:"Symbol",type: 'Comma', regex: /^,/ },
    { category:"Symbol",type: 'Semicolon', regex: /^;/ },
    { category:"Symbol",type: 'Plus-Operator', regex: /^(\+){1}/ },
    { category:"Symbol",type: 'Minus-Operator', regex: /^-/ },
    { category:"Symbol",type: 'Asterisk', regex: /^\*/ },
    { category:"Symbol",type: 'Diagonal-Divition', regex: /^\// },
    { category:"Symbol",type: 'Equal', regex: /^=/ },
];


function tokenize(sourceCode) {
    const tokenizedCode = [];
    let match;

    while (sourceCode) {
        let foundMatch = false;

        for (const { category, type, regex } of tokens) {
            match = sourceCode.match(regex);

            if (match && match.index === 0) {
                const value = match[0].trim();
                tokenizedCode.push({ category, type, value });
                sourceCode = sourceCode.slice(value.length).trim();
                foundMatch = true;
                break;
            }
        }

        if (!foundMatch) {
            const errorValue = sourceCode.trim().split(/\s+/)[0];
            tokenizedCode.push({ category: "ERROR", type: "ERROR", value: errorValue });
            sourceCode = sourceCode.slice(errorValue.length).trim();
        }
    }

    return tokenizedCode;
}


function validateString() {
    resultado= document.getElementById('resultado');
    resultado.textContent ="";
    resultado.style.color = '';
    currentTokenIndex = 0;
    const cadena = document.getElementById('variable').value;
    const tokens1 = tokenize(cadena);
   
    //parseProgram(tokens1);
    console.log(tokens1)
    
    

    
    resultado.textContent =`LISTO.`;
    resultado.style.color = 'Green';
   
    Swal.fire({
        position: 'center',
        icon: 'success',
        title: `LISTO.`,
        showConfirmButton: false,
        timer: 3000
    })
    
}