var format = require('./format.js');

test('money', () => {
    expect(format.money(100000))
        .toBe(' ¥ 1,000.00');
})

test('datetime', () => {
    expect(format.datetime(1487057906184))
        .toBe('2017-02-14 15:38:26');
})

test('date', () => {
    expect(format.date(1487057906184))
        .toBe('2017-02-14');
})
