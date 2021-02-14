//converted with babel js to run on internet explorer
//https://babeljs.io/

var products = {
  "Amplification Plate (32x96Tests)": [32*96, (32*96)/32],
  "Processing Plate (32x48Tests)": [32*48, (32*48)/16],
  "Pipette Tip rack (16x48Tests)": [768, 768/8],
  "Magnetic Glass Particle (480Tests)": [480, 480/5],
  "Lysis Reagent (4x875 ml)": [4, 4/12],
  "Specimen Diluent (4x889 ml)": [4, 4/12],
  "Wash Reagent (4x4200 ml)": [4, 4/3],
  "Solid Waste Bag (20ST)": [20, 20/80],
  "SARS-CoV-2 Test - 480 (5Läufe)": [480, 480/5],
  "SARS-CoV-2 Test - 192 (2Läufe)": [192, 192/2],
  "SARS-COV-2 RMC posKo (16Läufe)": [16, 1],
  "Buffer Neg. Control Kit (16Läufe)": [16, 1]
};
var saveValues = {
  "Stock": [[], []],
  "Time": [[], []]
};
var currentMode;
var outputDecimals = 1;

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

var Mode = function Mode() {
  _classCallCheck(this, Mode);

  this.firstInputHeading = null;
  this.firstInputMetrics = null;
  this.secondInputHeading = null;
  this.secondInputMetrics = null;
  this.headOutputType = null;
  this.bodyOutputHeading = null;
  this.bodyOutputTypes = null;
  this.firstInputConversionFunc = null;
  this.secondInputConversionFunc = null;
  this.calcOutputFunc = null;
  this.linkFirstInput = false;
  this.linkSecondInput = false;
  this.firstInputType = null;
  this.secondInputType = null;
};

var StockReachMode = new Mode();
StockReachMode.firstInputHeading = "Lagerbestand:";
StockReachMode.firstInputMetrics = ["Stück", "Pakete"];
StockReachMode.headOutputType = "Läufe verbleibend";
StockReachMode.bodyOutputHeading = "Reicht bei";
StockReachMode.bodyOutputTypes = ["22 Läufen pro Woche für:", "20 Läufen pro Woche für:", "17 Läufen pro Woche für:"];
StockReachMode.firstInputType = "Stock";

StockReachMode.calcOutputFunc = function (firstInput1, firstInput2, secondInput1, secondInput2, productName) {
  //parts / per run
  var usePerRun = products[productName][1];
  var remainingRuns = firstInput1.value / usePerRun;
  var remainingWeeksHigh = firstInput1.value / (usePerRun * 22);
  var remainingWeeksMedium = firstInput1.value / (usePerRun * 20);
  var remainingWeeksLow = firstInput1.value / (usePerRun * 17);
  return [remainingRuns.toFixed(outputDecimals) + " Läufe", remainingWeeksHigh.toFixed(outputDecimals) + " Wochen", remainingWeeksMedium.toFixed(outputDecimals) + " Wochen", remainingWeeksLow.toFixed(outputDecimals) + " Wochen"];
};

StockReachMode.firstInputConversionFunc = function (input, isReverse, productName) {
  var perPakage = products[productName][0];

  if (isReverse) {
    return input * perPakage;
  } else {
    return input / perPakage;
  }
};

var NeededMode = new Mode();
NeededMode.firstInputHeading = "Bedarf für:";
NeededMode.firstInputMetrics = ["Tage ", "Wochen"];
NeededMode.bodyOutputHeading = "Benötigt bei";
NeededMode.bodyOutputTypes = ["22 Läufen pro Woche:", "20 Läufen pro Woche:", "17 Läufen pro Woche:"];
NeededMode.linkFirstInput = true;
NeededMode.firstInputType = "Time";

