var toFixed = require('./toFixed.js');

test('toFixed', () => {
    expect(toFixed("1000", 2)).toBe("1000");
})
