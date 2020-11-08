const products = {
    "GXT96 X3 Extraction Kit, 960 Proben" : [1, 0.1],
    "Pipettierspitzen, 1 Paket =  8x96 Spitzen " : [768, 824],
    "Vorratsbehälter 100 ml, Eppendorf" : [5, 4],
    "Vorratsbehälter 30 ml, Eppendorf" : [5, 2],
    "Deepwell-Platte 2,2 ml (Prozessplatte)" : [50, 1],
    "X100 Platte u96 PP Neutral (Eluatplatte)" : [100, 1],
    "Abfallbeutel autoklavierbar bedruckt Biohazard" : [200, 1],
    "96-Well PCR Platte, Barcode weiße Wells (50 Stück)" : [50, 1],
    "Clear Weld Heatsealer Schweißfolie, PCR Platte" : [100, 1],
    "Folie für PCR Platten (Lagerungsfolie, Metall)" : [100, 1],
    "monovette Urin gelb 10ml (512/Karton)" : [64, 95],
    "Virus Transp. Med. (200ml)" : [6, 0.72],
    "FluoroType SARS-CoV-2 plus 96er Tests" : [1, 1],
    "Universal Internal Control 2, 960 Tests" : [1, 0.08],
    "Isopropanol, puriss.,p.a., >99,8% (2,5l)" : [1, 0.05]
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
    }
}

var StockReachMode = new Mode();
StockReachMode.firstInputHeading = "Lagerbestand:";
StockReachMode.firstInputMetrics = ["Stück", "Pakete"];
StockReachMode.headOutputType = "Läufe verbleibend"
StockReachMode.bodyOutputHeading = "Recht bei"
StockReachMode.bodyOutputTypes = ["22 Läufen pro Woche für:", "20 Läufen pro Woche für:", "17 Läufen pro Woche für:"]
StockReachMode.calcOutputFunc = function(firstInput1, firstInput2, secondInput1, secondInput2){
    //parts / per run
    let remainingRuns = firstInput1.value / usePerRun;
    let remainingWeeksHigh = firstInput1.value / (usePerRun * 22);
    let remainingWeeksMedium = firstInput1.value / (usePerRun * 20);
    let remainingWeeksLow = firstInput1.value / (usePerRun * 17);
    return [remainingRuns.toFixed(outputDecimals) + " Läufe",
     remainingWeeksHigh.toFixed(outputDecimals) + " Wochen",
     remainingWeeksMedium.toFixed(outputDecimals) + " Wochen",
     remainingWeeksLow.toFixed(outputDecimals) + " Wochen"];
}
StockReachMode.firstInputConversionFunc = function(input, isReverse){
    if(isReverse){
        return input * perPakage;
    }else{
        return input / perPakage;
    }
}

