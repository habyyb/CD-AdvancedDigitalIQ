import http from 'k6/http';
import { sleep, check } from 'k6';
import { SharedArray } from 'k6/data';

// Loading the people data from a JSON file
const peopleJson = open('people.json'); // Ensure this path matches the location of your people.json file
const people = JSON.parse(peopleJson);

const products = [
    "0PUK6V6EV0", "1YMWWN1N4O", "2ZYFJ3GM2N", "66VCHSJNUP", "6E92ZMYYFZ",
    "9SIQT8TOJO", "L9ECAV7KIM", "LS4PSXUNUM", "OLJCESPC7Z", "HQTGWGPNH4",
];

const categories = [
    "binoculars", "telescopes", "accessories", "assembly", "travel", "books", null,
];

export let options = {
    stages: [
        { duration: '1m', target: 100 }, // Ramp up to 100 users over 1 minute
        { duration: '3m', target: 100 }, // Stay at 100 users for 3 minutes
        { duration: '1m', target: 0 },   // Ramp down to 0 users over 1 minute
    ],
    thresholds: {
        // You can define custom thresholds for your tests here
        'http_req_duration': ['p(95)<500'], // 95% of requests must complete below 500ms
    },
};

function randomChoice(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

export default function () {
    // Visit the homepage
    const resHome = http.get('http://testsite.example.com/');
    check(resHome, { 'visited homepage successfully': (r) => r.status === 200 });
    sleep(1);

    // Browse product
    const product = randomChoice(products);
    const resProduct = http.get(`http://testsite.example.com/api/products/${product}`);
    check(resProduct, { 'browsed product successfully': (r) => r.status === 200 });
    sleep(1);

    // Get recommendations
    const category = randomChoice(categories);
    const resRecommendations = http.get(`http://testsite.example.com/api/recommendations?category=${category}`);
    check(resRecommendations, { 'got recommendations successfully': (r) => r.status === 200 });
    sleep(1);

    // Simulate adding to cart
    if (Math.random() < 0.5) { // 50% chance
        const user = `user_${Math.floor(Math.random() * 10000)}`;
        const checkoutPerson = people[Math.floor(Math.random() * people.length)];
        const payload = JSON.stringify({
            item: { productId: product, quantity: Math.floor(Math.random() * 5) + 1 },
            userId: user,
        });
        const params = { headers: { 'Content-Type': 'application/json' } };
        const resAddToCart = http.post(`http://testsite.example.com/api/cart`, payload, params);
        check(resAddToCart, { 'added to cart successfully': (r) => r.status === 200 });
        sleep(1);

        // Simulate checkout
        const checkoutPayload = JSON.stringify({
            userId: user,
            name: checkoutPerson.name,
            // Add any other required checkout fields from your people objects here
        });
        const resCheckout = http.post(`http://testsite.example.com/api/checkout`, checkoutPayload, params);
        check(resCheckout, { 'checkout completed successfully': (r) => r.status === 200 });
    }

    // Include other scenarios and checks as needed...
}
