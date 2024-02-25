const tokens = [
    { category:"Value",type: 'If_Content', regex: /^[a-zA-Z_]+([a-zA-Z0-9_]*)\s*((==|<=|>=|!|<|>){1})\s*(([a-zA-Z_]+([a-zA-Z0-9_]*))|([1-9][0-9]*)|0)/ },
    { category:"Assignation",type: 'Identificator', regex: /^(?!int\b)(?!string\b)(?!for\b)(?!boolean\b)(?!else\b)(?!if\b)(?!func\b)(?!true\b)(?!false\b)[a-zA-Z]([a-zA-Z0-9_]*)/ },
    { category:"Reservated",type: 'Variable_Int', regex: /^(int)/ },
    { category:"Reservated",type: 'Variable_String', regex: /^(string)/ },
    { category:"Reservated",type: 'Variable_Boolean', regex: /^(boolean)/ },
    { category:"Value",type: 'For_Content', regex: /^(int)\s+/ },
    { category:"Reservated",type: 'Else_Struct', regex: /^else/ },
    { category:"Reservated",type: 'Function_Declaration', regex: /^func/ },
    { category:"Reservated",type: 'If_Struct', regex: /^if/ },
    { category:"Reservated",type: 'For_Struct', regex: /^for/ },
    { category:"Value",type: 'Number_Content', regex: /^(([1-9][0-9]*)|0)/},
    { category:"Value",type: 'String_Content', regex: /^"([\s"a-zA-Z0-9][a-zA-Z0-9_]*)+"/ },
    { category:"Reservated",type: 'Boolean_Value', regex: /^(true|false)+/ },
    { category:"Operator",type: 'Operator_Inc_Dec', regex: /^((\+){2})|((\-){2})/ },
    { category:"Parentheses",type: 'Initial_Parentheses', regex: /^\(/ },
    { category:"Parentheses",type: 'Final_Parentheses', regex: /^\)/ },
    { category:"Square_Bracket",type: 'Initial_Square_Bracket', regex: /^\{/ },
    { category:"Square_Bracket",type: 'Final_Square_Bracket', regex: /^\}/ },
    { category:"Symbol",type: 'Comma', regex: /^,/ },
    { category:"Symbol",type: 'Semicolon', regex: /^;/ },
    { category:"Operator",type: 'Equal_Equal', regex: /^(=){2}/ },
    { category:"Operator",type: 'Diffenent', regex: /^(!){1}/ },
    { category:"Arithmetic",type: 'Equal', regex: /^=/ },
    { category:"Operator",type: 'More_Equal', regex: /^>=/ },
    { category:"Operator",type: 'More_Equal', regex: /^<=/ },
    { category:"Operator",type: 'Less_Than', regex: /^</ },
    { category:"Operator",type: 'More_Than', regex: /^>/ },
];

