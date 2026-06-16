"use strict";
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
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
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DiarioController = void 0;
var common_1 = require("@nestjs/common");
var DiarioController = function () {
    var _classDecorators = [(0, common_1.Controller)("diarios")];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _instanceExtraInitializers = [];
    var _getDiarios_decorators;
    var _criarDiario_decorators;
    var DiarioController = _classThis = /** @class */ (function () {
        function DiarioController_1(diarioService) {
            this.diarioService = (__runInitializers(this, _instanceExtraInitializers), diarioService);
        }
        DiarioController_1.prototype.getDiarios = function (idPacienteObject) {
            // Passa apenas a string, não o objeto todo
            return this.diarioService.getDiarios(idPacienteObject.idPaciente);
        };
        DiarioController_1.prototype.criarDiario = function (criarDiarioDto) {
            return this.diarioService.criardiario(criarDiarioDto);
        };
        return DiarioController_1;
    }());
    __setFunctionName(_classThis, "DiarioController");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _getDiarios_decorators = [(0, common_1.Get)(":idPaciente")];
        _criarDiario_decorators = [(0, common_1.Post)()];
        __esDecorate(_classThis, null, _getDiarios_decorators, { kind: "method", name: "getDiarios", static: false, private: false, access: { has: function (obj) { return "getDiarios" in obj; }, get: function (obj) { return obj.getDiarios; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _criarDiario_decorators, { kind: "method", name: "criarDiario", static: false, private: false, access: { has: function (obj) { return "criarDiario" in obj; }, get: function (obj) { return obj.criarDiario; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        DiarioController = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return DiarioController = _classThis;
}();
exports.DiarioController = DiarioController;
