import {authenticate} from '../../../middlewares.js';
import httpMocks from 'node-mocks-http';
import { sign } from 'jsonwebtoken';

const res = httpMocks.createResponse();
const next = jest.fn();

test('Requisição com token válido.', () => {
    const token = sign({data: 'test'}, process.env.TOKEN_SECRET, {expiresIn: '10s'});
    const req = httpMocks.createRequest({
        headers: {authorization: token}
    });

    authenticate(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(res.locals.login).toBeDefined();
    expect(res.locals.login).toBe('test');
});

test('Requisição sem token.', () => {
    const req = httpMocks.createRequest();

    authenticate(req, res, next);

    expect(next).not.toHaveBeenCalled();
    expect(res.statusCode).toBe(403);
});

test('Requisição com token inválido.', () => {
    const req = httpMocks.createRequest({
        headers: {authorization: 'test'}
    });

    authenticate(req, res, next);

    expect(next).not.toHaveBeenCalled();
    expect(res.statusCode).toBe(403);
});