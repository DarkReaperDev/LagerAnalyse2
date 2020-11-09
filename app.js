const products = {
    "GXT96 X3 Extraction Kit, 960 Proben" : [1, 0.1],
    "Pipettierspitzen, 1 Paket =  8x96 Spitzen " : [768, 824],
    "Vorratsbehälter 100 ml, Eppendorf" : [50, 4],
    "Vorratsbehälter 30 ml, Eppendorf" : [50, 2],
    "Deepwell-Platte 2,2 ml (Prozessplatte)" : [50, 1],
    "X100 Platte u96 PP Neutral (Eluatplatte)" : [100, 1],
    "Abfallbeutel autoklavierbar bedruckt Biohazard" : [200, 1],
    "96-Well PCR Platte, Barcode weiße Wells (50 Stück)" : [50, 1],
    "Clear Weld Heatsealer Schweißfolie, PCR Platte" : [100, 1],
    "Folie für PCR Platten (Lagerungsfolie, Metall)" : [100, 1],
    "monovette Urin gelb 10ml (512/Karton)" : [512, 95],
    "Virus Transp. Med. (200ml)" : [6, 0.72],
    "FluoroType SARS-CoV-2 plus 96er Tests" : [1, 1],
    "Universal Internal Control 2, 960 Tests" : [1, 0.08],
    "Isopropanol, puriss.,p.a., mehr als 99,8% (2,5l)" : [1, 0.05]
}

var currentMode;
const outputDecimals = 1;

class Mode{
    constructor(){
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
    }
}

var StockReachMode = new Mode();
StockReachMode.firstInputHeading = "Lagerbestand:";
StockReachMode.firstInputMetrics = ["Stück", "Pakete"];
StockReachMode.headOutputType = "Läufe verbleibend"
StockReachMode.bodyOutputHeading = "Recht bei"
StockReachMode.bodyOutputTypes = ["22 Läufen pro Woche für:", "20 Läufen pro Woche für:", "17 Läufen pro Woche für:"]
StockReachMode.calcOutputFunc = function(firstInput1, firstInput2, secondInput1, secondInput2, productName){
    //parts / per run
    let usePerRun = products[productName][1];
    let remainingRuns = firstInput1.value / usePerRun;
    let remainingWeeksHigh = firstInput1.value / (usePerRun * 22);
    let remainingWeeksMedium = firstInput1.value / (usePerRun * 20);
    let remainingWeeksLow = firstInput1.value / (usePerRun * 17);
    return [remainingRuns.toFixed(outputDecimals) + " Läufe",
     remainingWeeksHigh.toFixed(outputDecimals) + " Wochen",
     remainingWeeksMedium.toFixed(outputDecimals) + " Wochen",
     remainingWeeksLow.toFixed(outputDecimals) + " Wochen"];
}
StockReachMode.firstInputConversionFunc = function(input, isReverse, productName){
    let perPakage = products[productName][0];
    if(isReverse){
        return input * perPakage;
    }else{
        return input / perPakage;
    }
}

var NeededMode = new Mode();
NeededMode.firstInputHeading = "Bedarf für:";
NeededMode.firstInputMetrics = ["Tage ", "Wochen"];
NeededMode.bodyOutputHeading = "Benötigt bei"
NeededMode.bodyOutputTypes = ["22 Läufen pro Woche:", "20 Läufen pro Woche:", "17 Läufen pro Woche:"]
NeededMode.linkFirstInput = true;
NeededMode.calcOutputFunc = function(firstInput1, firstInput2, secondInput1, secondInput2, productName){
    //per run * runs * weeks
    let usePerRun = products[productName][1];
    let perPakage = products[productName][0];
    let neededPartsHigh = firstInput2.value * usePerRun * 22;
    let neededPartsMedium = firstInput2.value * usePerRun * 20;
    let neededPartsLow = firstInput2.value * usePerRun * 17;
    let neededPacksHigh = neededPartsHigh / perPakage;
    let neededPacksMedium = neededPartsMedium / perPakage;
    let neededPacksLow = neededPartsLow / perPakage;
    return [null,
     neededPartsHigh.toFixed(outputDecimals) + " Stück/ " + neededPacksHigh.toFixed(outputDecimals) + " Pakete",
     neededPartsMedium.toFixed(outputDecimals) + " Stück/ " + neededPacksMedium.toFixed(outputDecimals) + " Pakete",
     neededPartsLow.toFixed(outputDecimals) + " Stück/ " + neededPacksLow.toFixed(outputDecimals) + " Pakete"];
}
NeededMode.firstInputConversionFunc = function(input, isReverse, productName){
    if(isReverse){
        return input * 7;
    }else{
        return input / 7;
    }
}

