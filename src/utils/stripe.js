import { loadStripe } from '@stripe/stripe-js';

let stripePromise;

const getStripe = () => {
    if (!stripePromise)
        stripePromise = loadStripe("pk_test_51LveSODWNtDMUrv1hOWpUo8ohebG4fqdIyzrlrvkiOZ4GJLQSJBejnovHVxKPkary1YhC4J65NAGqscxtD996RNj00QzJO06eR");
    return stripePromise;
}

export default getStripe;