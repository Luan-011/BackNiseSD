"use strict";
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
Object.defineProperty(exports, "__esModule", { value: true });
var class_validator_1 = require("class-validator");
var CriarDiarioDto = function () {
    var _a;
    var _instanceExtraInitializers = [];
    var _titulo_decorators;
    var _titulo_initializers = [];
    var _descricao_decorators;
    var _descricao_initializers = [];
    var _idPaciente_decorators;
    var _idPaciente_initializers = [];
    return _a = /** @class */ (function () {
            function CriarDiarioDto() {
                this.titulo = (__runInitializers(this, _instanceExtraInitializers), __runInitializers(this, _titulo_initializers, void 0));
                this.descricao = __runInitializers(this, _descricao_initializers, void 0);
                this.idPaciente = __runInitializers(this, _idPaciente_initializers, void 0);
            }
            return CriarDiarioDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _titulo_decorators = [(0, class_validator_1.IsString)()];
            _descricao_decorators = [(0, class_validator_1.IsString)()];
            _idPaciente_decorators = [(0, class_validator_1.IsNumber)(), (0, class_validator_1.IsNotEmpty)()];
            __esDecorate(null, null, _titulo_decorators, { kind: "field", name: "titulo", static: false, private: false, access: { has: function (obj) { return "titulo" in obj; }, get: function (obj) { return obj.titulo; }, set: function (obj, value) { obj.titulo = value; } }, metadata: _metadata }, _titulo_initializers, _instanceExtraInitializers);
            __esDecorate(null, null, _descricao_decorators, { kind: "field", name: "descricao", static: false, private: false, access: { has: function (obj) { return "descricao" in obj; }, get: function (obj) { return obj.descricao; }, set: function (obj, value) { obj.descricao = value; } }, metadata: _metadata }, _descricao_initializers, _instanceExtraInitializers);
            __esDecorate(null, null, _idPaciente_decorators, { kind: "field", name: "idPaciente", static: false, private: false, access: { has: function (obj) { return "idPaciente" in obj; }, get: function (obj) { return obj.idPaciente; }, set: function (obj, value) { obj.idPaciente = value; } }, metadata: _metadata }, _idPaciente_initializers, _instanceExtraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.default = CriarDiarioDto;