var NeededMode = new Mode();
NeededMode.firstInputHeading = "Bedarf für:";
NeededMode.firstInputMetrics = ["Tage", "Wochen"];
NeededMode.bodyOutputHeading = "Benötigt bei"
NeededMode.bodyOutputTypes = ["22 Läufen pro Woche:", "20 Läufen pro Woche:", "17 Läufen pro Woche:"]
NeededMode.calcOutputFunc = function(firstInput1, firstInput2, secondInput1, secondInput2){
    //per run * runs * weeks
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
NeededMode.firstInputConversionFunc = function(input, isReverse){
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
StockDepNeededMode.calcOutputFunc = function(firstInput1, firstInput2, secondInput1, secondInput2){
    let neededPartsHigh = secondInput2.value * usePerRun * 22 - firstInput1.value;
    let neededPartsMedium = secondInput2.value * usePerRun * 20 - firstInput1.value;
    let neededPartsLow = secondInput2.value * usePerRun * 17 - firstInput1.value;
    let neededPacksHigh = neededPartsHigh / perPakage;
    let neededPacksMedium = neededPartsMedium / perPakage;
    let neededPacksLow = neededPartsLow / perPakage;
    return [null,
     neededPartsHigh.toFixed(outputDecimals) + " Stück/ " + neededPacksHigh.toFixed(outputDecimals) + " Pakete",
     neededPartsMedium.toFixed(outputDecimals) + " Stück/ " + neededPacksMedium.toFixed(outputDecimals) + " Pakete",
     neededPartsLow.toFixed(outputDecimals) + " Stück/ " + neededPacksLow.toFixed(outputDecimals) + " Pakete"];
}
StockDepNeededMode.firstInputConversionFunc = function(input, isReverse){
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

function OnFirstInput1Changed(e){
    firstInputs[1].value = currentMode.firstInputConversionFunc(firstInputs[0].value, false)
    let outputValues = currentMode.calcOutputFunc(firstInputs[0], firstInputs[1], secondInputs[0], secondInputs[1]);
    SetMultiplePageTexts([headOutputValueText, bodyOutputValueTexts[0], bodyOutputValueTexts[1], bodyOutputValueTexts[2]], outputValues);
}

function OnFirstInput2Changed(e){
    firstInputs[0].value = currentMode.firstInputConversionFunc(firstInputs[1].value, true)
    let outputValues = currentMode.calcOutputFunc(firstInputs[0], firstInputs[1], secondInputs[0], secondInputs[1]);
    SetMultiplePageTexts([headOutputValueText, bodyOutputValueTexts[0], bodyOutputValueTexts[1], bodyOutputValueTexts[2]], outputValues);
}

function OnSecondInput1Changed(e){
    firstInputs[1].value = currentMode.secondInputConversionFunc(firstInputs[0].value, false)
    let outputValues = currentMode.calcOutputFunc(firstInputs[0], firstInputs[1], secondInputs[0], secondInputs[1]);
    SetMultiplePageTexts([headOutputValueText, bodyOutputValueTexts[0], bodyOutputValueTexts[1], bodyOutputValueTexts[2]], outputValues);
}

function OnSecondInput2Changed(e){
    firstInputs[0].value = currentMode.secondInputConversionFunc(firstInputs[1].value, true)
    let outputValues = currentMode.calcOutputFunc(firstInputs[0], firstInputs[1], secondInputs[0], secondInputs[1]);
    SetMultiplePageTexts([headOutputValueText, bodyOutputValueTexts[0], bodyOutputValueTexts[1], bodyOutputValueTexts[2]], outputValues);
}

function InitProducts(){
    let productIndex = 0;
    let ItemContainer = $(".ItemContainer")[0];
    for(product in products){
        ItemContainerClone = ItemContainer.cloneNode(true);
        ItemContainerClone.id = String(productIndex);
        $("#" + String(productIndex) + " .ItemName").innerHTML = product;
        
        document.body.appendChild(ItemContainerClone);
        productIndex ++;
    }
}


function InitializeMode(modeToInit){
    let productIndex = 0;
    for(product in products){

    }



    SetPageText(firstInputHeadingText, modeToInit.firstInputHeading);
    SetMultiplePageTexts(firstInputMetricsTexts, modeToInit.firstInputMetrics, true);
    SetPageText(secondInputHeadingText, modeToInit.secondInputHeading);
    SetMultiplePageTexts(secondInputMetricsTexts, modeToInit.secondInputMetrics, true);
    SetPageText(headOutputTypeText, modeToInit.headOutputType);
    SetPageText(bodyOutputHeadingText, modeToInit.bodyOutputHeading);
    SetMultiplePageTexts(bodyOutputTypesTexts, modeToInit.bodyOutputTypes);

    SetParentVisibility(headOutputTypeText, modeToInit.headOutputType)
    SetParentVisibility(firstInputHeadingText, modeToInit.firstInputHeading != null);
    SetParentVisibility(secondInputHeadingText, modeToInit.secondInputHeading != null);

    productIndex ++;
}

function SetPageText(element, text, isLabel = false){    
    if(text != null){
        if(isLabel){
            element.childNodes[1].nodeValue = text;
        }else{
            element.innerHTML = text;
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
        parentElement.parentElement.style.display = "inline";
    }else{
        parentElement.parentElement.style.display = "none";
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

//////////////////////////////////
//Main starts here
//////////////////////////////////

currentMode = StockDepNeededMode;

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

InitializeMode(currentMode);