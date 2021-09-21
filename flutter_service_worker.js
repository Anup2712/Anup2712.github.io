'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';
const RESOURCES = {
  "version.json": "d95e9c93f1388e2fb43f7f4bb5f81c43",
"favicon.ico": "331588a1f1f602bd7bfc98683f47b816",
"index.html": "dcc052e97fab23fe4d21c78474416d88",
"/": "dcc052e97fab23fe4d21c78474416d88",
"firebase-messaging-sw.js": "a634751db10e2237040b9586f7768c1b",
"main.dart.js": "1a6265ba01c8aabafd7dff06a2e5426c",
"icons/Icon-192.png": "0da3c82c1bc9c94120fcd8d96b4b74f6",
"icons/Icon-512.png": "e0bf2c186c461a9fa5a34db9f15cd0f5",
"style.css": "f38430e23baa7e5d8b012dd3f288d25c",
"manifest.json": "3ccb9e59dc0303ceabb3e77647ec3631",
"assets/AssetManifest.json": "8853b27c43870f44c1a6c48fddfe09d8",
"assets/NOTICES": "8257b8f5d3d7da0ffe3687fea3002a8d",
"assets/FontManifest.json": "dc3d03800ccca4601324923c0b1d6d57",
"assets/packages/cupertino_icons/assets/CupertinoIcons.ttf": "6d342eb68f170c97609e9da345464e5e",
"assets/packages/fluttertoast/assets/toastify.js": "e7006a0a033d834ef9414d48db3be6fc",
"assets/packages/fluttertoast/assets/toastify.css": "a85675050054f179444bc5ad70ffc635",
"assets/packages/flutter_inappwebview/t_rex_runner/t-rex.css": "5a8d0222407e388155d7d1395a75d5b9",
"assets/packages/flutter_inappwebview/t_rex_runner/t-rex.html": "16911fcc170c8af1c5457940bd0bf055",
"assets/fonts/MaterialIcons-Regular.otf": "4e6447691c9509f7acdbf8a931a85ca1",
"assets/assets/images/splash.png": "c0a1fe02e1b9155ce3a1451040661afd",
"assets/assets/images/ic_english_dash.png": "45115ac4189104cc8b6e81d1e9bb44b5",
"assets/assets/images/taj.png": "9dd5e8d0644546f190b0712088b68178",
"assets/assets/images/webbanner.png": "80d17a9d1e9e0e512ee48006a6d9a4f4",
"assets/assets/images/ic_hindi_dash.png": "c58de2d41c7e91dfe1321e7df2928944",
"assets/assets/icons/deposit_slip_pen.png": "52a057a5d39b07dc58534531784192d7",
"assets/assets/icons/train_engine.png": "1f5f52cf99c43135847469f2aadab797",
"assets/assets/icons/app_icon.png": "96d37e35a537d6f075b19cad45dbf8b4",
"assets/assets/icons/circular_help.png": "c45c2d2ace15f88fa3b54ac465207c11",
"assets/assets/icons/train_black.png": "40ebb46cd118b3132d83d2b4c3f388bb",
"assets/assets/icons/remarks.png": "8eb65e91d462450be1a4928ba57c2b88",
"assets/assets/icons/ref_icn.png": "83ffa455466d0ec0cfcb540d9f25cc8a",
"assets/assets/icons/juncton.png": "d2cfcbfd2a9baeed9958dfb1a0f11623",
"assets/assets/icons/deposit_slip.png": "1bee17ab584012d4d23a13f0e05e8a7a",
"assets/assets/icons/share.png": "a0c195df02d52521d688d21dab558ef6",
"assets/assets/icons/edit.png": "989247b782f54819fa5652915c4abd84",
"assets/assets/icons/icon_checked.png": "6601d03c27b67b1425fa75551267b6df",
"assets/assets/icons/circular_cancel.png": "bde0d9dc6b16e54f6abf3ca040188e4e",
"assets/assets/icons/from_to.png": "8d277ddafc9c542263317ecaa97b1910",
"assets/assets/icons/bank_input.png": "67e5b3464694ab344afcbef0029aeaa8"
};

// The application shell files that are downloaded before a service worker can
// start.
const CORE = [
  "/",
"main.dart.js",
"index.html",
"assets/NOTICES",
"assets/AssetManifest.json",
"assets/FontManifest.json"];
// During install, the TEMP cache is populated with the application shell files.
self.addEventListener("install", (event) => {
  self.skipWaiting();
  return event.waitUntil(
    caches.open(TEMP).then((cache) => {
      return cache.addAll(
        CORE.map((value) => new Request(value, {'cache': 'reload'})));
    })
  );
});

