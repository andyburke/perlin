// based on psuedo code from: http://freespace.virgin.net/hugo.elias/models/m_perlin.htm

var noiseSeeds = [
    [ 59, 15731, 789221, 1376312589, 3300452719 ],
    [ 47, 15583, 704087, 1372501313, 3300453883 ],
    [ 67, 13367, 551269, 1196500567, 3300453181 ],
    [ 61, 9173,  450311, 1143550049, 3300454933 ]
];

function Noise( x, y, seedIndex )
{
    var index = seedIndex % noiseSeeds.length;
    var noise = x + y * noiseSeeds[ index ][ 0 ];
    noise = ( noise << 13 ) ^ noise;
    return ( 1.0 - ( ( ( noise * ( noise * noise * noiseSeeds[ index ][ 1 ] + noiseSeeds[ index ][ 2 ] ) + noiseSeeds[ index ][ 3 ] ) & 0x7fffffff ) / noiseSeeds[ index ][ 4 ] ) );
}

function SmoothedNoise( x, y, seedIndex )
{
    var corners = ( Noise( x - 1, y - 1, seedIndex ) + Noise( x + 1, y - 1, seedIndex ) + Noise( x - 1, y + 1, seedIndex ) + Noise( x + 1, y + 1, seedIndex ) ) / 16;
    var sides   = ( Noise( x - 1, y, seedIndex ) + Noise( x + 1, y, seedIndex ) + Noise( x, y - 1, seedIndex ) + Noise( x, y + 1, seedIndex ) ) /  8;
    var center  = Noise( x, y, seedIndex ) / 4;
    return corners + sides + center;
}

function Interpolate( a, b, x )
{
    var ft = x * Math.PI;
    var f = ( 1.0 - Math.cos( ft ) ) * 0.5;

    return ( a * ( 1.0 - f ) ) + ( b * f );
}

function InterpolatedNoise( x, y, seedIndex )
{
    var x_int = Math.floor( x );
    var x_fractional = x - x_int;

    var y_int = Math.floor( y );
    var y_fractional = y - y_int;

    var v1 = SmoothedNoise( x_int, y_int, seedIndex );
    var v2 = SmoothedNoise( x_int + 1, y_int, seedIndex );
    var v3 = SmoothedNoise( x_int, y_int + 1, seedIndex );
    var v4 = SmoothedNoise( x_int + 1, y_int + 1, seedIndex );

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
        var amplitude = Math.pow( persistence, octave + 1 );

        total += InterpolatedNoise( x * frequency, y * frequency, octave ) * amplitude;
    }

    return total;
}
