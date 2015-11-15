/// <reference path="../../typings/jquery/jquery.d.ts" />

export function invokeApi(method: string, params: string[], successCallback: (n: number) => any): void {
    $.ajax({
        'url': 'rpc',
        'type': 'post',
        'data': {'jsonrpc': '2.0', 'method': method, 'params': params, 'id': 1},
        'headers': {'x-csrf-token': $('input[name=_csrf]').val()},
        'dataType': 'json',
        'success': successCallback
    });
}