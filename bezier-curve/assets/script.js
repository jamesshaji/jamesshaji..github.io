const app = new PIXI.Application({ backgroundColor: 0x1099bb });
document.body.appendChild(app.view);


//Road edges and width
let pts = [];
let roadWidth = 100;


const texture = PIXI.Texture.from('assets/images/handle.jpg');
const master = new PIXI.Container();
master.name = ('Master')
app.stage.addChild(master);

//Initial Handle point with handle reference
let arr = [{ obj: '', x: 10, y: 10 }, { obj: '', x: 100, y: 100 }, { obj: '', x: 200, y: 200 }, { obj: '', x: 300, y: 300 }]

//Initialize and set initial line style
let curves = new PIXI.Graphics();
curves.lineStyle(1, 0xFFFFFF, 1);
app.stage.addChild(curves);

//add Handles to stage
for (let i = 0; i < arr.length; i++) {
    createHandle(arr[i].x, arr[i].y, i)
}


function createHandle(x, y, pos) {
    const handle = new PIXI.Sprite(texture);
    handle.name = "handle" + pos;
    handle.interactive = true;
    handle.buttonMode = true;
    handle
        .on('pointerdown', onDragStart)
        .on('pointerup', onDragEnd)
        .on('pointerupoutside', onDragEnd)
        .on('pointermove', onDragMove);

    // put handles in designated position
    handle.x = x;
    handle.y = y;

    arr[pos].obj = handle;

    // add it to the stage
    master.addChild(handle)

    drawCurve();
}

function onDragStart(event) {
    this.data = event.data;
    this.alpha = 0.5;
    this.dragging = true;
}

function onDragEnd() {
    this.alpha = 1;
    this.dragging = false;
    this.data = null;
    curves.clear();
    curves.lineStyle(1, 0xFFFFFF, 1);
    drawCurve();
}

function onDragMove(e) {
    if (this.dragging) {
        curves.clear();
        curves.lineStyle(1, 0xFFFFFF, 1);
        const newPosition = this.data.getLocalPosition(this.parent);
        this.x = newPosition.x;
        this.y = newPosition.y;

        drawCurve();
    }
}


function bezier(t, p0, p1, p2, p3) {
    //https://www.moshplant.com/direct-or/bezier/math.html
    let cX = 3 * (p1.x - p0.x);
    let bX = 3 * (p2.x - p1.x) - cX;
    let aX = p3.x - p0.x - cX - bX;
    let x = (aX * Math.pow(t, 3)) + (bX * Math.pow(t, 2)) + (cX * t) + p0.x;

    let cY = 3 * (p1.y - p0.y);
    let bY = 3 * (p2.y - p1.y) - cY;
    let aY = p3.y - p0.y - cY - bY;
    let y = (aY * Math.pow(t, 3)) + (bY * Math.pow(t, 2)) + (cY * t) + p0.y;

    return { x: x, y: y };
};


function drawCurve() {
    updatePos();
    pts = [];
    curves.moveTo(arr[0].x, arr[0].y);
    for (var i = 0; i < 1; i += 0.01) {
        var p = bezier(i, arr[0], arr[1], arr[2], arr[3]);
        curves.lineTo(p.x, p.y);
        pts.push(p);
    }

    curveLineThickness();
}

function curveLineThickness() {
    //https://stackoverflow.com/questions/133897/how-do-you-find-a-point-at-a-given-perpendicular-distance-from-a-line
    // dx = x1-x2
    // dy = y1-y2
    // dist = sqrt(dx*dx + dy*dy)
    // dx /= dist
    // dy /= dist
    // x3 = x1 + (N/2)*dy
    // y3 = y1 - (N/2)*dx
    // x4 = x1 - (N/2)*dy
    // y4 = y1 + (N/2)*dx

    for (i = 1; i < pts.length; i++) {
        let dx = pts[i - 1].x - pts[i].x;
        let dy = pts[i - 1].y - pts[i].y;

        let dist = Math.sqrt(dx * dx + dy * dy);
        dx /= dist;
        dy /= dist;

        let x3 = pts[i - 1].x + (roadWidth / 2) * dy;
        let y3 = pts[i - 1].y - (roadWidth / 2) * dx;

        let x4 = pts[i - 1].x - (roadWidth / 2) * dy;
        let y4 = pts[i - 1].y + (roadWidth / 2) * dx;

        curves.moveTo(x3, y3);
        curves.lineTo(x4, y4);
    }
}

function updatePos() {
    for (let i = 0; i < arr.length; i++) {
        let handle = arr[i].obj;
        //Initially when run handle would be null
        if (handle) {
            arr[i].x = handle.position._x;
            arr[i].y = handle.position._y;
        }
    }
}
