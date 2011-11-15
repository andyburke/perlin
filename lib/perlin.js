// based on psuedo code from: http://freespace.virgin.net/hugo.elias/models/m_perlin.htm

function Noise( x, y )
{
    var seed = ( x << 18 ) | ( y << 4 ) | 49734321;
    
    // Robert Jenkins' 32 bit integer hash function.
    // See http://www.concentric.net/~ttwang/tech/inthash.htm (original)
    // and http://stackoverflow.com/questions/3428136/javascript-integer-math-incorrect-results/3428186#3428186 (JavaScript version)
    seed = ((seed + 0x7ed55d16) + (seed << 12))  & 0xffffffff;
    seed = ((seed ^ 0xc761c23c) ^ (seed >>> 19)) & 0xffffffff;
    seed = ((seed + 0x165667b1) + (seed << 5))   & 0xffffffff;
    seed = ((seed + 0xd3a2646c) ^ (seed << 9))   & 0xffffffff;
    seed = ((seed + 0xfd7046c5) + (seed << 3))   & 0xffffffff;
    seed = ((seed ^ 0xb55a4f09) ^ (seed >>> 16)) & 0xffffffff;
    return (seed & 0xfffffff) / 0x10000000;
}

function SmoothedNoise( x, y )
{
    var corners = ( Noise( x - 1, y - 1 ) + Noise( x + 1, y - 1 ) + Noise( x - 1, y + 1 ) + Noise( x + 1, y + 1 ) ) / 16;
    var sides   = ( Noise( x - 1, y ) + Noise( x + 1, y ) + Noise( x, y - 1 ) + Noise( x, y + 1 ) ) /  8;
    var center  = Noise( x, y ) / 4;
    return corners + sides + center;
}

function Interpolate( a, b, x )
{
    var ft = x * Math.PI;
    var f = ( 1.0 - Math.cos( ft ) ) * 0.5;

    return ( a * ( 1.0 - f ) ) + ( b * f );
}

function InterpolatedNoise( x, y )
{
    var x_int = Math.floor( x );
    var x_fractional = x - x_int;

    var y_int = Math.floor( y );
    var y_fractional = y - y_int;

    var v1 = SmoothedNoise( x_int, y_int );
    var v2 = SmoothedNoise( x_int + 1, y_int );
    var v3 = SmoothedNoise( x_int, y_int + 1 );
    var v4 = SmoothedNoise( x_int + 1, y_int + 1 );

    var i1 = Interpolate( v1, v2, x_fractional );
    var i2 = Interpolate( v3, v4, x_fractional );

    return Interpolate( i1, i2, y_fractional );
}

module.exports.Noise2D = function( x, y, octaves, persistence )
{
    var total = 0;

    for ( var octave = 0; octave < octaves; ++octave )
    {
        var frequency = Math.pow( 2, octave );
        var amplitude = Math.pow( persistence, octave );

        total += InterpolatedNoise( x * frequency, y * frequency, octave ) * amplitude;
    }

    return total;
}
