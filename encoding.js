const $ = (str) => document.querySelector(str)


//get elements
let unipolarPositiveNonReturnZeroCanvas = document.getElementById('positiveUnipolarNonReturnToZero');
let ctxUnipolar = unipolarPositiveNonReturnZeroCanvas.getContext("2d");

let manchesterCanvas = document.getElementById('manchester');
let ctxManchester = manchesterCanvas.getContext("2d");

let diffManchesterCanvas = document.getElementById('diffManchester');
let ctxDiffManchester = diffManchesterCanvas.getContext("2d");

let diffManchesterCanvas2 = document.getElementById('diffManchester2');
let ctxDiffManchester2 = diffManchesterCanvas2.getContext("2d");

let bitString = $('#bits').value != '' ? $('#bits').value : '0111000101'
console.log(bitString);

// globals
let label = '5V'
let midpointLabel = '0'
let topMargin = 40
let sideMargin = 100
let graphHeight = unipolarPositiveNonReturnZeroCanvas.height - topMargin
let graphWidth = unipolarPositiveNonReturnZeroCanvas.width - (sideMargin * 2)

// config
let marginPercetage = .035
let topPoint = topMargin + 20
let bottomPoint = unipolarPositiveNonReturnZeroCanvas.height - 20
let midPoint = graphHeight / 2 + topMargin



function graph() {
    bitString = $('#bits').value != '' ? $('#bits').value : '0111000101'
    draw()
    draw(manchesterCanvas, ctxManchester, manchesterize)
    draw(diffManchesterCanvas, ctxDiffManchester, diffManchester)
    draw(diffManchesterCanvas2, ctxDiffManchester2, diffManchester, false)

}



function draw(canvas = unipolarPositiveNonReturnZeroCanvas, ctx = ctxUnipolar, encoding = unipolarNonZero, startingVal = true) {
    console.log('graphing on', canvas);
    console.log('context is', ctx);
    console.log('with encoding', encoding);

    //setup
    
    canvas.width = window.innerWidth
    sideMargin = canvas.width * marginPercetage
    graphWidth = canvas.width - (sideMargin * 2)
    graphHeight = unipolarPositiveNonReturnZeroCanvas.height - topMargin
    console.log(canvas.width);
    console.log(graphWidth);
    bitString = $('#bits').value != '' ? $('#bits').value : '0111000101'

    //graph squares
    ctx.fillStyle = "rgb(200, 200, 200)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "rgb(180,180,180)";
    ctx.fillRect(sideMargin-1, 0, graphWidth+sideMargin, canvas.height);

    // labels
    ctx.fillStyle = "red";
    ctx.font = "16px sans-serif";
    ctx.textBaseline = "middle"
    ctx.fillText(label, sideMargin/4, topPoint)
    ctx.fillText('-' + label, sideMargin/4, bottomPoint)
    ctx.fillText(midpointLabel, sideMargin/4, midPoint)
    ctx.fillStyle = "black";
    let newArr = bitString.split('')
    getBitLabels(newArr, ctx)

    // horizontal lines
    drawLine(sideMargin, topMargin, canvas.width, topMargin, ctx, 'blue')

    drawLine(sideMargin, topPoint, canvas.width, topPoint, ctx)
    drawLine(sideMargin, bottomPoint, canvas.width, bottomPoint, ctx)
    drawLine(sideMargin, midPoint, canvas.width, midPoint, ctx)

    // vertical lines
    drawVerticalLines(newArr,ctx, canvas)


    encoding(newArr, ctx, startingVal)



}



function getBitLabels(arr = bitArray, ctx = ctxUnipolar) {
    let newArr = arr
    let sliceWidth = graphWidth / newArr.length


    let x = sideMargin;
    for (let i = 0; i < newArr.length; i++) {
        let label = newArr[i]
        ctx.fillText(label, x+sliceWidth/2, topMargin / 2);


        x += sliceWidth;
    }
    return newArr.length

}

function drawLine(x1, y1, x2, y2, ctx = ctxUnipolar, color = 'gray') {
    console.log('drawing line on', ctx);

    ctx.beginPath()
    ctx.strokeStyle = color
    ctx.moveTo(x1, y1)
    ctx.lineTo(x2, y2)
    ctx.stroke()
    ctx.closePath()
}

function drawVerticalLines(arr = bitArray, ctx = ctxUnipolar, canvas = unipolarPositiveNonReturnZeroCanvas){
    let newArr = arr
    let sliceWidth = graphWidth / newArr.length


    let x = sideMargin;
    for (let i = 0; i < newArr.length; i++) {
        
        drawLine(x,0,x, canvas.height, ctx)

        x += sliceWidth;
    }

}





