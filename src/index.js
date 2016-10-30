import React, { Component, PropTypes } from 'react';

export default class ReactPaint extends Component {
  static propTypes = {
    className: PropTypes.string,
    style: PropTypes.object.isRequired,
    height: PropTypes.number,
    width: PropTypes.number,
    topAdjustment: PropTypes.number,
    brushCol: PropTypes.string,
    lineWidth: PropTypes.number,
    onDraw: PropTypes.func,
    imageOnCanvas:PropTypes.instanceOf(Image)
  };
  static defaultProps = {
    className: 'react-paint',
    style: {},
    height: 500,
    width: 500,
    brushCol: '#ff6347',
    lineWidth: 10,
    topAdjustment:0,
    onDraw: () => {},
  };

  constructor(...props) {
    super(...props);

    this.state = {
      mouseDown: false,
      mouseLoc: [0, 0],
    };
  }

  componentDidMount() {
    const { brushCol, lineWidth } = this.props;

    this.context = this.canvas.getContext('2d');
    this.context.lineWidth = lineWidth;
    this.context.strokeStyle = brushCol;
    this.context.lineJoin = this.context.lineCap = 'round';

    this.canvas.width = this.canvas.offsetWidth;
    this.canvas.height = this.canvas.offsetHeight;

    this.bb = this.canvas.getBoundingClientRect();

    if(this.props.imageOnCanvas)
    this.context.drawImage(this.props.imageOnCanvas,0,0,this.props.width,this.props.height);
  }

  componentWillUpdate(nextProps) {
    const { brushCol, lineWidth } = this.props;

    if (
      brushCol !== nextProps.brushCol ||
      lineWidth !== nextProps.lineWidth
    ) {
      this.context.lineWidth = nextProps.lineWidth;
      this.context.strokeStyle = nextProps.brushCol;
    }
  }

  mouseDown = e => {
    if (!this.state.mouseDown) this.setState({ mouseDown: true });

    this.setState({
      mouseLoc: [e.pageX || e.touches[0].pageX, e.pageY || e.touches[0].pageY],
    });

    this.context.moveTo(
      (e.pageX || e.touches[0].pageX) - this.bb.left,
      (e.pageY || e.touches[0].pageY) - (this.bb.top+this.props.topAdjustment)
    );
  }

  mouseUp = () => (this.setState({ mouseDown: false }));

  mouseMove = e => {
    if (this.state.mouseDown) {
      // prevent IOS scroll when drawing
      if (e.touches) e.preventDefault();

      if (
        (e.pageX || e.touches[0].pageX) > 0 &&
        (e.pageY || e.touches[0].pageY) < this.props.height
      ) {
        this.context.lineTo(
          ((e.pageX || e.touches[0].pageX) - this.bb.left),
          ((e.pageY || e.touches[0].pageY) - (this.bb.top+this.props.topAdjustment))
        );

        this.context.stroke();
      }
    }
  }

  render() {
    const {
      width,
      height,
      onDraw,
      style,
      className,
    } = this.props;

    return (
      <div className={className}>
        <canvas
          ref={c => (this.canvas = c)}
          className={`${className}__canvas`}

          width={width}
          height={height}

          onClick={onDraw}

          style={
            Object.assign({}, style, {
              width: this.props.width,
              height: this.props.height,
            })
          }

          onMouseDown={this.mouseDown}
          onTouchStart={this.mouseDown}

          onMouseUp={this.mouseUp}
          onTouchEnd={this.mouseUp}

          onMouseMove={this.mouseMove}
          onTouchMove={this.mouseMove}
        />
      </div>
    );
  }
}


export { ReactPaint };
