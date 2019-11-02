
describe("Event Emitter", function () {

    beforeEach(function () {
        cy.visit('/test/res/index.html');
        cy.window().invoke('getEventEmitter').as('EventEmitter');
    });

    describe("#on", function () {

        it('Deve registrar o listener passado', function () {
            let ee = new this.EventEmitter();
            ee.on('test', function () {});
            assert.strictEqual(typeof ee.listeners.test[0], 'function');
        });

        it('Deve registrar funções com o id correto', function () {
            let ee = new this.EventEmitter();
            ee.on('testando id', function () {});
            let id = ee.on('teste id', function () {});
            assert.strictEqual(id, 1);
            assert.strictEqual(ee.nextId, 2);
        });

        it('Deve registrar mais de um handler para o mesmo evento', function() {
            let ee = new this.EventEmitter();
            ee.on('test1', function () {});
            ee.on('test1', function () {});
            assert.strictEqual(typeof ee.listeners.test1[0], 'function');
            assert.strictEqual(typeof ee.listeners.test1[1], 'function');
        });
    });

    describe("#emit", function () {

        it('Deve executar uma função registrada', function () {
            let ee = new this.EventEmitter();
            var rodou = false;
            ee.on('event', function () {
               rodou = true;
            });
            ee.emit('event');
            assert(rodou);
        });

        it('Deve executar todas as funções registradas para o mesmo evento', function () {
            let ee = new this.EventEmitter();
            var rodou = 0;
            ee.on('event', function () { rodou++; });
            ee.on('event', function () { rodou++; });
            ee.emit('event');
            assert.strictEqual(rodou, 2);
        });

        it('Deve não falhar mesmo que o evento não tenha nenhuma função registrada', function () {
            let ee = new this.EventEmitter();
            assert.doesNotThrow( () => ee.emit('event') );
        });
    });

    describe("#once", function () {

        it('Deve registrar o listener passado', function () {
            let ee = new this.EventEmitter();
            ee.once('test', function () {});
            assert.strictEqual(typeof ee.listeners.test[0], 'function');
        });

        it('Deve responder ao emit apenas uma vez', function () {
            let ee = new this.EventEmitter();
            var rodou = 0;
            ee.once('test', function () { rodou++; });
            ee.emit('test');
            ee.emit('test');
            assert.strictEqual(rodou, 1);
        });
    });

    describe("#unset", function () {

        it('Deve remover o listener especificado', function () {
            let ee = new this.EventEmitter();
            let id = ee.on('event', function () {});
            ee.unset(id, 'event');
            assert.strictEqual(typeof ee.listeners['event'][id], 'undefined');
        });

        it ('Deve não falhar mesmo que o listener especificado não exista', function () {
            let ee = new this.EventEmitter();
            assert.doesNotThrow( () => ee.unset(2, 'event'));
        });
    });
});

describe("Web Prysmo", function() {

    beforeEach(function () {
        cy.visit('/test/res/index.html');
        cy.window().invoke('getEventEmitter').as('EventEmitter');
        cy.window().invoke('getWebPrysmo').as('WebPrysmo');
    });

    describe('constructor', function(){

        it('Deve iniciar uma conexão com o servidor', function(){

        });

        it('Deve lançar uma exceção quando falhar a conexão', function(){
            let prysmo = new this.WebPrysmo('ws://demos.kaazing.com/echo');
        });

        it('Deve enviar todas as mensagens na fila quando conectar', function(){
            let prysmo = new this.WebPrysmo('ws://demos.kaazing.com/echo');
                prysmo.send('mensagem1', 'teste');
                prysmo.send('mensagem2', 'testando');
                assert.strictEqual(prysmo.queue, 2);
        });
    });

    describe('#send', function(){

        it('Deve enviar uma mensagem para o servidor', function () {
            let prysmo = new this.WebPrysmo('ws://demos.kaazing.com/echo');
            let msg = prysmo.send('test', 'testando');
            assert.strictEqual(msg, 'string');
        });
    });

    describe('#request', function(){

        it('Deve executar um handler uma vez', function () {
            let prysmo = new this.WebPrysmo('ws://demos.kaazing.com/echo');
            prysmo.request('test', 'testando', function() {});
            assert.strictEqual(typeof prysmo.listeners['test'], 'function');
        });
    });

    describe('#subscribe', function(){

        it('Deve solicitar um listener', function () {
            let prysmo = new this.WebPrysmo('ws://demos.kaazing.com/echo');
            prysmo.subscribe('test', function() {});
            assert.strictEqual(typeof prysmo.listeners.test[0], 'function');
        });
    });

    after(function() {
        cy.window().then(win => {
            if (typeof win.__coverage__ == 'object')
                cy.writeFile('.nyc_output/out.json', JSON.stringify(win.__coverage__));
        });
    });
});
