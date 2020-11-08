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






var usePerRun = 10;
var perPakage = 786;
var currentMode;
const outputDecimals = 1;

const firstInputHeadingText = $(".FirstInputLabel")[0];
const firstInputMetricsTexts = [$(".FirstInputMetrics1")[0], $(".FirstInputMetrics2")[0]];
const secondInputHeadingText = $(".SecondInputLabel")[0];
const secondInputMetricsTexts = [$(".SecondInputMetrics1")[0], $(".SecondInputMetrics2")[0]];
const headOutputTypeText = $(".HeadOutputType")[0];
const bodyOutputHeadingText = $(".BodyOutputHeadingText")[0];
const bodyOutputTypesTexts = [$(".BodyOutputType1")[0], $(".BodyOutputType2")[0], $(".BodyOutputType3")[0]];

const firstInputs = [$(".FirstInput1")[0], $(".FirstInput2")[0]];
const secondInputs = [$(".SecondInput1")[0], $(".SecondInput2")[0]];
const headOutputValueText = $(".HeadOutputValue")[0];
const bodyOutputValueTexts = [$(".BodyOutputValue1")[0], $(".BodyOutputValue2")[0], $(".BodyOutputValue3")[0]]

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

firstInputs[0].addEventListener("input", OnFirstInput1Changed);
firstInputs[0].addEventListener("propertychange", OnFirstInput1Changed);
firstInputs[1].addEventListener("input", OnFirstInput2Changed);
firstInputs[1].addEventListener("propertychange", OnFirstInput2Changed);
secondInputs[0].addEventListener("input", OnSecondInput1Changed);
secondInputs[0].addEventListener("propertychange", OnSecondInput1Changed);
secondInputs[1].addEventListener("input", OnSecondInput2Changed);
secondInputs[1].addEventListener("propertychange", OnSecondInput2Changed);


function InitializeMode(modeToInit){
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

currentMode = StockDepNeededMode;

InitializeMode(currentMode);