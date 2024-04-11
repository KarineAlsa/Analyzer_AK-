start = program;

program = statements:statement+ {
    return statements.join('\n');
};

statement = writeStatement / writeStatement2 / writeStatement3/ funcDeclaration/ funcDeclaration2 / ifStatement /ifStatement2 / foreStatement / foreStatement2 / funcCalling / funcCalling2 / variableDeclaration
funcBody = (funcCalling / funcCalling2 / writeStatement / writeStatement2 / writeStatement3 / ifStatement / ifStatement2 / foreStatement / foreStatement2 / variableDeclaration)*;


writeStatement = "print" '"' str:identifier '";' {
    return 'console.log("' + str + '");';
}

writeStatement2 = "print" str:identifier ";" {
    return 'console.log(' + str + ');';
}

writeStatement3 = "print"  str:number ';' {
    return 'console.log("' + str + '");';
}

funcDeclaration = "func" '"' str:identifier '"' "(" ")" "{" body:funcBody "}" {
    return 'function ' + str + "()" + ' {\n' + body.join('\n') + '\n}';
}


funcDeclaration2 = "func" '"' str:identifier '"' "(" params:paramList ")" "{" body:funcBody "}" {
    return 'function ' + str + '(' + params.join(', ') + ')' + ' {\n' + body.join('\n') + '\n}';
}

paramList = firstParam:identifier otherParams:commaParam* {
    return [firstParam].concat(otherParams);
}

commaParam = "," param:identifier { return param; }


ifStatement = "if" "(" left:identifier operator:comparisonOperator right:(identifier / number) ")" "{" body:funcBody "}else{" body2:funcBody "}" {
    return 'if (' + left + ' ' + operator + ' ' + right + ') {\n' + body.join('\n') + '\n}else{\n' + body2.join('\n') + "}";
}

ifStatement2 = "if" "(" left:identifier "!" right:(identifier / number) ")" "{" body:funcBody "}else{" body2:funcBody "}" {
    return 'if (' + left + ' ' + "!=" + ' ' + right + ') {\n' + body.join('\n') + '\n}else{\n' + body2.join('\n') + "}";
}

ifStatement3 = "if" "(" left:identifier "!" right:(identifier / number) ")" "{" body3:funcBody "}" {
    return 'if (' + left + ' ' + operator + ' ' + right + ') {\n' + body.join('\n') + '\n}';
}

foreStatement = "for" "(" start:variableDeclaration left:identifier operator:comparisonOperator right:(identifier / number) ";" end:varIncrementation ")" "{" body:funcBody "}" {
    return 'for ('+start + ";" + left + ' ' + operator + ' ' + right  + ";" + end + ') {\n' + body.join('\n') + '\n}';
}

foreStatement2 = "for" "(" start:variableDeclaration left:identifier "!" right:(identifier / number) ";" end:varIncrementation ")" "{" body:funcBody "}" {
    return 'for ('+start + ";" + left + ' ' + "!" + ' ' + right  + ";" + end + ') {\n' + body.join('\n') + '\n}';
}

funcCalling = "call" '"' id:identifier '"' "(" ");" {
    return id + '()';
}

funcCalling2 = "call" '"' id:identifier '"' "(" args:argList ")" ";" {
    return id + '(' + args.join(', ') + ')';
}

argList = firstArg:arg otherArgs:("," arg:arg {return arg;})* {
    return [firstArg].concat(otherArgs);
}

arg = identifier { return text(); }


variableDeclaration =
  "int" id:identifier "=" value:number ";"{ return 'let ' + id + ' = ' + value; } /
  "string" id:identifier "=" value:string ";" { return 'let ' + id + ' = ' + value; } /
  "boolean" id:identifier "=" value:boolean ";" { return 'let ' + id + ' = ' + value; }

varIncrementation =
  id:identifier "++" { return id + '++' ; }


comparisonOperator = "==" / "<" / ">" / ">=" / "<=" { return text(); }

identifier = ([a-zA-Z]+[0-9]*[a-zA-Z]*)+ { return text(); }
number = [0-9]+ { return text(); }
string = '"' id:identifier '"' { return '"' + id + '"'; }
boolean = "true" / "false" { return text(); }





