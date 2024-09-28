import httpMocks from 'node-mocks-http';
import {logIn} from '../../controller/userController.js';
import User from '../../model/mongooseUser.js';
import Legend from '../../model/mongooseLegend.js';
import mongoose from 'mongoose';
import { getLegends, getMyLegends, postLegend, searchLegends } from '../../controller/legendController.js';
jest.mock('../../data/redis.js', () => {
    return {
        del: jest.fn(),
        set: jest.fn(),
        get: () => undefined,
    }
});

beforeAll(async () => {
    await User.create({login: 'user1', password: '123456'});
    await Legend.create({
        title: 'bicho papão', 
        description: 'bicho papão', 
        type: 'monstro', 
        location: {
            type: 'Point',
            coordinates: [1, 1]
        },
        postedBy: 'user1'
    });
});

afterAll(async () => {
    jest.clearAllMocks();
});

test('Cadastrar usuário', async () => {
    const req = httpMocks.createRequest();
    const res = httpMocks.createResponse({
        locals: {user: {login: 'user', password: '123456'}}
    });

    await logIn(req, res);
    const count = await User.countDocuments();

    expect(count).toBe(2);
    expect(res.statusCode).toBe(201);
});

test('Logar usuário', async () => {
    const req = httpMocks.createRequest();
    const res = httpMocks.createResponse({
        locals: {user: {login: 'user', password: '123456'}}
    });

    await logIn(req, res);
    const count = await User.countDocuments();

    expect(count).toBe(2);
    expect(res.statusCode).toBe(200);
});

test('Adicionando Lenda', async () => {
    const req = httpMocks.createRequest();
    const res = httpMocks.createResponse({
        locals: {
            login: 'user',
            legend: {
                title: 'loira do banheiro', 
                description: 'loira do banheiro', 
                type: 'espírito', 
                location: {
                    type: 'Point',
                    coordinates: [1, 1]
                }
            }
        }
    });

    await postLegend(req, res);
    const count = await Legend.countDocuments();

    expect(count).toBe(2);
    expect(res.statusCode).toBe(201);
});

test('Buscar lendas', async () => {
    const req = httpMocks.createRequest();
    const res = httpMocks.createResponse();

    await getLegends(req, res);

    expect(res.statusCode).toBe(200);
    expect(res._getJSONData().length).toBe(2);
})

test('Buscar minhas lendas', async () => {
    const req = httpMocks.createRequest();
    const res = httpMocks.createResponse({
        locals: {login: 'user'}
    });

    await getMyLegends(req, res);
    const legends = res._getJSONData();

    expect(res.statusCode).toBe(200);
    expect(legends.length).toBe(1);
    expect(legends[0].postedBy).toBe('user');
})

test('Procurar lendas', async () => {
    const req = httpMocks.createRequest({
        query: {query: 'monstro'}
    });
    const res = httpMocks.createResponse();

    await searchLegends(req, res);
    const legends = res._getJSONData();

    expect(res.statusCode).toBe(200);
    expect(legends.length).toBe(1);
    expect(legends[0].type).toBe('monstro');
})