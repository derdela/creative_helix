var
  background = '#212121',
  speed = 2;
var
  canvas = document.getElementById('can'),
  ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

var
  clear = render.bind(undefined, ctx, background, ctx.fillRect, [0, 0, canvas.width, canvas.height]);

var
  moveNorth = move.bind(undefined, 0, -speed),
  moveSouth = move.bind(undefined, 0, speed),
  moveEast = move.bind(undefined, speed, 0),
  moveWest = move.bind(undefined, -speed, 0),
  moves = [moveNorth, moveEast, moveSouth, moveWest];

var
  redRect = render.bind(undefined, ctx, 'red', ctx.fillRect),
  greenRect = render.bind(undefined, ctx, 'green', ctx.fillRect),
  blueRect = render.bind(undefined, ctx, 'blue', ctx.fillRect),
  cyanRect = render.bind(undefined, ctx, 'cyan', ctx.fillRect);

var
  convertPointToRect1 = convertPointToRect.bind(undefined, 1, 1),
  convertPointToRect2 = convertPointToRect.bind(undefined, 5, 5);

var
  colors = [
    '#39005a',
    '#00b8ff',
    '#ff0067',
    '#09ff00',
    '#510021',
    '#D32F2F',
    '#FF4081',
    '#303F9F',
    '#536DFE',
    '#388E3C',
    '#8BC34A',
    '#AFB42B',
    '#FFEB3B',
    '#F57C00',
    '#FF5722'
  ];


function render(context, fillStyle, strategy, args) {
  context.fillStyle = fillStyle;
  strategy.apply(context, args);
}

function drawVector(point) {
  ctx.beginPath();
  ctx.moveTo(point.x, point.y);
  ctx.strokeStyle = 'red';
  ctx.lineTo(point.x + point.acceleration[0] * 10, point.y + point.acceleration[1] * 10);
  ctx.stroke();
  return point;
}

function move(x, y, point) {
  return Object.assign({}, point, {
    x: point.x + x,
    y: point.y + y
  });
}

function accelerate(point) {
  var
    x = point.acceleration[0],
    y = point.acceleration[1],
    magnitude = Math.sqrt(x * x + y * y);

  return move(
    (x / magnitude) * point.acceleration[2], (y / magnitude) * point.acceleration[2],
    point
  );
}

function convertPointToRect(width, height, point) {
  return [
    point.x < 0 ? canvas.width - (point.x / canvas.width) : point.x % canvas.width,
    point.y < 0 ? canvas.height - (point.y / canvas.height) : point.y % canvas.height,
    width,
    height
  ];
}

function convertPointToRectSize(size, point) {
  return convertPointToRect(size, size, point);
}

function createRandomPoint(maxWidth, maxHeight) {
  var radius = Math.random() * 100 * Math.pow(-1, Math.floor(Math.random() * 3));
  return {
    x: Math.random() * maxWidth - maxWidth / 2,
    y: Math.random() * maxHeight - maxHeight / 2,
    acceleration: [0, 0, Math.random() * 4 + 0.0001],
    radius: radius,
    time: 0,
    size: Math.floor(Math.random() * 3 + 1),
    render: render.bind(undefined, ctx, colors[Math.floor(Math.random() * colors.length)], ctx.fillRect)
  };
}

function randomShiftAcceleration(point) {
  var
    changeX = (Math.random() - 0.5),
    changeY = (Math.random() - 0.5),
    reset = Math.random() > 0.999;

  return Object.assign({}, point, {
    acceleration: [
      reset ? changeX : point.acceleration[0] + changeX,
      reset ? changeY : point.acceleration[1] + changeY
    ]
  });
}

function focus(point) {
  return Object.assign({}, point, {
    acceleration: [-point.x, -point.y]
  });
}

function circle(point) {
  return Object.assign({}, point, {
    acceleration: [-Math.cos(point.time / point.radius),
      Math.sin(point.time / point.radius),
      point.acceleration[2]
    ],
    time: (point.time + 1) % (Math.PI * 2 * point.radius)
  });
}

var
  points = _.range(100)
  .map(createRandomPoint.bind(undefined, canvas.width, canvas.height));

function randomMove(point) {
  return moves[Math.floor(Math.random() * 4)](point);
}

function renderPoint(point) {
  point.render(convertPointToRectSize(point.size, point));
  return point;
}


start(points);

function start(points) {
  setTimeout(function() {
    clear();
    points = _.chain(points)
      .map(circle)
      .map(accelerate)
      .value();

    _.chain(points)
      .map(move.bind(undefined, canvas.width / 2, canvas.height / 2))
      .map(renderPoint)
      .value();

      start(points);
  }, 16);
}
