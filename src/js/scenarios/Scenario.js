import Scene from "../canvas/Scene";
import { deg2rad } from "../utils/MathUtils";
import { RotatingArc } from "../canvas/shapes/arcs";

const drawLine = ( context, x, y, length, angle ) =>
{
    context.save();
    context.beginPath();

    context.translate( x, y );
    context.rotate( angle );

    context.moveTo( -length / 2, 0 );
    context.lineTo( length / 2, 0 );
    context.stroke();

    context.closePath();
    context.restore();
};

export default class Scenario extends Scene
{
    constructor( id )
    {
        super( id );

        this.drawGradation();

        this.arcs = [];
        this.nArcs = 10;
        for ( let i = 0; i < this.nArcs; i++ )
        {
            const arc_ = new RotatingArc(
                this.width / 2,
                this.height / 2,
                this.mainRadius + ( i - this.nArcs / 2 ) * this.deltaRadius,
                i != 0 && i != this.nArcs - 1 ? deg2rad( Math.random() * 360 ) : 0,
                i != 0 && i != this.nArcs - 1 ? deg2rad( Math.random() * 360 ) : deg2rad( 360 )
            );
            this.arcs.push( arc_ );
        }

        this.params[ 'line-width' ] = 2;
        this.params.speed = 1;
        this.params.color = "#ffffff";
        if ( this.debug.active )
        {
            this.debugFolder.add( this.params, 'line-width', 1, 10 ).onChange( () => this.drawUpdate() );
            this.debugFolder.add( this.params, 'speed', -2, 2, .25 );
            this.debugFolder.addColor( this.params, 'color' );
        }
    }

    resize ()
    {
        super.resize();

        this.mainRadius = this.width < this.height ? this.width : this.height;
        this.mainRadius *= .5;
        this.mainRadius *= .65;
        this.deltaRadius = this.mainRadius * .075;

        if ( !!this.arcs )
        {
            this.arcs.forEach( ( e, index ) =>
            {
                e.x = this.width / 2;
                e.y = this.height / 2;
                e.radius = this.mainRadius + ( index - this.arcs.length / 2 ) * this.deltaRadius;
            } );
        }

        this.drawUpdate();
    }

    update ()
    {
        if ( !super.update() ) return;
        this.drawUpdate();
    }

    drawUpdate ()
    {
        this.clear();
        this.drawClock();
    }

    drawGradation ()
    {
        const nGradation_ = 12;
        for ( let i = 0; i < nGradation_; i++ )
        {
            const angle_ = 2 * Math.PI * i / nGradation_ + Math.PI / 2;
            const x_ = this.width / 2 + ( this.mainRadius - this.deltaRadius / 2 ) * Math.cos( angle_ );
            const y_ = this.height / 2 + ( this.mainRadius - this.deltaRadius / 2 ) * Math.sin( angle_ );
            const length_ = this.deltaRadius * ( this.nArcs - 1 );
            drawLine( this.context, x_, y_, length_, angle_ );
        }
    }

    drawClock ()
    {
        const now = new Date();
        const seconds = now.getSeconds();
        const minutes = now.getMinutes();
        const hours = now.getHours();

        const radius = this.mainRadius;
        const centerX = this.width / 2;
        const centerY = this.height / 2;

        // seconds
        this.context.beginPath();
        this.context.moveTo( centerX, centerY );
        this.context.arc( centerX, centerY, radius + 40, -Math.PI / 2, 2 * Math.PI * ( seconds / 60 ) - Math.PI / 2 );
        this.context.lineTo( centerX, centerY );
        this.context.closePath();
        this.context.fillStyle = '#0000ff';
        this.context.fill();

        // min
        this.context.beginPath();
        this.context.moveTo( centerX, centerY );
        this.context.arc( centerX, centerY, radius + 20, -Math.PI / 2, 2 * Math.PI * ( minutes / 60 ) - Math.PI / 2 );
        this.context.lineTo( centerX, centerY );
        this.context.closePath();
        this.context.fillStyle = '#00ff00';
        this.context.fill();

        // hours
        this.context.beginPath();
        this.context.moveTo( centerX, centerY );
        let adjustedHours = hours % 12;
        if ( adjustedHours === 0 )
        {
            adjustedHours = 12;
        }
        this.context.arc( centerX, centerY, radius, -Math.PI / 2, 2 * Math.PI * ( adjustedHours / 12 ) - Math.PI / 2 );
        this.context.lineTo( centerX, centerY );
        this.context.closePath();
        this.context.fillStyle = '#ff0000';
        this.context.fill();

        // center circle
        this.context.beginPath();
        this.context.arc( centerX, centerY, radius - 20, 0, 2 * Math.PI );
        this.context.fillStyle = '#000000';
        this.context.fill();

        for ( let i = 0; i < 12; i++ )
        {
            const angle = 2 * Math.PI * i / 12;
            const tickLength = 20;
            const tickX = centerX + ( radius - 40 ) * Math.cos( angle );
            const tickY = centerY + ( radius - 40 ) * Math.sin( angle );
            this.context.beginPath();
            this.context.moveTo( tickX, tickY );
            this.context.lineTo( tickX + tickLength * Math.cos( angle ), tickY + tickLength * Math.sin( angle ) );
            this.context.strokeStyle = '#ffffff';
            this.context.lineWidth = 2;
            this.context.stroke();
        }

        for ( let i = 0; i < 60; i++ )
        {
            if ( i % 5 === 0 ) continue;
            const angle = 2 * Math.PI * i / 60;
            const tickLength = 10;
            const tickX = centerX + ( radius - 30 ) * Math.cos( angle );
            const tickY = centerY + ( radius - 30 ) * Math.sin( angle );
            this.context.beginPath();
            this.context.moveTo( tickX, tickY );
            this.context.lineTo( tickX + tickLength * Math.cos( angle ), tickY + tickLength * Math.sin( angle ) );
            this.context.strokeStyle = '#ffffff';
            this.context.lineWidth = 1;
            this.context.stroke();
        }
    }
}