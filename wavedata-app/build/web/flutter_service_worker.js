'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';
const RESOURCES = {
  "assets/AssetManifest.json": "d5bb46db80b7502fe13c7dcb81789e06",
"assets/assets/fonts/Stilu-Bold.otf": "3fad1f196137debc9eed11176f19ea6f",
"assets/assets/fonts/Stilu-BoldOblique.otf": "7bde6dd73552656f465efad2f2b5806a",
"assets/assets/fonts/Stilu-Light.otf": "0d2dfd54112541fe47ff479838203fb3",
"assets/assets/fonts/Stilu-LightOblique.otf": "94de2f79c75d243df8c58d934151620a",
"assets/assets/fonts/Stilu-Oblique.otf": "582ee19c2b654e45d739e18f0afdd2af",
"assets/assets/fonts/Stilu-Regular.otf": "40e067a4de1cd5b905aeb100b8dfb9b9",
"assets/assets/fonts/Stilu-SemiBold.otf": "5934a89ae942ca375872c0e7f5c8d6ff",
"assets/assets/fonts/Stilu-SemiBoldOblique.otf": "9e17b9544485c1bc1178207358a8aa1c",
"assets/assets/images/amazon.png": "f584a9fc2873c2ea6579562ae1af25e6",
"assets/assets/images/bg.png": "b0a9fdaed3b67d17b0b419eaaec41a5e",
"assets/assets/images/bg.svg": "8c89d703f1a1f9866d853d20fd28f036",
"assets/assets/images/calm.png": "cf69f2059daed2d109255acb66e88ccd",
"assets/assets/images/check.png": "1bc0cfc5136897f58e00cef4186a4578",
"assets/assets/images/chocolates.png": "aced7a3e7c7b90c34a00a6fa526d745a",
"assets/assets/images/crown.png": "7beeb4faff18fd5ab396ea0cfbe08084",
"assets/assets/images/done.png": "ba24ce731989a7ebd9a6ccc714558736",
"assets/assets/images/fitbit.png": "251bfa9c3dcfa10f31fe433468008b65",
"assets/assets/images/gift.png": "aa11f8d5ca6a7cd3c438df6ac9268d57",
"assets/assets/images/gift_big.png": "a9b6d4f35be71bc2b7e7edd3a741785d",
"assets/assets/images/healthquestion.png": "740f67756df071f503b09f1612350f7d",
"assets/assets/images/heart.gif": "aaf87c60003257945fcb177f711bf0a7",
"assets/assets/images/heart.png": "9f075d77900eadbdcc7ab117033f8e3e",
"assets/assets/images/home.svg": "82068f2fabd156b2bede388456964648",
"assets/assets/images/Logo.svg": "8d98aab629974a6b9a8a3e2936c2e038",
"assets/assets/images/map.png": "9428269ac4b07e8a3240ffcd7f11918b",
"assets/assets/images/map.svg": "29def77d5c7046a5c479455eb504d855",
"assets/assets/images/moods/1.png": "212a387a9263ecb8e46d712bade1bdef",
"assets/assets/images/moods/2.png": "2e3fcba1829c3e73aa00206f174c7b29",
"assets/assets/images/moods/3.png": "e22d17ec1c1db78decdbced355f43daa",
"assets/assets/images/moods/4.png": "27b477b7e22bd6745f9dc0a29074ed2a",
"assets/assets/images/moods/5.png": "9db52133ccb4d7da282c44a9454838e5",
"assets/assets/images/moods/back-no.png": "555189151cc01318b97a72c7fdca55fa",
"assets/assets/images/moods/back-yes.png": "5e5a331a0fc557b14a51e5b94e381861",
"assets/assets/images/moods/back.png": "ed6c1bb5f20d3591dff797488c31be42",
"assets/assets/images/moodspressed/1.png": "21c83a6018521485abe39e68c585c42e",
"assets/assets/images/moodspressed/2.png": "ac37b2d148f5a0e720c93e0065009165",
"assets/assets/images/moodspressed/3.png": "c5de9cbf0b5a369f1c085d03736d85a3",
"assets/assets/images/moodspressed/4.png": "b88e06fd28c05d8259177cc5787ec135",
"assets/assets/images/moodspressed/5.png": "20eca69cfe8e33a9c2336ae06e002d5f",
"assets/assets/images/moodspressed/back-no.png": "ad24dcd72e4f111d90c2019d850ecb54",
"assets/assets/images/moodspressed/back-yes.png": "5d9ba7b21f01e636587de45bbe6549f3",
"assets/assets/images/moodspressed/back.png": "8964f7cfb5b3cd8dff131b955a6e04e5",
"assets/assets/images/mydata.svg": "193dc68e7f860c86320e925841e3678d",
"assets/assets/images/person.png": "0e12645cdf47ef603a127013c06bceb9",
"assets/assets/images/plant.png": "e4d59d296d7f437c6b181f718bb13ec2",
"assets/assets/images/rewards.svg": "5662347a1edafa8c36e7ebfc98dae120",
"assets/assets/images/ribbon.png": "8678a6c2c9e5bce8f74be9501898a5ee",
"assets/assets/images/ribbon_big.png": "3c42e21286cf22ae66c5faa9b4c46598",
"assets/assets/images/running.png": "d3abdd018f2ffcdea5c91acdf3219717",
"assets/assets/images/spotify.png": "c9b1e460013f94f77ac58a46551893a8",
"assets/assets/images/support/level1completed.png": "6ec28c15da55d0ae0dbddc1a62d0da23",
"assets/assets/images/support/level1completed.svg": "8beaf16ad7d64e06bb36cb68c4519ab4",
"assets/assets/images/support/level1Incomplete.png": "1eb9a921ae010003e8b5ab811fb9c929",
"assets/assets/images/support/level1Incomplete.svg": "81e79c34b3bd309eaf156a59340464ee",
"assets/assets/images/support/level2completed.svg": "4c85b3fdf5cd9fbe3c4e3204a5ff0d74",
"assets/assets/images/support/level2Incomplete.png": "7fa19a747d3fbc6ad36d0e3372a1d19f",
"assets/assets/images/support/level2incomplete.svg": "acf6dfb0dc7fa482021a7051c7500a57",
"assets/assets/images/support.svg": "68c36433e3a3f3275247ba3cd721a0a2",
"assets/assets/images/t1.png": "0b3f151ad3e89e803340db092ca4cb00",
"assets/assets/images/t2.png": "7b2ddcfa110a3fe4bbc26249403a593f",
"assets/assets/images/t3.png": "cefda6c9b30d76e8cd5cf232d847d57f",
"assets/assets/images/welldone.gif": "f5a00ebbf48020e298c74eb642b313b5",
"assets/assets/images/winner.png": "9fdce3b18b80a16d09500f7a835de925",
"assets/assets/images/wm.png": "6222038bcc8aeb2295df767bf782b9a6",
"assets/FontManifest.json": "dc3d03800ccca4601324923c0b1d6d57",
"assets/fonts/MaterialIcons-Regular.otf": "95db9098c58fd6db106f1116bae85a0b",
"assets/NOTICES": "736d8c74d58b227512c8f39f55d1604e",
"assets/packages/cupertino_icons/assets/CupertinoIcons.ttf": "6d342eb68f170c97609e9da345464e5e",
"assets/shaders/ink_sparkle.frag": "fdf70936e34f534d0f2bd3fab37904fe",
"canvaskit/canvaskit.js": "2bc454a691c631b07a9307ac4ca47797",
"canvaskit/canvaskit.wasm": "bf50631470eb967688cca13ee181af62",
"canvaskit/profiling/canvaskit.js": "38164e5a72bdad0faa4ce740c9b8e564",
"canvaskit/profiling/canvaskit.wasm": "95a45378b69e77af5ed2bc72b2209b94",
"favicon.ico": "b6d869330c65ac5e0e8976204f3c7904",
"favicon.png": "48c89640c30e0331cfa27f22f135b7d8",
"favicon.svg": "8d98aab629974a6b9a8a3e2936c2e038",
"flutter.js": "f85e6fb278b0fd20c349186fb46ae36d",
"index.html": "a709e08a727bd5f5af3179c758de8648",
"/": "a709e08a727bd5f5af3179c758de8648",
"main.dart.js": "66cb6a1d7fc86b2bfc43a2ed378fb281",
"manifest.json": "e3e24bf28ce1f39d407ed2f7b19913b8",
"version.json": "5a3845fcd812a69b795a99bbbabcbb80"
};

// The application shell files that are downloaded before a service worker can
// start.
const CORE = [
  "main.dart.js",
"index.html",
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
        // lazily populate the cache only if the resource was successfully fetched.
        return response || fetch(event.request).then((response) => {
          if (response && Boolean(response.ok)) {
            cache.put(event.request, response.clone());
          }
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
