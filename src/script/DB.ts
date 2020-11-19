function loadFromIndexedDB<T>(id: string): Promise<T> {
  const storeName = "pref";
  return new Promise(function (resolve, reject) {
    var dbRequest = indexedDB.open(storeName);

    dbRequest.onerror = function () {
      reject(Error("Error text"));
    };

    dbRequest.onupgradeneeded = function (event) {
      // Objectstore does not exist. Nothing to load
      (<any>event.target).transaction.abort();
      reject(Error("Not found"));
    };

    dbRequest.onsuccess = function (event) {
      var database = (<any>event.target).result;
      var transaction = database.transaction([storeName]);
      var objectStore = transaction.objectStore(storeName);
      var objectRequest = objectStore.get(id);

      objectRequest.onerror = function () {
        reject(Error("Error text"));
      };

      objectRequest.onsuccess = function () {
        if (objectRequest.result) resolve(objectRequest.result.value);
        else reject(Error("object not found"));
      };
    };
  });
}

function saveToIndexedDB(id: string, value: any) {
  const object = JSON.parse(`{"id":"${id}","value":${JSON.stringify(value)}}`);
  const storeName = "pref";
  return new Promise(function (resolve, reject) {
    if (!object.id) {
      reject(Error("object has no id."));
    }
    var dbRequest = indexedDB.open(storeName);

    dbRequest.onerror = function () {
      reject(Error("IndexedDB database error"));
    };

    dbRequest.onupgradeneeded = function (event) {
      var database = (<any>event.target).result;
      database.createObjectStore(storeName, {
        keyPath: "id",
      });
    };

    dbRequest.onsuccess = function (event) {
      var database = (<any>event.target).result;
      var transaction = database.transaction([storeName], "readwrite");
      var objectStore = transaction.objectStore(storeName);
      var objectRequest = objectStore.put(object); // Overwrite if exists

      objectRequest.onerror = function () {
        reject(Error("Error text"));
      };

      objectRequest.onsuccess = function () {
        resolve("Data saved OK");
      };
    };
  });
}
