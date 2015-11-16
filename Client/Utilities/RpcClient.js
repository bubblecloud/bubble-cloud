/// <reference path="../../typings/jquery/jquery.d.ts" />
/// <reference path="../../typings/es6-promise/es6-promise.d.ts" />
var RpcClient = (function () {
    function RpcClient(url) {
        this.url = url;
    }
    RpcClient.prototype.invoke = function (method, params) {
        var rpcUrl = this.url;
        return new Promise(function (resolve, reject) {
            $.ajax({
                'url': rpcUrl,
                'type': 'post',
                'data': { 'jsonrpc': '2.0', 'method': method, 'params': params, 'id': 1 },
                'headers': { 'x-csrf-token': $('input[name=_csrf]').val() },
                'dataType': 'json',
                'success': function (response) {
                    resolve(JSON.parse(response.result));
                },
                'error': function (xhr, ajaxOptions, thrownError) {
                    reject('Error Message: ' + thrownError + ' (' + xhr.status + ')');
                }
            });
        });
    };
    return RpcClient;
})();
