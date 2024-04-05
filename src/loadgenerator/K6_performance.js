import http from 'k6/http';
import { sleep, check } from 'k6';
import { SharedArray } from 'k6/data';

const people = [
    {
        "email": "larry_sergei@example.com",
        "address": {
            "streetAddress": "1600 Amphitheatre Parkway",
            "zipCode": "94043",
            "city": "Mountain View",
            "state": "CA",
            "country": "United States"
        },
        "userCurrency": "USD",
        "creditCard": {
            "creditCardNumber": "4432-8015-6152-0454",
            "creditCardExpirationMonth": 1,
            "creditCardExpirationYear": 2039,
            "creditCardCvv": 672
        }
    },
    {
        "email": "bill@example.com",
        "address": {
            "streetAddress": "One Microsoft Way",
            "zipCode": "98052",
            "city": "Redmond",
            "state": "WA",
            "country": "United States"
        },
        "userCurrency": "USD",
        "creditCard": {
            "creditCardNumber": "4532-4211-7434-1278",
            "creditCardExpirationMonth": 2,
            "creditCardExpirationYear": 2039,
            "creditCardCvv": 114
        }
    },
    {
        "email": "steve@example.com",
        "address": {
            "streetAddress": "One Apple Park Way",
            "zipCode": "95014",
            "city": "Cupertino",
            "state": "CA",
            "country": "United States"
        },
        "userCurrency": "USD",
        "creditCard": {
            "creditCardNumber": "4532-6178-2799-1951",
            "creditCardExpirationMonth": 3,
            "creditCardExpirationYear": 2039,
            "creditCardCvv": 239
        }
    },
    {
        "email": "mark@example.com",
        "address": {
            "streetAddress": "1 Hacker Way",
            "zipCode": "94025",
            "city": "Menlo Park",
            "state": "CA",
            "country": "United States"
        },
        "userCurrency": "USD",
        "creditCard": {
            "creditCardNumber": "4539-1103-5661-7083",
            "creditCardExpirationMonth": 4,
            "creditCardExpirationYear": 2039,
            "creditCardCvv": 784
        }
    },
    {
        "email": "jeff@example.com",
        "address": {
            "streetAddress": "410 Terry Ave N",
            "zipCode": "98109",
            "city": "Seattle",
            "state": "WA",
            "country": "United States"
        },
        "userCurrency": "USD",
        "creditCard": {
            "creditCardNumber": "4916-0816-6217-7968",
            "creditCardExpirationMonth": 5,
            "creditCardExpirationYear": 2039,
            "creditCardCvv": 397
        }
    },
    {
        "email": "reed@example.com",
        "address": {
            "streetAddress": "100 Winchester Circle",
            "zipCode": "95032",
            "city": "Los Gatos",
            "state": "CA",
            "country": "United States"
        },
        "userCurrency": "USD",
        "creditCard": {
            "creditCardNumber": "4929-5431-0337-5647",
            "creditCardExpirationMonth": 6,
            "creditCardExpirationYear": 2039,
            "creditCardCvv": 793
        }
    },
    {
        "email": "tobias@example.com",
        "address": {
            "streetAddress": "150 Elgin St",
            "zipCode": "K2P1L4",
            "city": "Ottawa",
            "state": "ON",
            "country": "Canada"
        },
        "userCurrency": "CAD",
        "creditCard": {
            "creditCardNumber": "4763-1844-9699-8031",
            "creditCardExpirationMonth": 7,
            "creditCardExpirationYear": 2039,
            "creditCardCvv": 488
        }
    },
    {
        "email": "jack@example.com",
        "address": {
            "streetAddress": "1355 Market St",
            "zipCode": "94103",
            "city": "San Francisco",
            "state": "CA",
            "country": "United States"
        },
        "userCurrency": "USD",
        "creditCard": {
            "creditCardNumber": "4929-6495-8333-3657",
            "creditCardExpirationMonth": 8,
            "creditCardExpirationYear": 2039,
            "creditCardCvv": 159
        }
    },
    {
        "email": "moore@example.com",
        "address": {
            "streetAddress": "2200 Mission College Blvd",
            "zipCode": "95054",
            "city": "Santa Clara",
            "state": "CA",
            "country": "United States"
        },
        "userCurrency": "USD",
        "creditCard": {
            "creditCardNumber": "4485-4803-8707-3547",
            "creditCardExpirationMonth": 9,
            "creditCardExpirationYear": 2039,
            "creditCardCvv": 682
        }
    }
]

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
        'http_req_duration': ['p(95)<8000'], // 95% of requests must complete below 500ms
    },
};

function randomChoice(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

export default function () {
    // Visit the homepage
    const resHome = http.get('http://192.168.178.101:30003/');
    check(resHome, { 'visited homepage successfully': (r) => r.status === 200 });
    sleep(1);

    // Browse product
    const product = randomChoice(products);
    const resProduct = http.get(`http://192.168.178.101:30003/api/products/${product}`);
    check(resProduct, { 'browsed product successfully': (r) => r.status === 200 });
    sleep(1);

    // Get recommendations
    const category = randomChoice(categories);
    const resRecommendations = http.get(`http://192.168.178.101:30003/api/recommendations?category=${category}`);
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
        const resAddToCart = http.post(`http://192.168.178.101:30003/api/cart`, payload, params);
        check(resAddToCart, { 'added to cart successfully': (r) => r.status === 200 });
        sleep(1);

       /* // Simulate checkout
        const checkoutPayload = JSON.stringify({
            userId: user,
            name: checkoutPerson.name,
            // Add any other required checkout fields from your people objects here
        });
        const resCheckout = http.post(`http://192.168.178.101:30003/api/checkout`, checkoutPayload, params);
        check(resCheckout, { 'checkout completed successfully': (r) => r.status === 200 }); */
    }

    // Include other scenarios and checks as needed...
}
