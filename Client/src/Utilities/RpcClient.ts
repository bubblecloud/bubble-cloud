export class RpcClient {
    url : string;

    constructor(url: string) {
        this.url = url;
    }

    invoke(method:string, params:any[]):Promise<Object> {
        var rpcUrl = this.url;
        return new Promise<Object>(function (resolve, reject) {
            $.ajax({
                'url': rpcUrl,
                'type': 'post',
                'data': {'jsonrpc': '2.0', 'method': method, 'params': params, 'id': 1},
                'headers': {'x-csrf-token': $('input[name=_csrf]').val()},
                'dataType': 'json',
                'success': function (response) {
                    resolve(JSON.parse(response.result));
                },
                'error': function (xhr, ajaxOptions, thrownError) {
                    reject('Error Message: ' + thrownError + ' (' + xhr.status + ')');
                }
            });
        });
    }
}