var StockDepNeededMode = new Mode();
StockDepNeededMode.firstInputHeading = "Lagerbestand";
StockDepNeededMode.firstInputMetrics = ["Stück", "Pakete"];
StockDepNeededMode.secondInputHeading = "Vorrat soll reichen für:";
StockDepNeededMode.secondInputMetrics = ["Tage", "Wochen"];
StockDepNeededMode.bodyOutputHeading = "Es fehlen bei:"
StockDepNeededMode.bodyOutputTypes = ["22 Läufen pro Woche:", "20 Läufen pro Woche:", "17 Läufen pro Woche:"]
StockDepNeededMode.linkSecondInput = true;
StockDepNeededMode.calcOutputFunc = function(firstInput1, firstInput2, secondInput1, secondInput2, productName){
    let usePerRun = products[productName][1];
    let perPakage = products[productName][0];
    let neededPartsHigh = KeepAbove0(secondInput2.value * usePerRun * 22 - firstInput1.value);
    let neededPartsMedium = KeepAbove0(secondInput2.value * usePerRun * 20 - firstInput1.value);
    let neededPartsLow = KeepAbove0(secondInput2.value * usePerRun * 17 - firstInput1.value);
    let neededPacksHigh = KeepAbove0(neededPartsHigh / perPakage);
    let neededPacksMedium = KeepAbove0(neededPartsMedium / perPakage);
    let neededPacksLow = KeepAbove0(neededPartsLow / perPakage);
    return [null,
     neededPartsHigh.toFixed(outputDecimals) + " Stück/ " + neededPacksHigh.toFixed(outputDecimals) + " Pakete",
     neededPartsMedium.toFixed(outputDecimals) + " Stück/ " + neededPacksMedium.toFixed(outputDecimals) + " Pakete",
     neededPartsLow.toFixed(outputDecimals) + " Stück/ " + neededPacksLow.toFixed(outputDecimals) + " Pakete"];
}
StockDepNeededMode.firstInputConversionFunc = function(input, isReverse, productName){
    let perPakage = products[productName][0];
    if(isReverse){
        return input * perPakage;
    }else{
        return input / perPakage;
    }
}
StockDepNeededMode.secondInputConversionFunc = function(input, isReverse){
    if(isReverse){
        return input * 7;
    }else{
        return input / 7;
    }
}

function KeepAbove0(value){
    if(value < 0){return 0;}
    else{return value;}
}

function OnFirstInput1Changed(e){
    InputChanged(e.target, "FirstInput1", "FirstInput2", true, true);
}

function OnFirstInput2Changed(e){
    InputChanged(e.target, "FirstInput2", "FirstInput1", true, false);
}

function OnSecondInput1Changed(e){
    InputChanged(e.target, "SecondInput1", "SecondInput2", false, true);
}

function OnSecondInput2Changed(e){
    InputChanged(e.target, "SecondInput2", "SecondInput1", false, false);
    
}

function InputChanged(input, inputClass, oppInputClass, isFirstInput, isInput1){
    let productId = parseInt(input.id.replace(inputClass, ""));
    let productName = $("#" + String(productId) + " .ItemName")[0].innerHTML;
    let convertedValue = GetConversionFunc(isFirstInput)(input.value, !isInput1, productName);

    $("#" + String(productId) + " ." + oppInputClass)[0].value = convertedValue;
    ExecuteLinks(inputClass, oppInputClass, input.value, convertedValue, isFirstInput);

    CalcOutput(input, inputClass);    
}

function GetConversionFunc(isFirstInput){
    if(isFirstInput){
        return currentMode.firstInputConversionFunc;
    }else{
        return currentMode.secondInputConversionFunc;
    }
}