function manchesterize(arr = [], ctx = unipolarCtx) {
    console.log('encoding manchester in', ctx);

    let newArr = arr
    let sliceWidth = graphWidth / newArr.length
    let x = sideMargin;
    ctx.strokeStyle = 'green'
    ctx.beginPath()
    ctx.moveTo(sideMargin, midPoint)
    for (let i = 0; i < newArr.length; i++) {
        let label = arr[i]

        if (label == '0') {
            ctx.lineTo(x, topPoint)
            ctx.lineTo(x + sliceWidth / 2, topPoint)
            ctx.lineTo(x + sliceWidth / 2, bottomPoint)
            ctx.lineTo(x + sliceWidth , bottomPoint)
            // console.log('0');

        }

        else if (label == '1') {
            ctx.lineTo(x , bottomPoint)
            ctx.lineTo(x+ sliceWidth / 2, bottomPoint)
            ctx.lineTo(x + sliceWidth / 2, topPoint)
            ctx.lineTo(x + sliceWidth, topPoint)
            // console.log('1');
        }

        x += sliceWidth;
    }
    ctx.lineTo( x, midPoint)
    

    ctx.stroke()
    ctx.closePath()
}



function unipolarNonZero(arr = [], ctx = unipolarCtx) {
    console.log('encoding unipolar in', ctx);

    let newArr = arr
    let sliceWidth = graphWidth / newArr.length
    let x = sideMargin;
    ctx.moveTo(sideMargin, midPoint)

    let wasZero = true
    ctx.strokeStyle = 'red'
    ctx.beginPath()
    for (let i = 0; i < newArr.length; i++) {
        let label = newArr[i]

        if (label == '0' && wasZero) {
            ctx.lineTo(x, midPoint)
            // console.log('0 -> 0');

        } else if (label == '0' && !wasZero) {

            ctx.lineTo(x , topPoint)
            ctx.lineTo(x , midPoint)
            wasZero = true
            // console.log('1 -> 0');
        }
        else if (label == '1' && wasZero) {
            ctx.lineTo(x , midPoint)
            ctx.lineTo(x , topPoint)
            wasZero = false
            // console.log('0 -> 1');
            // ctx.lineTo(x+ sideMargin, midPoint)
        }
        else {
            ctx.lineTo(x, topPoint)
            // console.log('1 -> 1');
        }

        x += sliceWidth;
    }
    if (wasZero) {
        ctx.lineTo(x, midPoint)
        // console.log('0 -> 0');
    } else {
        ctx.lineTo(x, topPoint)
        ctx.lineTo(x, midPoint)
        // console.log('1 -> 1');
    }
    ctx.stroke()
    ctx.closePath()
}

function diffManchester(arr = [], ctx = unipolarCtx, startingVal = true) {
    console.log('encoding diffManchester in', ctx);
    let newArr = arr
    let sliceWidth = graphWidth / newArr.length
    let x = sideMargin;


    let isNegative = startingVal
    ctx.strokeStyle = 'darkorange'
    ctx.beginPath()
    ctx.moveTo(x, midPoint)
    // ctx.lineTo()
    for (let i = 0; i < newArr.length; i++) {
        let label = newArr[i]

        if (label == '0' && !isNegative) {
            ctx.lineTo(x, bottomPoint)
            ctx.lineTo(x + sliceWidth/2 , bottomPoint)
            ctx.lineTo(x+ sliceWidth/2, topPoint)
            ctx.lineTo(x + sliceWidth, topPoint)
            // isNegative = false
            // console.log('same positive');

        } else if (label == '0' && isNegative) {

            ctx.lineTo(x, topPoint)
            ctx.lineTo(x+ sliceWidth / 2, topPoint)
            ctx.lineTo(x+ sliceWidth / 2, bottomPoint)
            ctx.lineTo(x+ sliceWidth , bottomPoint)
            // isNegative = true
            // console.log('same negative');
        }
        else if (label == '1' && !isNegative) {

            // ctx.lineTo(x, topPoint)
            ctx.lineTo(x, bottomPoint)
            ctx.lineTo(x + sliceWidth, bottomPoint)
            isNegative = true
            // console.log('inverse to positive');
            // ctx.lineTo(x+ sideMargin, midPoint)
        }
        else {
            ctx.lineTo(x, topPoint)
            ctx.lineTo(x + sliceWidth, topPoint)

            isNegative = false
            // console.log('inverse');
        }

        x += sliceWidth;
    }
    
        ctx.lineTo(x, midPoint)

    ctx.stroke()
    ctx.closePath()
}
function clearText() {
    $('#bits').value=""
    graph()
    
}

$('#bits').addEventListener('keyup',e => graph())