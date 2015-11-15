/// <reference path="../../typings/jquery/jquery.d.ts" />
function invokeApi(method, params, successCallback) {
    $.ajax({
        'url': 'rpc',
        'type': 'post',
        'data': { 'jsonrpc': '2.0', 'method': method, 'params': params, 'id': 1 },
        'headers': { 'x-csrf-token': $('input[name=_csrf]').val() },
        'dataType': 'json',
        'success': successCallback
    });
}
exports.invokeApi = invokeApi;
