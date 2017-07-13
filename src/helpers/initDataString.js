module.exports = function (data) {
    var data = data || {};
    var html = ['<script>window.initData={};'];

    var keys = Object.keys(data);
    keys.forEach(function(key){
        html.push(`window.initData['${key}']=${JSON.stringify(data[key])};`);
    })
    html.push('</script>');

    return html.join('');
}

