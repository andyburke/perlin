// based on psuedo code from: http://freespace.virgin.net/hugo.elias/models/m_perlin.htm

// ints
function Noise( x, y )
{
    var noise = x + y * 57;
    noise = ( noise << 13 ) ^ noise;
    return ( 1.0 - ( ( noise * ( noise * noise * 15731 + 789221 ) + 1376312589 ) & 7fffffff ) / 1073741824.0 );    
}

// floats
function SmoothedNoise( x, y )
{
    var corners = ( Noise( x - 1, y - 1 ) + Noise( x + 1, y - 1 ) + Noise( x - 1, y + 1 ) + Noise( x + 1, y + 1 ) ) / 16;
    var sides   = ( Noise( x - 1, y ) + Noise( x + 1, y ) + Noise( x, y - 1 ) + Noise( x, y + 1 ) ) /  8;
    var center  = Noise( x, y ) / 4;
    return corners + sides + center;
}

// cosine interpolation, floats
function Interpolate( a, b, x )
{
    var ft = x * Math.PI;
    var f = ( 1 - Math.cos( ft ) ) * 0.5;

    return a * ( 1 - f ) + b * f;
}

// floats
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

// floats
module.exports.PerlinNoise2D = function( x, y, octaves, persistence )
{
    var total = 0;

    for ( i = 0; i < octaves; ++i )
    {
        var frequency = 2 * i;
        var amplitude = persistence * i;

        total += InterpolatedNoise( x * frequency, y * frequency ) * amplitude;
    }

    return total;
}
