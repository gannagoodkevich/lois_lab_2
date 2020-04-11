/*
    //////////////////////////////////////////////////////////////////////////////////////
// Лабораторная работа 2 по дисциплине ЛОИС
// Выполнена студенткой группы 721702 БГУИР Гудкевич А.В.
// Проверка того, является ли формула общезначимой (тавтологией).
// 08.04.2020
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
var answers = [];
var forms = [];

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
  reg1 = new RegExp(/\([A-Z]\)/g)
  matchings = formula.match(reg1)
  if(matchings !== null){
    formula = formula.replace("(", "")
    formula = formula.replace(")", "")
  }
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

    return table
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

function check(){
  var my_function = formula
  myFunction(my_function);
}

function myFunction(my_function) {
reg1 = new RegExp(/\(([^\)^\(]+)\)/g)
matchings = (my_function).match(reg1)
console.log(matchings)
result = my_function


for(let brackets in matchings){
  if(matchings[brackets].match(/\(\![A-Z]\)/g)){
    result = result.replace(matchings[brackets], 'o')
  }
}
//console.log("matchings")
//console.log(result.match(/\(([A-Zvo]((->)|(\|)|(\&)|(~)){1}[A-Zvo])\)/g))
while(result.match(/\(([A-Zvo]((->)|(\|)|(\&)|(~)){1}[A-Zvo])\)/g)){
  reg1 = new RegExp(/\(([A-Zvo]((->)|(\|)|(\&)|(~)){1}[A-Zvo])\)/g)
  matchings = (result).match(reg1)
  //console.log(matchings)
  for(let brackets in matchings){
      result = result.replace(matchings[brackets], 'v')
      //console.log(result)
  }
}

  //reg1 = new RegExp(/([dok]\&[dok])/g)
  console.log("result")
  console.log(result)
  return result;
}


function start() {
    var input = document.getElementById("form");
    subFormulas = new Array();
    variables = new Array();
    table = new Array();
    formula = input.elements[0].value;

    my_function = formula
    reg1 = new RegExp(/\(([^\)^\(]+)\)/g)
    matchings = (my_function).match(reg1)
    console.log(matchings)
    result = my_function


    for(let brackets in matchings){
      if(matchings[brackets].match(/\(\![A-Z]\)/g)){
        result = result.replace(matchings[brackets], 'o')
      }
    }
    //console.log("matchings")
    //console.log(result.match(/\(([A-Zvo]((->)|(\|)|(\&)|(~)){1}[A-Zvo])\)/g))
    while(result.match(/\(([A-Zvo]((->)|(\|)|(\&)|(~)){1}[A-Zvo])\)/g)){
      reg1 = new RegExp(/\(([A-Zvo]((->)|(\|)|(\&)|(~)){1}[A-Zvo])\)/g)
      matchings = (result).match(reg1)
      //console.log(matchings)
      for(let brackets in matchings){
          result = result.replace(matchings[brackets], 'v')
          //console.log(result)
      }
    }

      //reg1 = new RegExp(/([dok]\&[dok])/g)
      if((result.match(/^\([A-Z]\)$/g) !== null || result.match(/^[A-Z]$/g) !== null)){
        result = "v"
      }

      console.log("result")
      console.log(result)


    if (result === "v") {
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
      console.log(table)
      tableCreate(table)
    }
    else{
      var message = "This formula is not valid, check!!!"
      var mainDiv = document.getElementById("gener_div");
      mainDiv.innerHTML = "";
      var body = document.getElementById('table');
      body.innerHTML = ""
      var answer = document.createElement("p");
      var answerContent = document.createTextNode("Current formula is " + message);
      answer.appendChild(answerContent);
      mainDiv.appendChild(answer);
    }
}

function tableCreate(table) {
  var body = document.getElementById('table');
  body.innerHTML = ""
  var tbl = document.createElement('table');
  tbl.style.width = '70%';
  tbl.setAttribute('border', '2');
  var tbdy = document.createElement('tbody');
  for (var i = 0; i < 1; i++) {
    var tr = document.createElement('tr');
    for (var j = 0; j < table.length; j++) {
      var td = document.createElement('td');
      if(i === 0) {
        td.innerHTML = table[j][0]
      }
      td.appendChild(document.createTextNode('\u0020'));
      tr.appendChild(td)
    }
    tbdy.appendChild(tr);
  }
  for (var i = 0; i < Math.pow(2, variables.length); i++) {
    var tr = document.createElement('tr');
    for (var j = 0; j < table.length; j++) {
      var td = document.createElement('td');
      if(i === 0) {
        td.innerHTML = table[j][1][i]
      }
      else{

      td.innerHTML = table[j][1][i]

      }
      td.appendChild(document.createTextNode('\u0020'));
      tr.appendChild(td)
    }
    tbdy.appendChild(tr);
  }
  tbl.appendChild(tbdy);
  body.appendChild(tbl)
}

function testing(){
  document.getElementById('quest-form').style.display = "block";
  document.getElementById('test-btn').style.display = "none";


  getFormula(answers, forms)
  console.log(forms);
  console.log(answers);

  document.getElementById('question1').innerHTML = forms[0]
  document.getElementById('question2').innerHTML = forms[1]
  document.getElementById('question3').innerHTML = forms[2]
  document.getElementById('question4').innerHTML = forms[3]
  document.getElementById('question5').innerHTML = forms[4]
}

function fun1() {
    var rad=document.getElementsByName('r1');
    for (var i=0;i<rad.length; i++) {
        if (rad[i].checked) {
            console.log(rad[i].value)
            if((answers[0] == "false" && rad[i].value == "true") || (answers[0] == "true" && rad[i].value == "false")) {
                document.getElementById('answer1').innerHTML = "Wrong!"
            }
            if((answers[0] == "true" && rad[i].value == "true") || (answers[0] == "false" && rad[i].value == "false")) {
                document.getElementById('answer1').innerHTML = "Correct!"
            }
        }
    }
}

function fun2() {
    var rad=document.getElementsByName('r2');
    for (var i=0;i<rad.length; i++) {
        if (rad[i].checked) {
            console.log(rad[i].value)
            if((answers[1] == "false" && rad[i].value == "true") || (answers[1] == "true" && rad[i].value == "false"))  {
                document.getElementById('answer2').innerHTML = "Wrong!"
            }
            if((answers[1] == "true" && rad[i].value == "true") || (answers[1] == "false" && rad[i].value == "false")) {
                document.getElementById('answer2').innerHTML = "Correct!"
            }
        }
    }
}

function fun3() {
    var rad=document.getElementsByName('r3');
    for (var i=0;i<rad.length; i++) {
        if (rad[i].checked) {
            console.log(rad[i].value)
            if((answers[2] == "false" && rad[i].value == "true") || (answers[2] == "true" && rad[i].value == "false"))  {
                document.getElementById('answer3').innerHTML = "Wrong!"
            }
            if((answers[2] == "true" && rad[i].value == "true") || (answers[2] == "false" && rad[i].value == "false")) {
                document.getElementById('answer3').innerHTML = "Correct!"
            }
        }
    }
}

function fun4() {
    var rad=document.getElementsByName('r4');
    for (var i=0;i<rad.length; i++) {
        if (rad[i].checked) {
            console.log(rad[i].value)
            if((answers[3] == "false" && rad[i].value == "true") || (answers[3] == "true" && rad[i].value == "false")) {
                document.getElementById('answer4').innerHTML = "Wrong!"
            }
            if((answers[3] == "true" && rad[i].value == "true") || (answers[3] == "false" && rad[i].value == "false")) {
                document.getElementById('answer4').innerHTML = "Correct!"
            }
        }
    }
}

function fun5() {
    var rad=document.getElementsByName('r5');
    for (var i=0;i<rad.length; i++) {
        if (rad[i].checked) {
            console.log(rad[i].value)
            if((answers[4] == "false" && rad[i].value == "true") || (answers[4] == "true" && rad[i].value == "false")) {
                document.getElementById('answer5').innerHTML = "Wrong!"
            }
            if((answers[4] == "true" && rad[i].value == "true") || (answers[4] == "false" && rad[i].value == "false")) {
                document.getElementById('answer5').innerHTML = "Correct!"
            }
        }
    }
}

function getFormula(answers, forms){
  test_formulas = ["(((P→Q)&(Q→R))→(P→R))", "(A->A)", "((P→Q)~((!P)|Q))", "((!P)->(P->Q))", "(P~P)"]
  for (i = 0; i < 5; i++) {
        random_f = getRandomInt(test_formulas.length)
        my_function = test_formulas[random_f]
        console.log(my_function)
        result = my_function
        matchings = result.match(/\(([^\)^\(]+)\)/g)
    		console.log(matchings)
        random = getRandomInt(matchings.length)
        console.log(random);
    if(random==0){
    	console.log(result)
      answers.push("true")
    }
    else{
    	matchings = result.match(/[\|\&\!]/g)
      random = getRandomInt(matchings.length)
      console.log(matchings[random])
      var t=0;
  		result = result.replace(/\|/g, function (match) {
    		t++;
    		return (t === random)? "&" : match;
  		});
      result = result.replace(/\&/g, function (match) {
    		t++;
    		return (t === random)? "|" : match;
  		});
  		answers.push("false")
    }
    forms.push(result)
  }
}

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}
