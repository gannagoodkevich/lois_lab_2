/*
    //////////////////////////////////////////////////////////////////////////////////////
// Лабораторная работа 2 по дисциплине ЛОИС
// Выполнена студенткой группы 621702 БГУИР Волах Д.Ю.
// Проверка того, является ли формула общезначимой (тавтологией).
// 26.03.2019
//
// https://learn.javascript.ru/
//
    //////////////////////////////////////////////////////////////////////////////////////
*/

var symbols = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', '1', '0'];
var operations = ['~', '->', '|', '&', '!'];
var constants = ['1', '0'];
var formula;
var table;
var variables;
var subFormulas;

function findInArray(array, temp) {
    for (var index = 0; index < array.length; index++) {
        if (array[index].toString() == temp.toString()) {
            return true;
        }
    }
    return false;
}

function getSubFormula(memory, subFormulas, priority) {
    var open = 0;
    var close = 0;
    var subFormula = '';

    for (var index = memory; index < formula.length; index++) {
        subFormula += formula[index];
        if (formula[index] == '(') {
            open++;
        }

        if (formula[index] == ')') {
            close++;
        }

        if (open == close) {
            if (findInArray(subFormulas, subFormula) == false) {
                var temp = new Array();
                temp.push(priority);
                temp.push(subFormula);
                subFormulas.push(temp);
            }
            return;
        }
    }
}

function findSubformulas(subFormulas, variables) {
    var numOfOpen = 0;
    for (var index = 0; index < formula.length; index++) {
        if (formula[index] == '(') {
            numOfOpen++;
            getSubFormula(index, subFormulas, numOfOpen);
        }

        else if (formula[index] == ')') {
            numOfOpen--;
        }

        else if ((findInArray(symbols, formula[index]) || findInArray(constants, formula[index])) && !findInArray(variables, formula[index])) {
            variables.push(formula[index]);
        }
    }
}

function changeConstant(constant) {
    if (constant == 0) {
        return 1;
    }
    else {
        return 0;
    }
}

function calculateNumberOfVars(variables) {
    var number = 0;
    for (var indexI = 0; indexI < variables.length; indexI++) {
        if (!findInArray(constants, variables[indexI])) {
            number++;
        }
    }
    return number;
}

function createTable(table, variables) {
    var number = calculateNumberOfVars(variables) - 1;
    var numberOfValues = number + 1;
    for (var indexI = variables.length - 1; indexI >= 0; indexI--) {
        var row = new Array();
        if (!findInArray(constants, variables[indexI])) {
            var changeConst = Math.pow(2, number);    //чередование 0 и 1 в ТИ 
            var constant = 0;
            for (var indexJ = 0; indexJ < Math.pow(2, numberOfValues); indexJ++) {
                row.push(constant);
                if ((indexJ + 1) % changeConst == 0) {
                    constant = changeConstant(constant);
                }
            }
            number--;
        } else {
            var constant;
            if (variables[indexI] == '1') {
                constant = 1;
            } else if (variables[indexI] == '0') {
                constant = 0;
            }

            for (var indexJ = 0; indexJ < Math.pow(2, numberOfValues); indexJ++) {
                row.push(constant);
            }
        }

        var field = new Array();
        field.push(variables[indexI]);
        field.push(row);
        table.push(field);
    }
    console.log(table)
}

function findIndexOfOperation(sub) {
    var open = 0;
    var close = 0;
    for (var index = 0; index < sub.length; index++) {
        if (open - close == 1) {
            if (findInArray(operations, sub[index])) {
                return index;
            }

            else if (sub[index] == '-' && sub[index + 1] == ">") {
                return index;
            }
        }

        if (sub[index] == "(") {
            open++;
        }

        if (sub[index] == ")") {
            close++;
        }
    }
}

function findColomn(variable) {
    for (var index = 0; index < table.length; index++) {
        if (table[index][0] == variable) {
            return table[index][1];
        }

    }
}

function findLeftPart(sub, indexOfOperation) {
    var leftPart = "";
    for (var index = 1; index < indexOfOperation; index++) {
        leftPart += sub[index];
    }
    return leftPart;
}