NeededMode.calcOutputFunc = function (firstInput1, firstInput2, secondInput1, secondInput2, productName) {
  //per run * runs * weeks
  var usePerRun = products[productName][1];
  var perPakage = products[productName][0];
  var neededPartsHigh = firstInput2.value * usePerRun * 22;
  var neededPartsMedium = firstInput2.value * usePerRun * 20;
  var neededPartsLow = firstInput2.value * usePerRun * 17;
  var neededPacksHigh = neededPartsHigh / perPakage;
  var neededPacksMedium = neededPartsMedium / perPakage;
  var neededPacksLow = neededPartsLow / perPakage;
  return [null, neededPartsHigh.toFixed(outputDecimals) + " Stück/ " + neededPacksHigh.toFixed(outputDecimals) + " Pakete", neededPartsMedium.toFixed(outputDecimals) + " Stück/ " + neededPacksMedium.toFixed(outputDecimals) + " Pakete", neededPartsLow.toFixed(outputDecimals) + " Stück/ " + neededPacksLow.toFixed(outputDecimals) + " Pakete"];
};

NeededMode.firstInputConversionFunc = function (input, isReverse, productName) {
  if (isReverse) {
    return input * 7;
  } else {
    return input / 7;
  }
};

var StockDepNeededMode = new Mode();
StockDepNeededMode.firstInputHeading = "Lagerbestand";
StockDepNeededMode.firstInputMetrics = ["Stück", "Pakete"];
StockDepNeededMode.secondInputHeading = "Vorrat soll reichen für:";
StockDepNeededMode.secondInputMetrics = ["Tage", "Wochen"];
StockDepNeededMode.bodyOutputHeading = "Es fehlen bei:";
StockDepNeededMode.bodyOutputTypes = ["22 Läufen pro Woche:", "20 Läufen pro Woche:", "17 Läufen pro Woche:"];
StockDepNeededMode.linkSecondInput = true;
StockDepNeededMode.firstInputType = "Stock";
StockDepNeededMode.secondInputType = "Time";

StockDepNeededMode.calcOutputFunc = function (firstInput1, firstInput2, secondInput1, secondInput2, productName) {
  var usePerRun = products[productName][1];
  var perPakage = products[productName][0];
  var neededPartsHigh = KeepAbove0(secondInput2.value * usePerRun * 22 - firstInput1.value);
  var neededPartsMedium = KeepAbove0(secondInput2.value * usePerRun * 20 - firstInput1.value);
  var neededPartsLow = KeepAbove0(secondInput2.value * usePerRun * 17 - firstInput1.value);
  var neededPacksHigh = KeepAbove0(neededPartsHigh / perPakage);
  var neededPacksMedium = KeepAbove0(neededPartsMedium / perPakage);
  var neededPacksLow = KeepAbove0(neededPartsLow / perPakage);
  return [null, neededPartsHigh.toFixed(outputDecimals) + " Stück/ " + neededPacksHigh.toFixed(outputDecimals) + " Pakete", neededPartsMedium.toFixed(outputDecimals) + " Stück/ " + neededPacksMedium.toFixed(outputDecimals) + " Pakete", neededPartsLow.toFixed(outputDecimals) + " Stück/ " + neededPacksLow.toFixed(outputDecimals) + " Pakete"];
};

StockDepNeededMode.firstInputConversionFunc = function (input, isReverse, productName) {
  var perPakage = products[productName][0];

  if (isReverse) {
    return input * perPakage;
  } else {
    return input / perPakage;
  }
};

StockDepNeededMode.secondInputConversionFunc = function (input, isReverse) {
  if (isReverse) {
    return input * 7;
  } else {
    return input / 7;
  }
};

function KeepAbove0(value) {
  if (value < 0) {
    return 0;
  } else {
    return value;
  }
}

function OnFirstInput1Changed(e) {
  InputChanged(e.target, "FirstInput1", "FirstInput2", true, true);
}

function OnFirstInput2Changed(e) {
  InputChanged(e.target, "FirstInput2", "FirstInput1", true, false);
}

function OnSecondInput1Changed(e) {
  InputChanged(e.target, "SecondInput1", "SecondInput2", false, true);
}

function OnSecondInput2Changed(e) {
  InputChanged(e.target, "SecondInput2", "SecondInput1", false, false);
}

