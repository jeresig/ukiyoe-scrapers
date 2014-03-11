function xpath( expr ) {
    var nodes = [];
    var nodesSnapshot = document.evaluate( expr, document.documentElement,
        null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null );

    for ( var i=0 ; i < nodesSnapshot.snapshotLength; i++ ) {
        nodes.push( nodesSnapshot.snapshotItem(i) );
    }

    return nodes;
}