function tokenize(sourceCode) {
    const tokenizedCode = [];
    let match;

    while (sourceCode) {
        
        let foundMatch = false;

        for (const { category, type, regex } of tokens) {
            if(cleaning && type =='If_Content' ){
                continue
            }
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

let cleaning=false;
let indexChange=[]
let currentTokenIndex = 0;
let conditional = false;
let elseif = false;
let func = false;
let cicle = false;
let resultado;
function parseProgram(tokens1) {
    
    function consume(type) {
        const token = tokens1[currentTokenIndex];
       
        if (token && token.type == type) {
            console.log(token.type==type)
            const value = token.value;
            currentTokenIndex++;
            return value;
        } else if(token && type== 'for' && token.value=="int") {
            const value = token.value;
            currentTokenIndex++;
            return value;
        }else {
            if(type==="if"||type==="string"||type==="int"||type==="func"||type==="boolean"||type==="else"||type==="for") {
                let currentTokenIndexRep = currentTokenIndex;
                currentTokenIndex = 0;
                Swal.fire({
                    position: 'center',
                    icon: 'error',
                    title: `Error de sintaxis: Se esperaba un token de tipo expresión ${type} después de ${tokens1[currentTokenIndexRep-1].value}`,
                    showConfirmButton: false,
                    timer: 3000
                })
                resultado.textContent =`expresión ${type} después de ${tokens1[currentTokenIndexRep-1].value}`;
                resultado.style.color = 'Red';
                
                throw new Error(`Error de sintaxis: Se esperaba un token de tipo expresión ${type} después de ${tokens1[currentTokenIndexRep-1].value}`);
            }else{
                let currentTokenIndexRep = currentTokenIndex;
                currentTokenIndex = 0;
                Swal.fire({
                    position: 'center',
                    icon: 'error',
                    title: `Error de sintaxis: Se esperaba un token de tipo ${type} después de ${tokens1[currentTokenIndexRep-1].value}`,
                    showConfirmButton: false,
                    timer: 3000
                })
                resultado.textContent =`tipo ${type} después de ${tokens1[currentTokenIndexRep-1].value}`;
                resultado.style.color = 'Red';
                
                throw new Error(`Error de sintaxis: Se esperaba un token de tipo ${type} después de ${tokens1[currentTokenIndexRep-1].value}`);
            }
        }
    }

    function getType(value) {
        
        if(value == "int"){
            return "Number_Content"
        }
        if(value == "string"){
            return "String_Content"
        }
        else{
            return "Boolean_Value"
        }
    }

    function getVar(value) {
        
        if(value == "int"){
            return "Variable_Int"
        }
        if(value == "string"){
            return "Variable_String"
        }
        else{
            return "Variable_Boolean"
        }
    }

    function parseDeclarationVariable() {
        const type = getType(tokens1[currentTokenIndex].value)
        const varType = getVar(tokens1[currentTokenIndex].value)
        consume(varType);
        consume('Identificator');
        consume('Equal');
        parseExpresion(type);
        consume('Semicolon');
    }

    function parseExpresion(type){
        consume(type);
    }

    function parseFunction() {
        
        consume('Function_Declaration');
        consume('String_Content');
        consume('Initial_Parentheses');
        parseParametros();
        consume('Final_Parentheses');
        consume('Initial_Square_Bracket');
        parseProgram(tokens1);
        consume('Final_Square_Bracket');
    }

    function parseParametros() {
        
        while (tokens1[currentTokenIndex] &&tokens1[currentTokenIndex].type === 'Identificator') {   
            consume('Identificator');
            if (tokens1[currentTokenIndex].type !== 'Comma') {
                
                break;
            }
            if(tokens1[currentTokenIndex+1].type !="Identificator"){
                throw new Error("Error: Coma no esperada al final de la lista de parámetros.");
            }
            consume('Comma');
        }
        if (tokens1[currentTokenIndex] &&tokens1[currentTokenIndex].type === 'Comma') {
            throw new Error("Error: Coma no esperada al final de la lista de parámetros.");
        }
    }

    function parseConditional() {
        conditional = true;
        const type = consume('If_Struct');
        consume('Initial_Parentheses');
        indexChange.push(currentTokenIndex)
        consume('If_Content');
        //consume(type)
        consume('Final_Parentheses');
        consume('Initial_Square_Bracket');
        parseProgram(tokens1);
        consume('Final_Square_Bracket');
        if (tokens1[currentTokenIndex]!=undefined && tokens1[currentTokenIndex].type =='Else_Struct') {     
            elseif = true;
            
            consume('Else_Struct');
            consume('Initial_Square_Bracket');
            parseProgram(tokens1);
            consume('Final_Square_Bracket');
        }
        conditional = false;
        elseif = false;
    }

    function parseCicloFor() {
        const type = consume('For_Struct');
        consume('Initial_Parentheses');
        parseInicial();
        consume('Semicolon');
        parseCondicion();
        consume('Semicolon');
        parseActualizacion();
        consume('Final_Parentheses');
        consume('Initial_Square_Bracket');
        parseProgram(tokens1);
        consume('Final_Square_Bracket');
        
    }
    function parseInicial() {
        consume('Variable_Int')
        consume('Identificator')
        consume('Equal')
        
        if (tokens1[currentTokenIndex].type === 'Identificator'){
            consume('Identificator')

        }else if (tokens1[currentTokenIndex].type === 'Number_Content'){
            consume('Number_Content')
        }else{
            
            Swal.fire({
                position: 'center',
                icon: 'error',
                title: `Error de sintaxis: Se esperaba un token de asignación después de ${tokens1[currentTokenIndex-1].value}`,
                showConfirmButton: false,
                timer: 3000
            })
            throw new Error(`Error de sintaxis: Se esperaba un token de asignación después de ${tokens1[currentTokenIndex-1].value}`);
        }
        
    }

    function parseCondicion() {
        indexChange.push(currentTokenIndex)
        consume('If_Content')
        
    }
    function parseActualizacion() {
        consume('Identificator')
        consume('Operator_Inc_Dec')

        
    }
    



    while (currentTokenIndex < tokens1.length) {
        console.log(tokens1[currentTokenIndex].type)
        if (tokens1[currentTokenIndex].type === "Variable_Int"||tokens1[currentTokenIndex].type === "Variable_String"||tokens1[currentTokenIndex].type === "Variable_Boolean") {
            parseDeclarationVariable();
        } else if (tokens1[currentTokenIndex].type === 'Function_Declaration') {
            parseFunction();
        } else if (tokens1[currentTokenIndex].type === 'If_Struct') {
            parseConditional();
        } else if (tokens1[currentTokenIndex].type === 'For_Struct') {
            parseCicloFor();
        } else if (tokens1[currentTokenIndex].type === 'Final_Square_Bracket'){
            break;
        } else if (tokens1[tokens1.length-1].type === 'Else_Struct' && conditional ==true){
            break;
        }
        else {
            Swal.fire({
                position: 'center',
                icon: 'error',
                title: `Error de sintaxis: Estructura ${tokens1[currentTokenIndex].value} no reconocida, pruebe con string,int,boolean,func,if,for...`,
                showConfirmButton: false,
                timer: 3000
            })
            throw new Error('Error de sintaxis: Estructura no reconocida, pruebe con string, int, boolean, func, if, for...');
        }
    }
}


function validateString() {
    indexChange=[]
    resultado= document.getElementById('resultado');
    resultado.textContent ="";
    resultado.style.color = '';
    currentTokenIndex = 0;
    const table = document.querySelector('table tbody');

    table.innerHTML = '';
    var cadena = document.getElementById('variable').value;
    cadena = cadena.trimStart()
    var tokens1 = tokenize(cadena)
    console.log(tokens1);
    console.log(cadena);
    var count = counting(tokens1)
    
    parseProgram(tokens1);
    
    tokens1=cleanProgram(tokens1);
    cleaning=false
    if(count.Square_Bracket%2!=0 && count.hasOwnProperty("Square_Bracket")){
        resultado.textContent =`Llave restante.`;
        resultado.style.color = 'Red';
    
        Swal.fire({
            position: 'center',
            icon: 'error',
            title: `Llave restante.`,
            showConfirmButton: false,
            timer: 3000
        })
    }else{
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
    for (const token of tokens1) {
        const row = table.insertRow();
        const cell1 = row.insertCell(0);
        const cell2 = row.insertCell(1);
        const cell3 = row.insertCell(2);
        cell1.textContent = token.category;
        cell2.textContent = token.type;
        cell3.textContent = token.value;
    }

}


function cleanProgram(tokens1){
    cleaning=true
    var newT=tokens1
    indexChange.forEach(index => {
        
        newT=tokens1.concat(tokenize(tokens1.splice(index,1)[0].value))
    });
    return newT
}