function findRightPart(sub, indexOfOperation) {
    var begin = indexOfOperation + 1;
    var rightPart = "";
    if (sub[indexOfOperation] == "-") {
        begin++;
    }

    for (var index = begin; index < sub.length - 1; index++) {
        rightPart += sub[index];
    }

    return rightPart;
}

function mainCalculations(table, subFormulas) {
    for (var index = subFormulas.length - 1; index >= 0; index--) {
        var indexOfOperation = findIndexOfOperation(subFormulas[index][1]);
        var operation = subFormulas[index][1][indexOfOperation];

        if (operation == "-" && subFormulas[index][1][indexOfOperation + 1] == ">") {
            operation += ">";
        }

        var row = new Array();
        if (operation == "!") {
            var variable = findRightPart(subFormulas[index][1], indexOfOperation);
            var col = findColomn(variable);
            for (var indexJ = 0; indexJ < col.length; indexJ++) {
                var value = changeConstant(col[indexJ]);
                row.push(value);
            }
            var field = new Array();
            field.push(subFormulas[index][1]);
            field.push(row);
            table.push(field);
        } else {
            var leftPart = findLeftPart(subFormulas[index][1], indexOfOperation);
            var rightPart = findRightPart(subFormulas[index][1], indexOfOperation);
            var colForLeftPart = findColomn(leftPart);
            var colForRightPart = findColomn(rightPart);
            var newCol = new Array();
            if (operation == "&") {
                for (var indexI = 0; indexI < colForLeftPart.length; indexI++) {
                    if (colForLeftPart[indexI] == 1 && colForRightPart[indexI] == 1) {
                        newCol.push(1);
                    }
                    else {
                        newCol.push(0);
                    }
                }
            } else if (operation == "|") {
                for (var indexI = 0; indexI < colForLeftPart.length; indexI++) {
                    if (colForLeftPart[indexI] == 0 && colForRightPart[indexI] == 0) {
                        newCol.push(0);
                    }
                    else {
                        newCol.push(1);
                    }
                }
            } else if (operation == "~") {
                for (var indexI = 0; indexI < colForLeftPart.length; indexI++) {
                    if ((colForLeftPart[indexI] == 0 && colForRightPart[indexI] == 0) || (colForLeftPart[indexI] == 1 && colForRightPart[indexI] == 1)) {
                        newCol.push(1);
                    }
                    else {
                        newCol.push(0);
                    }
                }
            } else if (operation == "->") {
                for (var indexI = 0; indexI < colForLeftPart.length; indexI++) {
                    if ((colForLeftPart[indexI] == 0 && colForRightPart[indexI] == 0) || (colForLeftPart[indexI] == 0 && colForRightPart[indexI] == 1) || (colForLeftPart[indexI] == 1 && colForRightPart[indexI] == 1)) {
                        newCol.push(1);
                    }
                    else {
                        newCol.push(0);
                    }
                }
            }
            var newField = new Array();
            newField.push(subFormulas[index][1]);
            newField.push(newCol);
            table.push(newField);
        }
    }
}

function isTautology() {
    var lastCol = table.length - 1;
    for (var index = 0; index < table[lastCol][1].length; index++) {
        if (table[lastCol][1][index] == 0) {
            return false;
        }
    }
    return true;
}

function start() {
    var input = document.getElementById("form");
    subFormulas = new Array();
    variables = new Array();
    table = new Array();
    formula = input.elements[0].value;

    if (formula == "") {
        alert("Empty field! Please, enter a formula!")
        return;
    }

    findSubformulas(subFormulas, variables);
    createTable(table, variables);
    mainCalculations(table, subFormulas);


    var message;
    if (isTautology()) {
        message = "a tautology."
    } else {
        message = "not a tautology."
    }
    var mainDiv = document.getElementById("gener_div");
    mainDiv.innerHTML = "";
    var answer = document.createElement("p");
    var answerContent = document.createTextNode("Current formula is " + message);
    answer.appendChild(answerContent);
    mainDiv.appendChild(answer);
}
//((P~Q)~((!W)&(!P)))