function InputChanged(input, inputClass, oppInputClass, isFirstInput, isInput1) {
  var productId = parseInt(ReplaceAll(input.id, inputClass, ""));
  var productName = $("#" + String(productId) + " .ItemName")[0].innerHTML;
  var convertedValue = GetConversionFunc(isFirstInput)(input.value, !isInput1, productName);
  $("#" + String(productId) + " ." + oppInputClass)[0].value = convertedValue;
  ExecuteLinks(inputClass, oppInputClass, input.value, convertedValue, isFirstInput);
  CalcOutput(input, inputClass);
}

function GetConversionFunc(isFirstInput) {
  if (isFirstInput) {
    return currentMode.firstInputConversionFunc;
  } else {
    return currentMode.secondInputConversionFunc;
  }
}

function ExecuteLinks(inputClass, oppInputClass, inputValue, oppInputValue, isFirstInput) {
  if (currentMode.linkFirstInput && isFirstInput || currentMode.linkSecondInput && !isFirstInput) {
    ChangeAllInputsbyClass(inputClass, inputValue);
    ChangeAllInputsbyClass(oppInputClass, oppInputValue);
    var inputs = $("." + inputClass);

    for (var i = 0; i < inputs.length; i++) {
      CalcOutput(inputs[i], inputClass);
    }
  }
}

function CalcOutput(input, inputClass) {
  var productId = parseInt(ReplaceAll(input.id, inputClass, ""));
  console.log(productId);
  var outputValues = currentMode.calcOutputFunc(firstInputs[0][productId], firstInputs[1][productId], secondInputs[0][productId], secondInputs[1][productId], $("#" + String(productId) + " .ItemName")[0].innerHTML);
  outputValues = ReplaceDecimalIndicatorOnOutput(outputValues);
  SetMultiplePageTexts([headOutputValueText[productId], bodyOutputValueTexts[0][productId], bodyOutputValueTexts[1][productId], bodyOutputValueTexts[2][productId]], outputValues);
}

function CalcAllOutputs() {
  var productIndex = 0;

  for (product in products) {
    CalcOutput($("#" + String(productIndex) + " .FirstInput1")[0], "FirstInput1");
    productIndex++;
  }
}

function ReplaceDecimalIndicatorOnOutput(outputValues) {
  for (var i = 0; i < outputValues.length; i++) {
    if (outputValues[i] != null) {
      outputValues[i] = ReplaceAll(outputValues[i], ".", ",");
    }
  }

  return outputValues;
}

function InitProducts() {
  let productIndex = 0;
  let ItemContainer = $(".ItemContainer")[0];
  ItemContainer.parentNode.removeChild(ItemContainer);

  for (product in products) {
    ItemContainerClone = ItemContainer.cloneNode(true);
    ItemContainerClone.id = String(productIndex);
    document.body.appendChild(ItemContainerClone);
    $("#" + String(productIndex) + " .ItemName")[0].innerHTML = product;
    $("#" + String(productIndex) + " .FirstInput1")[0].id = "FirstInput1" + String(productIndex);
    $("#" + String(productIndex) + " .FirstInput2")[0].id = "FirstInput2" + String(productIndex);
    $("#" + String(productIndex) + " .SecondInput1")[0].id = "SecondInput1" + String(productIndex);
    $("#" + String(productIndex) + " .SecondInput2")[0].id = "SecondInput2" + String(productIndex);
    productIndex++;
  }
}