// During activate, the cache is populated with the temp files downloaded in
// install. If this service worker is upgrading from one with a saved
// MANIFEST, then use this to retain unchanged resource files.
self.addEventListener("activate", function(event) {
  return event.waitUntil(async function() {
    try {
      var contentCache = await caches.open(CACHE_NAME);
      var tempCache = await caches.open(TEMP);
      var manifestCache = await caches.open(MANIFEST);
      var manifest = await manifestCache.match('manifest');
      // When there is no prior manifest, clear the entire cache.
      if (!manifest) {
        await caches.delete(CACHE_NAME);
        contentCache = await caches.open(CACHE_NAME);
        for (var request of await tempCache.keys()) {
          var response = await tempCache.match(request);
          await contentCache.put(request, response);
        }
        await caches.delete(TEMP);
        // Save the manifest to make future upgrades efficient.
        await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
        return;
      }
      var oldManifest = await manifest.json();
      var origin = self.location.origin;
      for (var request of await contentCache.keys()) {
        var key = request.url.substring(origin.length + 1);
        if (key == "") {
          key = "/";
        }
        // If a resource from the old manifest is not in the new cache, or if
        // the MD5 sum has changed, delete it. Otherwise the resource is left
        // in the cache and can be reused by the new service worker.
        if (!RESOURCES[key] || RESOURCES[key] != oldManifest[key]) {
          await contentCache.delete(request);
        }
      }
      // Populate the cache with the app shell TEMP files, potentially overwriting
      // cache files preserved above.
      for (var request of await tempCache.keys()) {
        var response = await tempCache.match(request);
        await contentCache.put(request, response);
      }
      await caches.delete(TEMP);
      // Save the manifest to make future upgrades efficient.
      await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
      return;
    } catch (err) {
      // On an unhandled exception the state of the cache cannot be guaranteed.
      console.error('Failed to upgrade service worker: ' + err);
      await caches.delete(CACHE_NAME);
      await caches.delete(TEMP);
      await caches.delete(MANIFEST);
    }
  }());
});

// The fetch handler redirects requests for RESOURCE files to the service
// worker cache.
self.addEventListener("fetch", (event) => {
  if (event.request.method !== 'GET') {
    return;
  }
  var origin = self.location.origin;
  var key = event.request.url.substring(origin.length + 1);
  // Redirect URLs to the index.html
  if (key.indexOf('?v=') != -1) {
    key = key.split('?v=')[0];
  }
  if (event.request.url == origin || event.request.url.startsWith(origin + '/#') || key == '') {
    key = '/';
  }
  // If the URL is not the RESOURCE list then return to signal that the
  // browser should take over.
  if (!RESOURCES[key]) {
    return;
  }
  // If the URL is the index.html, perform an online-first request.
  if (key == '/') {
    return onlineFirst(event);
  }
  event.respondWith(caches.open(CACHE_NAME)
    .then((cache) =>  {
      return cache.match(event.request).then((response) => {
        // Either respond with the cached resource, or perform a fetch and
        // lazily populate the cache.
        return response || fetch(event.request).then((response) => {
          cache.put(event.request, response.clone());
          return response;
        });
      })
    })
  );
});

self.addEventListener('message', (event) => {
  // SkipWaiting can be used to immediately activate a waiting service worker.
  // This will also require a page refresh triggered by the main worker.
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
    return;
  }
  if (event.data === 'downloadOffline') {
    downloadOffline();
    return;
  }
});

// Download offline will check the RESOURCES for all files not in the cache
// and populate them.
async function downloadOffline() {
  var resources = [];
  var contentCache = await caches.open(CACHE_NAME);
  var currentContent = {};
  for (var request of await contentCache.keys()) {
    var key = request.url.substring(origin.length + 1);
    if (key == "") {
      key = "/";
    }
    currentContent[key] = true;
  }
  for (var resourceKey of Object.keys(RESOURCES)) {
    if (!currentContent[resourceKey]) {
      resources.push(resourceKey);
    }
  }
  return contentCache.addAll(resources);
}

// Attempt to download the resource online before falling back to
// the offline cache.
function onlineFirst(event) {
  return event.respondWith(
    fetch(event.request).then((response) => {
      return caches.open(CACHE_NAME).then((cache) => {
        cache.put(event.request, response.clone());
        return response;
      });
    }).catch((error) => {
      return caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((response) => {
          if (response != null) {
            return response;
          }
          throw error;
        });
      });
    })
  );
}
