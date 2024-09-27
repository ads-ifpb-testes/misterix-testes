import httpMocks from 'node-mocks-http';
import { checkLoginModel } from '../../../middlewares';

const res = httpMocks.createResponse();
const next = jest.fn();

test('Modelo válido', () => {
    const req = httpMocks.createRequest({
        body: {login: 'test', password: '123456'}
    });

    checkLoginModel(req, res, next);

    expect(res.locals.user).toBeDefined();
    expect(next).toHaveBeenCalled();
});

describe('Testando campos', () => {
    test('Modelo inválido sem login', () => {
        const req = httpMocks.createRequest({
            body: {password: '123456'}
        });
    
        checkLoginModel(req, res, next);
    
        expect(res.statusCode).toBe(400);
        expect(next).not.toHaveBeenCalled();
    });

    test('Modelo inválido sem senha', () => {
        const req = httpMocks.createRequest({
            body: {login: 'test'}
        });
    
        checkLoginModel(req, res, next);
    
        expect(res.statusCode).toBe(400);
        expect(next).not.toHaveBeenCalled();
    });

    test('Modelo inválido com senha menor que 6 caracteres', () => {
        const req = httpMocks.createRequest({
            body: {login: 'test', password: '123'}
        });
    
        checkLoginModel(req, res, next);
    
        expect(res.statusCode).toBe(400);
        expect(next).not.toHaveBeenCalled();
    });
})