function ExecuteLinks(inputClass, oppInputClass, inputValue, oppInputValue, isFirstInput){
    if((currentMode.linkFirstInput && isFirstInput) || (currentMode.linkSecondInput && !isFirstInput)){
        ChangeAllInputsbyClass(inputClass, inputValue);
        ChangeAllInputsbyClass(oppInputClass, oppInputValue);
        let inputs = $("." + inputClass);
        for(let i = 0; i < inputs.length; i++){
            CalcOutput(inputs[i], inputClass);
        }
    }
}

function CalcOutput(input, inputClass){
    let productId = parseInt(input.id.replace(inputClass, ""));
    console.log($("#" + String(productId) + " .ItemName")[0].innerHTML)
    let outputValues = currentMode.calcOutputFunc(firstInputs[0][productId], firstInputs[1][productId], secondInputs[0][productId], secondInputs[1][productId], $("#" + String(productId) + " .ItemName")[0].innerHTML);
    outputValues = ReplaceDecimalIndicatorOnOutput(outputValues);
    SetMultiplePageTexts([headOutputValueText[productId], bodyOutputValueTexts[0][productId], bodyOutputValueTexts[1][productId], bodyOutputValueTexts[2][productId]], outputValues);
}

function ReplaceDecimalIndicatorOnOutput(outputValues){
    for(let i = 0; i < outputValues.length; i++){
        outputValues[i] = outputValues[i].replace(".", ",");
    }
    return outputValues;
}

function InitProducts(){
    let productIndex = 0;
    let ItemContainer = $(".ItemContainer")[0];
    ItemContainer.parentNode.removeChild(ItemContainer);
    for(product in products){
        ItemContainerClone = ItemContainer.cloneNode(true);
        ItemContainerClone.id = String(productIndex);        
        document.body.appendChild(ItemContainerClone);
        
        $("#" + String(productIndex) + " .ItemName")[0].innerHTML = product;
        $("#" + String(productIndex) + " .FirstInput1")[0].id = "FirstInput1" + String(productIndex);
        $("#" + String(productIndex) + " .FirstInput2")[0].id = "FirstInput2" + String(productIndex);
        $("#" + String(productIndex) + " .SecondInput1")[0].id = "SecondInput1" + String(productIndex);
        $("#" + String(productIndex) + " .SecondInput2")[0].id = "SecondInput2" + String(productIndex);
        productIndex ++;
    }
}

function InitializeMode(modeToInit){
    SetPageText(firstInputHeadingText, modeToInit.firstInputHeading);
    SetMultiplePageTexts(firstInputMetricsTexts, modeToInit.firstInputMetrics, true);
    SetPageText(secondInputHeadingText, modeToInit.secondInputHeading);
    SetMultiplePageTexts(secondInputMetricsTexts, modeToInit.secondInputMetrics, true);
    SetPageText(headOutputTypeText, modeToInit.headOutputType);
    SetPageText(bodyOutputHeadingText, modeToInit.bodyOutputHeading);
    SetMultiplePageTexts(bodyOutputTypesTexts, modeToInit.bodyOutputTypes);
    
    SetMultipleParentsVisibility(headOutputTypeText, modeToInit.headOutputType != null)
    SetMultipleParentsVisibility(firstInputHeadingText, modeToInit.firstInputHeading != null);
    SetMultipleParentsVisibility(secondInputHeadingText, modeToInit.secondInputHeading != null);
}

function ChangeMode(newMode){
    currentMode = newMode;
    InitializeMode(currentMode);
}

function SetPageText(elements, text, isLabel = false){
    let length = elements.length;
    if(length == undefined){
        if(text != null){
            if(isLabel){
                elements.childNodes[1].nodeValue = text;
            }else{
                elements.innerHTML = text;
            }
        } 
    }
    else{ 
        for(let i = 0; i < length; i++){
            if(text != null){
                if(isLabel){
                    elements[i].childNodes[1].nodeValue = text;
                }else{
                    elements[i].innerHTML = text;
                }
            } 
        }
    }
}

