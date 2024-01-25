const tokens = [
    { category:"Reservated",type: 'Else-Struct', regex: /^else/ },
    { category:"Assignation",type: 'Identificator', regex: /^(?!int\b)(?!string\b)(?!boolean\b)(?!true\b)(?!false\b)[a-zA-Z_]([a-zA-Z0-9_]*)/ },
    { category:"Reservated",type: 'Variable-Type', regex: /^(int|boolean|string)/ },
    { category:"Reservated",type: 'Function-declaration', regex: /^func/ },
    { category:"Reservated",type: 'If-Struct', regex: /^if/ },
    { category:"Value",type: 'Number-Content', regex: /^(([1-9][0-9]*)|0)/},
    { category:"Value",type: 'String-content', regex: /^"([\s"a-zA-Z0-9][a-zA-Z0-9_]*)*"/ },
    { category:"Reservated",type: 'Boolean-value', regex: /^(true|false)+/ },
    { category:"Operator",type: 'Operator-Inc-Dec', regex: /^((\+){2})|((\-){2})/ },
    { category:"Parentheses",type: 'Initial-Parentheses', regex: /^\(/ },
    { category:"Parentheses",type: 'Final-Parentheses', regex: /^\)/ },
    { category:"Square-Bracket",type: 'Initial-Square-Bracket', regex: /^\{/ },
    { category:"Square-Bracket",type: 'Final-Square-Bracket', regex: /^\}/ },
    { category:"Symbol",type: 'Comma', regex: /^,/ },
    { category:"Symbol",type: 'Semicolon', regex: /^;/ },
    { category:"Arithmetic",type: 'Plus-Operator', regex: /^(\+){1}/ },
    { category:"Arithmetic",type: 'Minus-Operator', regex: /^-/ },
    { category:"Arithmetic",type: 'Asterisk', regex: /^\*/ },
    { category:"Arithmetic",type: 'Diagonal-Divition', regex: /^\// },
    { category:"Operator",type: 'Equal', regex: /^=/ },
    { category:"Operator",type: 'Less-Than', regex: /^</ },
    { category:"Operator",type: 'More-Than', regex: /^>/ },
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


function counting(tokenizedCode) {
    const categoryCount = {};

    for (const token of tokenizedCode) {
        const category = token.category;

        if (categoryCount[category]) {
            categoryCount[category]++;
        } else {
            categoryCount[category] = 1;
        }
    }

    return categoryCount;
}

function validateString() {
    resultado= document.getElementById('resultado');
    resultado.textContent ="";
    resultado.style.color = '';
    currentTokenIndex = 0;
    const table = document.querySelector('table tbody');

    table.innerHTML = '';
    const cadena = document.getElementById('variable').value;
    const tokens1 = tokenize(cadena);
   
    //parseProgram(tokens1);
    console.log(tokens1)
    
    var count = counting(tokens1)
    console.log(count)

    for (const token of tokens1) {
        const row = table.insertRow();
        const cell1 = row.insertCell(0);
        const cell2 = row.insertCell(1);
        const cell3 = row.insertCell(2);

        cell1.textContent = token.category;
        cell2.textContent = token.type;
        cell3.textContent = token.value;
    }
    
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