function InitializeMode(modeToInit) {
  SetPageText(firstInputHeadingText, modeToInit.firstInputHeading);
  SetMultiplePageTexts(firstInputMetricsTexts, modeToInit.firstInputMetrics, true);
  SetPageText(secondInputHeadingText, modeToInit.secondInputHeading);
  SetMultiplePageTexts(secondInputMetricsTexts, modeToInit.secondInputMetrics, true);
  SetPageText(headOutputTypeText, modeToInit.headOutputType);
  SetPageText(bodyOutputHeadingText, modeToInit.bodyOutputHeading);
  SetMultiplePageTexts(bodyOutputTypesTexts, modeToInit.bodyOutputTypes);
  SetMultipleParentsVisibility(headOutputTypeText, modeToInit.headOutputType != null);
  SetMultipleParentsVisibility(firstInputHeadingText, modeToInit.firstInputHeading != null);
  SetMultipleParentsVisibility(secondInputHeadingText, modeToInit.secondInputHeading != null);
  ChangeAllInputsbyClass("FirstInput1", "");
  ChangeAllInputsbyClass("FirstInput2", "");
  ChangeAllInputsbyClass("SecondInput1", "");
  ChangeAllInputsbyClass("SecondInput2", "");
  LoadValues(currentMode.firstInputType, "FirstInput1", "FirstInput2");
  LoadValues(currentMode.secondInputType, "SecondInput1", "SecondInput2");
  CalcAllOutputs();
}

function SaveValues(inputType, input1Class, input2Class) {
  if (inputType == null) {
    return;
  }

  var index = 0;

  for (product in products) {
    var value1 = $("#" + String(index) + " ." + input1Class)[0].value;
    var value2 = $("#" + String(index) + " ." + input2Class)[0].value;
    saveValues[inputType][0][index] = value1;
    saveValues[inputType][1][index] = value2;
    index++;
  }
}

function LoadValues(inputType, input1Class, input2Class) {
  if (inputType == null) {
    return;
  }

  var index = 0;

  for (product in products) {
    var value1 = saveValues[inputType][0][index];
    var value2 = saveValues[inputType][1][index];
    $("#" + String(index) + " ." + input1Class)[0].value = value1;
    $("#" + String(index) + " ." + input2Class)[0].value = value2;
    index++;
  }
}

function ChangeMode(newMode) {
  SaveValues(currentMode.firstInputType, "FirstInput1", "FirstInput2");
  SaveValues(currentMode.secondInputType, "SecondInput1", "SecondInput2");
  currentMode = newMode;
  InitializeMode(currentMode);
}

function SetPageText(elements, text) {
  var isLabel = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
  var length = elements.length;

  if (length == undefined) {
    if (text != null) {
      if (isLabel) {
        elements.childNodes[1].nodeValue = text;
      } else {
        elements.innerHTML = text;
      }
    }
  } else {
    for (var i = 0; i < length; i++) {
      if (text != null) {
        if (isLabel) {
          elements[i].childNodes[1].nodeValue = text;
        } else {
          elements[i].innerHTML = text;
        }
      }
    }
  }
}

function SetMultiplePageTexts(elements, texts) {
  var areLabels = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

  if (texts != null) {
    elements.forEach(function (element, index) {
      SetPageText(element, texts[index], areLabels);
    });
  }
}

function SetParentVisibility(parentElement, setVisible) {
  if (setVisible) {
    parentElement.parentElement.style.display = "";
  } else {
    parentElement.parentElement.style.display = "none";
  }
}

function SetMultipleParentsVisibility(parentElements, setVisibel) {
  for (var i = 0; i < parentElements.length; i++) {
    SetParentVisibility(parentElements[i], setVisibel);
  }
}

function ReplaceAll(string, oldChars, newChars){
    let index = 0;
    let length = oldChars.length;
    let newString = string;
    while(index + length < newString.length){
        if(newString.slice(index, index + length) == oldChars){
            newString = newString.slice(0, index) + newChars + newString.slice(index + oldChars.length, newString.length);
            index += newChars.length;
        }
        index ++;
    }

    return newString;
}

function AddListenerToAll(elements, action, listener) {
  var subElementIndex = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;

  if (subElementIndex != null) {
    for (var i = 0; i < elements[subElementIndex].length; i++) {
      elements[subElementIndex][i].addEventListener(action, listener);
    }
  } else {
    for (var i = 0; i < elements.length; i++) {
      elements[i].addEventListener(action, listener);
    }
  }
}

