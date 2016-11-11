function frequency (str) {
    var freq = {};
    for (var i=0; i < str.length; i++) {
        var char1=str[i];
        if (freq[char1]) {
            freq[char1]++;
        }
        else {
            freq[char1] = 1;
        }
    }
    return freq;
}

function sort_frequency (freq) {
    var tuples = [];
    for (var a in freq) {
        tuples.push ([freq[a], a]);
    }
    tuples.sort ();
    return tuples;
}

function buildtree (tuples) {
    while (tuples.length > 1) {
        var leastTwo = tuples.slice(0,2);
        var theRest  = tuples.slice(2);
        var combFreq = leastTwo[0][0] + leastTwo[1][0];
        var comb = [[combFreq].concat([leastTwo])];
        tuples = theRest.concat(comb);
        tuples.sort();
    }
    return comb;
}
