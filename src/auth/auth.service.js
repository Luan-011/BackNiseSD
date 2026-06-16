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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
var common_1 = require("@nestjs/common");
var argon = require("argon2");
var library_1 = require("@prisma/client/runtime/library");
var AuthService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var AuthService = _classThis = /** @class */ (function () {
        function AuthService_1(prisma, jwt, config) {
            this.prisma = prisma;
            this.jwt = jwt;
            this.config = config;
        }
        AuthService_1.prototype.signup = function (dto) {
            return __awaiter(this, void 0, void 0, function () {
                var hash, paciente, error_1;
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, argon.hash(dto.password)];
                        case 1:
                            hash = _b.sent();
                            _b.label = 2;
                        case 2:
                            _b.trys.push([2, 5, , 6]);
                            return [4 /*yield*/, this.prisma.paciente.create({
                                    data: {
                                        email: dto.email,
                                        hash: hash,
                                        primeiroNome: dto.primeiroNome,
                                        sobreNome: dto.sobreNome
                                    },
                                })];
                        case 3:
                            paciente = _b.sent();
                            _a = {};
                            return [4 /*yield*/, this.signToken(paciente.id, paciente.email)];
                        case 4: 
                        //retornar os usuarios salvos
                        return [2 /*return*/, (_a.token = _b.sent(),
                                _a)];
                        case 5:
                            error_1 = _b.sent();
                            if (error_1 instanceof library_1.PrismaClientKnownRequestError) {
                                if (error_1.code === 'P2002') {
                                    throw new common_1.ForbiddenException('Credenciais em uso');
                                }
                            }
                            throw error_1;
                        case 6: return [2 /*return*/];
                    }
                });
            });
        };
        AuthService_1.prototype.signin = function (dto) {
            return __awaiter(this, void 0, void 0, function () {
                var paciente, compararSenha;
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, this.prisma.paciente.findUnique({
                                where: {
                                    email: dto.email
                                },
                            })];
                        case 1:
                            paciente = _b.sent();
                            //lançar exceção caso o usuario não exista
                            if (!paciente)
                                throw new common_1.ForbiddenException('Email ou senha incorreto');
                            return [4 /*yield*/, argon.verify(paciente.hash, dto.password)];
                        case 2:
                            compararSenha = _b.sent();
                            //lançar exceção caso a senha esteja errada
                            if (!compararSenha)
                                throw new common_1.ForbiddenException('Email ou senha incorreto');
                            _a = {};
                            return [4 /*yield*/, this.signToken(paciente.id, paciente.email)];
                        case 3: 
                        //mandar usuario de volta
                        return [2 /*return*/, (_a.token = _b.sent(),
                                _a.id = paciente.id,
                                _a)];
                    }
                });
            });
        };
        AuthService_1.prototype.signToken = function (pacienteId, email) {
            return __awaiter(this, void 0, void 0, function () {
                var payload, secret, token;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            payload = {
                                sub: pacienteId,
                                email: email
                            };
                            secret = this.config.get('JWT_SECRET');
                            return [4 /*yield*/, this.jwt.signAsync(payload, {
                                    expiresIn: '15m',
                                    secret: secret,
                                })];
                        case 1:
                            token = _a.sent();
                            return [2 /*return*/, token];
                    }
                });
            });
        };
        return AuthService_1;
    }());
    __setFunctionName(_classThis, "AuthService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        AuthService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return AuthService = _classThis;
}();
exports.AuthService = AuthService;