function ChangeAllInputsbyClass(inputClass, valueToSet) {
  var productId = 0;

  for (product in products) {
    $("#" + String(productId) + " ." + inputClass)[0].value = valueToSet;
    productId++;
  }
} //////////////////////////////////
//Main starts here
//////////////////////////////////


currentMode = StockReachMode;
$("#StockReachModeButton")[0].style.backgroundColor = "#6C6C6C";
$("#StockReachModeButton")[0].style.color = "white";

InitProducts();
var firstInputHeadingText = $(".FirstInputLabel");
var firstInputMetricsTexts = [$(".FirstInputMetrics1"), $(".FirstInputMetrics2")];
var secondInputHeadingText = $(".SecondInputLabel");
var secondInputMetricsTexts = [$(".SecondInputMetrics1"), $(".SecondInputMetrics2")];
var headOutputTypeText = $(".HeadOutputType");
var bodyOutputHeadingText = $(".BodyOutputHeadingText");
var bodyOutputTypesTexts = [$(".BodyOutputType1"), $(".BodyOutputType2"), $(".BodyOutputType3")];
var firstInputs = [$(".FirstInput1"), $(".FirstInput2")];
var secondInputs = [$(".SecondInput1"), $(".SecondInput2")];
var headOutputValueText = $(".HeadOutputValue");
var bodyOutputValueTexts = [$(".BodyOutputValue1"), $(".BodyOutputValue2"), $(".BodyOutputValue3")];
AddListenerToAll(firstInputs, "input", OnFirstInput1Changed, 0);
AddListenerToAll(firstInputs, "propertychange", OnFirstInput1Changed, 0);
AddListenerToAll(firstInputs, "input", OnFirstInput2Changed, 1);
AddListenerToAll(firstInputs, "propertychange", OnFirstInput2Changed, 1);
AddListenerToAll(secondInputs, "input", OnSecondInput1Changed, 0);
AddListenerToAll(secondInputs, "propertychange", OnSecondInput1Changed, 0);
AddListenerToAll(secondInputs, "input", OnSecondInput2Changed, 1);
AddListenerToAll(secondInputs, "propertychange", OnSecondInput2Changed, 1);

$("#StockReachModeButton")[0].addEventListener("click", function (e) {
  ChangeMode(StockReachMode);
  e.target.style.backgroundColor = "#6C6C6C";
  e.target.style.color = "white";
  $("#NeededModeButton")[0].style.backgroundColor = "white";
  $("#StockDepNeededModeButton")[0].style.backgroundColor = "white";
  $("#NeededModeButton")[0].style.color = "#707070";
  $("#StockDepNeededModeButton")[0].style.color = "#707070";
});
$("#NeededModeButton")[0].addEventListener("click", function (e) {
  ChangeMode(NeededMode);
  e.target.style.backgroundColor = "#6C6C6C";
  e.target.style.color = "white";
  $("#StockReachModeButton")[0].style.backgroundColor = "white";
  $("#StockDepNeededModeButton")[0].style.backgroundColor = "white";
  $("#StockReachModeButton")[0].style.color = "#707070";
  $("#StockDepNeededModeButton")[0].style.color = "#707070";
});
$("#StockDepNeededModeButton")[0].addEventListener("click", function (e) {
  ChangeMode(StockDepNeededMode);
  e.target.style.backgroundColor = "#6C6C6C";
  e.target.style.color = "white";
  $("#NeededModeButton")[0].style.backgroundColor = "white";
  $("#StockReachModeButton")[0].style.backgroundColor = "white";
  $("#NeededModeButton")[0].style.color = "#707070";
  $("#StockReachModeButton")[0].style.color = "#707070";
});
ChangeAllInputsbyClass("FirstInput1", "");
ChangeAllInputsbyClass("FirstInput2", "");
ChangeAllInputsbyClass("SecondInput1", "");
ChangeAllInputsbyClass("SecondInput2", "");
SaveValues("Stock", "FirstInput1", "FirstInput2");
SaveValues("Time", "SecondInput1", "SecondInput2");
InitializeMode(currentMode);