/// <reference path="../../typings/jquery/jquery.d.ts" />
/// <reference path="../../typings/es6-promise/es6-promise.d.ts" />

export function invokeApi(method: string, params: string[]): Promise<Object> {
    return new Promise<Object>( function (resolve, reject) {
        $.ajax({
            'url': 'rpc',
            'type': 'post',
            'data': {'jsonrpc': '2.0', 'method': method, 'params': params, 'id': 1},
            'headers': {'x-csrf-token': $('input[name=_csrf]').val()},
            'dataType': 'json',
            'success': function(response) {
                resolve(response.result);
            },
            'error': function (xhr, ajaxOptions, thrownError) {
                reject('Error Message: ' + thrownError + ' (' + xhr.status + ')');
            }
        });
    });
}