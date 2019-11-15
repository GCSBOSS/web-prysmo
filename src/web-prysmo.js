/* exported  WebPrysmo */

class WebPrysmo {

    constructor (url) {
        this.ee = new EventEmitter();
        this.ws = new WebSocket(url);
        this.ws.onerror = () => {
            if(typeof this.onerror == 'function')
                this.onerror();
        };
        this.queue = [];
        this.ws.onmessage = msg => {
            let { endpoint, data } = JSON.parse(msg.data);
            this.ee.emit('ep$' + endpoint, data);
        }
        this.ws.onopen = () => {
            while(this.queue.length > 0)
                this.ws.send(this.queue.pop());
        }
    }

    send(endpoint, data) {
        let msg = JSON.stringify({ endpoint, data });
        if(this.ws.readyState === WebSocket.OPEN)
            this.ws.send(msg);
        else
            this.queue.unshift(msg);
    }

    subscribe(endpoint, cb) {
        this.ee.on('ep$' + endpoint, cb);
    }

    request(endpoint, data, cb){
        this.ee.once('ep$' + endpoint, cb);
        this.send(endpoint, data);
    }

}
