importScripts("https://www.gstatic.com/firebasejs/7.23.0/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/7.23.0/firebase-messaging.js");
firebase.initializeApp({
    apiKey: "AIzaSyDK0S3g2Qi93eWg9Oxm5eecTM7zlFAqoSA",
    authDomain: "coverage-c5baf.firebaseapp.com",
    projectId: "coverage-c5baf",
    storageBucket: "coverage-c5baf.appspot.com",
    messagingSenderId: "770857829588",
    appId: "1:770857829588:web:527e257d9ba1cba9912741",
    measurementId: "G-MPXC00798P"
});
const messaging = firebase.messaging();
messaging.setBackgroundMessageHandler(function (payload) {
    const promiseChain = clients
        .matchAll({
            type: "window",
            includeUncontrolled: true
        })
        .then(windowClients => {
            for (let i = 0; i < windowClients.length; i++) {
                const windowClient = windowClients[i];
                windowClient.postMessage(payload);
            }
        })
        .then(() => {
            const title = payload.notification.title;
            const options = {
                body: payload.notification.score
              };
            return registration.showNotification(title, options);
        });
    return promiseChain;
});
self.addEventListener('notificationclick', function (event) {
    console.log('notification received: ', event)
});