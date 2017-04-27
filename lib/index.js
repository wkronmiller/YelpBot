import yelp from 'yelp-fusion';
import irc from 'irc';
import prob from 'prob.js';
import config from '../config';

const tokenPromise = (() => {
    const {yelp: {id, secret}} = config;
    return yelp.accessToken(id, secret);
})().then(response => response.jsonBody.access_token);

const clientPromise = tokenPromise.then(token => yelp.client(token));
const searcherPromise = clientPromise.then(client => {
    const {location, radius} = config;
    function search(term) {
        return client
            .search({term,location,radius,sort_by: 'rating', open_now: true})
            .then(response => response.jsonBody)
            .then(({businesses}) => businesses);
    }
    return search;
});

function businessToLine({name, rating, url}) {
    return `${name}: ${rating}/5 stars, (${url})`;
}

function parseMessage(replySearch, message) {
    const {irc: {channel}} = config;
    const re = /yelp (.*)/g;
    if(message.indexOf('yelp') !== -1) {
        const term = re.exec(message)[1];
        console.log('searching', term);
        replySearch(term);
    }
}

async function main() {
    const rng = prob.poisson(5); // Because Avi said so
    const search = await searcherPromise;
    console.log(search);
    (() => {
        const {irc: {server, nick, channel}} = config;
        console.log(server, nick, channel);
        const client = new irc.Client(server, nick, {channels: [channel]}); 
        function replySearch(term) {
            search(term)
                .then(businesses => businesses.map(businessToLine))
                .then(lines => lines.slice(0, rng()).forEach(line => client.say(channel, line)));
        }
        client.addListener(`message${channel}`, (from, message) => parseMessage(replySearch, message));
    })();
}

main();