function SetMultiplePageTexts(elements, texts, areLabels = false){
    if(texts != null){
        elements.forEach((element, index) => {
            SetPageText(element, texts[index], areLabels);
        })
    }
}

function SetParentVisibility(parentElement, setVisible){
    if(setVisible){
        parentElement.parentElement.style.display = "";
    }else{
        parentElement.parentElement.style.display = "none";
    }
}

function SetMultipleParentsVisibility(parentElements, setVisibel){
    for(let i = 0; i < parentElements.length; i++){
        SetParentVisibility(parentElements[i], setVisibel);
    }
}

function AddListenerToAll(elements, action, listener, subElementIndex = null){
    if(subElementIndex != null){
        for (var i = 0; i < elements[subElementIndex].length; i++) {
            elements[subElementIndex][i].addEventListener(action, listener);
        }
    }
    else{
        for (var i = 0; i < elements.length; i++) {
            elements[i].addEventListener(action, listener);
        }
    }
}

function ChangeAllInputsbyClass(inputClass, valueToSet){
    let productId = 0;
    for(product in products){
        $("#" + String(productId) + " ." + inputClass)[0].value = valueToSet;
        productId ++;
    }
}

//////////////////////////////////
//Main starts here
//////////////////////////////////

currentMode = StockReachMode;
$("#StockReachModeButton")[0].style.backgroundColor = "#BDBDBD";


InitProducts();

const firstInputHeadingText = $(".FirstInputLabel");
const firstInputMetricsTexts = [$(".FirstInputMetrics1"), $(".FirstInputMetrics2")];
const secondInputHeadingText = $(".SecondInputLabel");
const secondInputMetricsTexts = [$(".SecondInputMetrics1"), $(".SecondInputMetrics2")];
const headOutputTypeText = $(".HeadOutputType");
const bodyOutputHeadingText = $(".BodyOutputHeadingText");
const bodyOutputTypesTexts = [$(".BodyOutputType1"), $(".BodyOutputType2"), $(".BodyOutputType3")];

const firstInputs = [$(".FirstInput1"), $(".FirstInput2")];
const secondInputs = [$(".SecondInput1"), $(".SecondInput2")];
const headOutputValueText = $(".HeadOutputValue");
const bodyOutputValueTexts = [$(".BodyOutputValue1"), $(".BodyOutputValue2"), $(".BodyOutputValue3")]

AddListenerToAll(firstInputs, "input", OnFirstInput1Changed, 0);
AddListenerToAll(firstInputs, "propertychange", OnFirstInput1Changed, 0);
AddListenerToAll(firstInputs, "input", OnFirstInput2Changed, 1);
AddListenerToAll(firstInputs, "propertychange", OnFirstInput2Changed, 1);
AddListenerToAll(secondInputs, "input", OnSecondInput1Changed, 0);
AddListenerToAll(secondInputs, "propertychange", OnSecondInput1Changed, 0);
AddListenerToAll(secondInputs, "input", OnSecondInput2Changed, 1);
AddListenerToAll(secondInputs, "propertychange", OnSecondInput2Changed, 1);

$("#StockReachModeButton")[0].addEventListener("click", function(e){
    ChangeMode(StockReachMode);
    e.target.style.backgroundColor = "#BDBDBD";
    $("#NeededModeButton")[0].style.backgroundColor = "#6C6C6C";
    $("#StockDepNeededModeButton")[0].style.backgroundColor = "#6C6C6C";
});

$("#NeededModeButton")[0].addEventListener("click", function(e){
    ChangeMode(NeededMode);
    e.target.style.backgroundColor = "#BDBDBD";
    $("#StockReachModeButton")[0].style.backgroundColor = "#6C6C6C";
    $("#StockDepNeededModeButton")[0].style.backgroundColor = "#6C6C6C";
});

$("#StockDepNeededModeButton")[0].addEventListener("click", function(e){
    ChangeMode(StockDepNeededMode);
    e.target.style.backgroundColor = "#BDBDBD";
    $("#NeededModeButton")[0].style.backgroundColor = "#6C6C6C";
    $("#StockReachModeButton")[0].style.backgroundColor = "#6C6C6C";
});

InitializeMode(currentMode);