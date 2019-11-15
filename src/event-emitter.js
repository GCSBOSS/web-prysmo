
class EventEmitter {

    constructor(){
        this.listeners = {};
        this.nextId = 0;
    }

    on(event, handler){

        if(typeof this.listeners[event] == 'undefined')
            this.listeners[event] = {};

        var id = this.nextId;
        this.nextId++;
        this.listeners[event][id] = handler;
        return id;
    }

    emit(event, ...args){
        if(!this.listeners[event])
            return;

        let handlers = Object.values(this.listeners[event]);

        for(var h of handlers)
            h(...args);
    }

    once(event, handler){

        if(typeof this.listeners[event] == 'undefined')
            this.listeners[event] = {};

        var id = this.nextId;
        this.listeners[event][id] = (...args) => {
            handler(...args);
            this.unset(id, event);
        };

        this.nextId++;
    }

    unset(id, event){
        if(!this.listeners[event])
            return;
        var hs = this.listeners[event];
        id = String(id);
        if (id in hs)
            delete hs[id];
    }

}
