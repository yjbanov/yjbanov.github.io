registerPaint('demo', class {
  static get inputProperties() {
    return ['--some-data'];
  }

  paint(ctx, geom, properties) {
    const topWidthPerc = 80;
    const topHeightPerc = 20;
    ctx.beginPath();
    ctx.fillStyle = 'black';
    const topWidth = geom.width * topWidthPerc/100;
    const left = (geom.width - topWidth)/ 2;
    ctx.moveTo(left, -200);
    ctx.lineTo(geom.width - left, -200);
    ctx.lineTo(geom.width, geom.height * topHeightPerc/100);
    ctx.lineTo(geom.width / 2, geom.height);
    ctx.lineTo(0, geom.height * topHeightPerc/100);
    ctx.closePath();
    ctx.fill();
  }
});
