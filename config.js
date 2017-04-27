module.exports = {
    yelp: {
        id: process.env.YELP_ID,
        secret: process.env.YELP_SECRET,
    },
    location: 'Troy, Ny',
    radius: 4000, // meters
    irc: {
        server: 'irc.rpis.ec',
        nick: 'yelp-bot',
        channel: '#foodie',
    },
};
