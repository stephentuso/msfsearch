function queryDataPhonetic(data, query_string) {
    query_string = convertToPhonetic(query_string)
    var query_results = []
    for (var i=0; i<data.length; i++) {
        for (var j=0; j<data[i].length; j++) {
            if (data[i][j]["phonetic"] == query_string) {
                query_results.push(data[i])
            }
        }
    }
    return query_results
}
// Fuzzy search

// function queryData(data, query_string) {
//     var output_data = []
//     var options = {
//         caseSensitive: false,
//         includeScore: true,
//         shouldSort: true,
//         tokenize: false,
//         keys: ["original", "phonetic", "column_name"],
//     }
//     for (var i=0; i<data.length; i++) {
//         var fuse = new Fuse(data[i], options)
//         var result = fuse.search(query_string)
//         output_data = output_data.concat(result)
//     }
//     console.log(output_data)
// }
