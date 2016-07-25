var assert = require('assert');
function saveData(data, collectionName, db) {
    // Get the documents collection
    var collection = db.collection(collectionName);
    collection.insert(data
        , function (err, result) {
            assert.equal(err, null);

            return 1;
        });
}


exports.saveData = saveData;